import type { StudentResponseDto } from "./student-response.dto";
import type { SubjectResponseDto } from "./subject-response.dto";

export interface TeacherResponseDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  title: string | null;
  institutionId: string;
  classGradeId: string | null;
  departmentId?: string | null;
  subjects?: SubjectResponseDto[];
  students?: StudentResponseDto[];
  marksGiven?: number;
  attendanceRecords?: number;
}
