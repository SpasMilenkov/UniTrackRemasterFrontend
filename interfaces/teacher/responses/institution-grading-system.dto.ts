import type { GradeScaleDto } from "../grading/grade-scale.dto";

export interface InstitutionGradingSystemDto {
  id: string;
  institutionId: string;
  name: string;
  description?: string;
  minimumPassingScore: number;
  maximumScore: number;
  gradeScales: GradeScaleDto[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
