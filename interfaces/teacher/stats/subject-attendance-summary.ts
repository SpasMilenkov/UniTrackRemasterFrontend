export interface SubjectAttendanceSummary {
  subjectId: string;
  semesterId?: string;
  totalStudents: number;
  studentsWithAbsences: number;
  totalAbsences: number;
  excusedAbsences: number;
  unexcusedAbsences: number;
  averageAbsencesPerStudent: number;
}
