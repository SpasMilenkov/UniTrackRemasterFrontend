export interface AtRiskStudentsFilterParams {
  gradeId?: string;
  subjectId?: string;
  fromDate?: string;
  toDate?: string;
  semesterId?: string;
  highRiskThreshold?: number;
  mediumRiskThreshold?: number;
  totalClassDays?: number;
}
