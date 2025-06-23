import type { GradeAssignmentResponseDto } from "./grade-assignment-response.dto";
import type { SubjectResponseDto } from "./subject-response.dto";

export interface TeacherWithGradeAssignmentsResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  institutionId: string;
  institutionName: string;
  classGradeId?: string;
  classGradeName?: string;
  status: string;
  assignedGrades: GradeAssignmentResponseDto[];
  assignedSubjects: SubjectResponseDto[];
  createdAt: string;
  updatedAt: string;
}
