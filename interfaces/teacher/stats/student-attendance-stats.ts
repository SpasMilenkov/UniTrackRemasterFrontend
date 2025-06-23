export interface StudentAttendanceStats {
  studentId: string;
  semesterId?: string;
  totalAbsences: number;
  excusedAbsences: number;
  unexcusedAbsences: number;
  attendanceRate: number;
  totalSchoolDays: number;
  attendedDays: number;
}
