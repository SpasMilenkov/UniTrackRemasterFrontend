import type { GradeAssignmentSummaryDto } from "./grade-assignment-summary.dto";

export interface TeacherGradeAssignmentSummaryDto {
  teacherId: string;
  teacherName: string;
  email: string;
  title?: string;
  totalGradesAssigned: number;
  totalStudentsImpacted: number;
  homeRoomGradeId?: string;
  homeRoomGradeName?: string;
  gradeAssignments: GradeAssignmentSummaryDto[];
}
