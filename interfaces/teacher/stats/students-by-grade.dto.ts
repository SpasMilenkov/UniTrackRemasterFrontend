import type { StudentResponseDto } from "../responses/student-response.dto";

export interface StudentsByGradeDto {
  gradeId: string;
  gradeName: string;
  students: StudentResponseDto[];
}
