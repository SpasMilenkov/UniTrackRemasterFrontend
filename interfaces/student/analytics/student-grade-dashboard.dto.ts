import type { CourseGradeDto } from "./course-grade.dto";
import type { TeacherCommentDto } from "./teacher-comment.dto";
import type { GradeDistributionDto } from "./grade-distribution.dto";
import type { PerformanceTrendDto } from "./performance-trend.dto";
import type { SemesterSummaryDto } from "./semester-summary.dto";

export interface StudentGradeDashboardDto {
  gpa: number;
  gpaTrend: number;
  classRank?: number;
  classAverage?: number;
  courses: CourseGradeDto[];
  comments: TeacherCommentDto[];
  gradeDistribution: GradeDistributionDto;
  performanceTrend: PerformanceTrendDto;
  currentSemesterId?: string;
  currentSemesterName: string;
  semesterBreakdown: SemesterSummaryDto[];
}
