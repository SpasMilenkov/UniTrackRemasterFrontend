export interface TeacherGradeAssignmentResultDto {
  success: boolean;
  message: string;
  teacherId: string;
  assignedGradeIds: string[];
  totalGradesAssigned: number;
  totalStudentsImpacted: number;
}
