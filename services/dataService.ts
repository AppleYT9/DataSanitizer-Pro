
import { DataRow, DatasetProfile, ColumnProfile, CleaningTask } from '../types';

export const profileDataset = (data: DataRow[], fileName: string, fileSize: number): DatasetProfile => {
  if (data.length === 0) return { rowCount: 0, columnCount: 0, columns: [], duplicateCount: 0, fileName, fileSize };

  const columns = Object.keys(data[0]);
  const columnProfiles: ColumnProfile[] = columns.map(colName => {
    const values = data.map(row => row[colName]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const missingCount = data.length - nonNullValues.length;
    
    // Type detection
    let type: ColumnProfile['type'] = 'unknown';
    if (nonNullValues.length > 0) {
      const firstVal = nonNullValues[0];
      if (typeof firstVal === 'number') type = 'number';
      else if (typeof firstVal === 'boolean') type = 'boolean';
      else if (typeof firstVal === 'string') {
        if (!isNaN(Date.parse(firstVal)) && firstVal.length > 5) type = 'date';
        else type = 'string';
      }
    }

    // Numerical stats
    let stats: Partial<ColumnProfile> = {};
    if (type === 'number') {
      const nums = nonNullValues as number[];
      nums.sort((a, b) => a - b);
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      const median = nums[Math.floor(nums.length / 2)];
      
      // Basic outlier detection (IQR method)
      const q1 = nums[Math.floor(nums.length * 0.25)];
      const q3 = nums[Math.floor(nums.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      const outlierCount = nums.filter(n => n < lowerBound || n > upperBound).length;

      stats = { mean, median, min: nums[0], max: nums[nums.length - 1], outlierCount };
    } else {
      stats = { outlierCount: 0 };
    }

    return {
      name: colName,
      type,
      missingCount,
      uniqueCount: new Set(values).size,
      sampleValues: values.slice(0, 5),
      ...stats
    } as ColumnProfile;
  });

  // Duplicate detection
  const rowStrings = data.map(row => JSON.stringify(row));
  const duplicateCount = data.length - new Set(rowStrings).size;

  return {
    rowCount: data.length,
    columnCount: columns.length,
    columns: columnProfiles,
    duplicateCount,
    fileName,
    fileSize
  };
};

export const applyCleaningTasks = (data: DataRow[], tasks: CleaningTask[], profile: DatasetProfile): DataRow[] => {
  let cleaned = [...data];

  // Global actions first
  const hasDupesTask = tasks.find(t => t.action === 'remove_duplicates');
  if (hasDupesTask) {
    const seen = new Set();
    cleaned = cleaned.filter(row => {
      const s = JSON.stringify(row);
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    });
  }

  // Column specific actions
  tasks.forEach(task => {
    if (task.action === 'remove_duplicates') return; // Handled

    const colName = task.column;
    const colProfile = profile.columns.find(c => c.name === colName);

    if (task.action === 'drop_na') {
      cleaned = cleaned.filter(row => row[colName] !== null && row[colName] !== undefined && row[colName] !== '');
    } else if (task.action === 'impute_mean' && colProfile?.mean !== undefined) {
      cleaned = cleaned.map(row => (row[colName] === null || row[colName] === undefined || row[colName] === '') ? { ...row, [colName]: colProfile.mean } : row);
    } else if (task.action === 'impute_mode') {
      // Very basic mode
      const counts: any = {};
      data.forEach(r => counts[r[colName]] = (counts[r[colName]] || 0) + 1);
      const mode = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      cleaned = cleaned.map(row => (row[colName] === null || row[colName] === undefined || row[colName] === '') ? { ...row, [colName]: mode } : row);
    } else if (task.action === 'standardize_case') {
      cleaned = cleaned.map(row => typeof row[colName] === 'string' ? { ...row, [colName]: row[colName].trim().toLowerCase() } : row);
    } else if (task.action === 'remove_outliers' && colProfile) {
      // Re-run filter based on IQR bounds
      const nums = data.map(r => r[colName]).filter(v => typeof v === 'number') as number[];
      nums.sort((a, b) => a - b);
      const q1 = nums[Math.floor(nums.length * 0.25)];
      const q3 = nums[Math.floor(nums.length * 0.75)];
      const iqr = q3 - q1;
      const lower = q1 - 1.5 * iqr;
      const upper = q3 + 1.5 * iqr;
      cleaned = cleaned.filter(row => row[colName] >= lower && row[colName] <= upper);
    }
  });

  return cleaned;
};
