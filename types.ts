
export interface DataRow {
  [key: string]: any;
}

export interface ColumnProfile {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'unknown';
  missingCount: number;
  uniqueCount: number;
  mean?: number;
  median?: number;
  min?: number;
  max?: number;
  outlierCount: number;
  sampleValues: any[];
}

export interface DatasetProfile {
  rowCount: number;
  columnCount: number;
  columns: ColumnProfile[];
  duplicateCount: number;
  fileName: string;
  fileSize: number;
}

export interface CleaningTask {
  id: string;
  column: string;
  issue: string;
  recommendation: string;
  action: 'impute_mean' | 'impute_median' | 'impute_mode' | 'drop_na' | 'standardize_case' | 'remove_outliers' | 'cap_outliers' | 'convert_type' | 'remove_duplicates' | 'none';
  parameters?: any;
  applied: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface DataQualityReport {
  timestamp: string;
  originalStats: {
    rows: number;
    cols: number;
    nullPercentage: number;
  };
  cleanedStats: {
    rows: number;
    cols: number;
    nullPercentage: number;
  };
  actionsApplied: string[];
}
