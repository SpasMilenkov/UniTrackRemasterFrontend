import type { SemesterContext } from "../shared/semester-context";

export interface AttendanceStatisticsDto extends SemesterContext {
  overallAttendanceRate: number;
  absencesByMonth: Record<string, number>;
}
