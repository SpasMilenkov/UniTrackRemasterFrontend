import type { CreateGradeScaleData } from "./create-grade-scale-data";

export interface UpdateGradingSystemData {
  name?: string;
  description?: string;
  isDefault?: boolean;
  minimumPassingScore?: number;
  maximumScore?: number;
  gradeScales?: CreateGradeScaleData[];
}
