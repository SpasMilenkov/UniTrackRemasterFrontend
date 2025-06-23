import type { SemesterContext } from "../shared/semester-context";
import type { AtRiskStudentDto } from "./at-risk-student.dto";

export interface AtRiskStudentsResponseDto extends SemesterContext {
  highRiskThreshold: number;
  mediumRiskThreshold: number;
  totalClassDays: number;
  atRiskStudents: AtRiskStudentDto[]; // RENAMED: was atRiskStudents
}
