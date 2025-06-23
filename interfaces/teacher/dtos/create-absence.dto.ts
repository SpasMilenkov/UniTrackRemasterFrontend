export interface CreateAbsenceDto {
  date: string;
  status: string;
  reason?: string;
  isExcused: boolean;
  studentId: string;
  courseId?: string;
  subjectId?: string;
  teacherId?: string;
  semesterId?: string;
}
