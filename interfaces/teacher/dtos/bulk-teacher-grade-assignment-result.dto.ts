export interface BulkTeacherGradeAssignmentResultDto {
  success: boolean;
  message: string;
  totalTeachersProcessed: number;
  successfulAssignments: number;
  failedAssignments: number;
  errors: string[];
}
