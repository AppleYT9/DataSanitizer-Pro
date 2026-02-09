
import { GoogleGenAI, Type } from "@google/genai";
import { DatasetProfile, CleaningTask, DataRow } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAiCleaningRecommendations(profile: DatasetProfile, sampleData: DataRow[]): Promise<CleaningTask[]> {
  try {
    const prompt = `Analyze this dataset profile and sample data to recommend cleaning tasks. 
    Dataset: ${profile.fileName}
    Rows: ${profile.rowCount}, Columns: ${profile.columnCount}
    Column Stats: ${JSON.stringify(profile.columns.map(c => ({ name: c.name, type: c.type, nulls: c.missingCount, unique: c.uniqueCount, outliers: c.outlierCount })))}
    Sample Data (First 15 rows): ${JSON.stringify(sampleData)}
    
    Recommend specific actions for problematic columns. Priorities should be high (missing critical data), medium (inconsistencies), low (minor cleanup).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              column: { type: Type.STRING },
              issue: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              action: { 
                type: Type.STRING,
                description: 'Must be one of: impute_mean, impute_median, impute_mode, drop_na, standardize_case, remove_outliers, cap_outliers, convert_type, remove_duplicates'
              },
              priority: { type: Type.STRING, description: 'high, medium, or low' }
            },
            required: ['column', 'issue', 'recommendation', 'action', 'priority']
          }
        }
      }
    });

    const tasksJson = JSON.parse(response.text.trim());
    return tasksJson.map((t: any, i: number) => ({
      ...t,
      id: `task-${i}`,
      applied: t.priority === 'high' // Auto-select high priority
    }));
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return basic fallback recommendations based on profile if AI fails
    return fallbackRecommendations(profile);
  }
}

function fallbackRecommendations(profile: DatasetProfile): CleaningTask[] {
  const tasks: CleaningTask[] = [];
  
  if (profile.duplicateCount > 0) {
    tasks.push({
      id: 'dupes',
      column: 'All Columns',
      issue: 'Duplicate rows detected',
      recommendation: `Remove ${profile.duplicateCount} redundant rows to ensure uniqueness.`,
      action: 'remove_duplicates',
      applied: true,
      priority: 'high'
    });
  }

  profile.columns.forEach((col, i) => {
    if (col.missingCount > 0) {
      tasks.push({
        id: `missing-${i}`,
        column: col.name,
        issue: 'Missing values found',
        recommendation: col.type === 'number' ? 'Impute missing values with column mean.' : 'Drop rows with missing values.',
        action: col.type === 'number' ? 'impute_mean' : 'drop_na',
        applied: col.missingCount / profile.rowCount > 0.05,
        priority: 'medium'
      });
    }
    if (col.type === 'string' && col.uniqueCount < profile.rowCount * 0.5) {
      tasks.push({
        id: `case-${i}`,
        column: col.name,
        issue: 'Potential case inconsistency',
        recommendation: 'Standardize string values to lowercase and trim whitespace.',
        action: 'standardize_case',
        applied: false,
        priority: 'low'
      });
    }
  });

  return tasks;
}
