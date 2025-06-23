import type { SemesterSummaryDto } from "./semester-summary.dto";
import type { AttendancePerformanceInsightDto } from "./attendance-performance-insight.dto";

export interface AcademicYearInsightDto {
  academicYearName: string;
  overallGPA: number;
  semesters: SemesterSummaryDto[];
  attendanceInsight: AttendancePerformanceInsightDto;
}
