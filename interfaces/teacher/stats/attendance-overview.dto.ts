import type { SemesterContext } from "../shared/semester-context";

export interface AttendanceOverviewDto extends SemesterContext {
  totalAbsences: number;
  recentAbsences: number;
  absencesByStatus: Record<string, number>;
  dailyAbsenceTrend: Record<string, number>;
}
