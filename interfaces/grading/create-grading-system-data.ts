import type { GradingSystemType } from "~/enums/grading-system-type.enum";
import type { CreateGradeScaleData } from "./create-grade-scale-data";

export interface CreateGradingSystemData {
  name: string;
  description?: string;
  type: GradingSystemType;
  isDefault: boolean;
  minimumPassingScore: number;
  maximumScore: number;
  institutionId: string;
  gradeScales?: CreateGradeScaleData[];
}
