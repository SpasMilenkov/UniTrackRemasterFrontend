import type { GradingSystemType } from "~/enums/grading-system-type.enum";
import type { GradeScale } from "./grade-scale";

export interface GradingSystem {
  id: string;
  name: string;
  description: string;
  type: GradingSystemType;
  isDefault: boolean;
  minimumPassingScore: number;
  maximumScore: number;
  institutionId: string;
  gradeScales: GradeScale[];
}
