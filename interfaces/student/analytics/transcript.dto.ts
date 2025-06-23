import type { CourseGradeDto } from "./course-grade.dto";
import type { SemesterSummaryDto } from "./semester-summary.dto";

export interface TranscriptDto {
  courses: CourseGradeDto[];
  totalCreditsAttempted: number;
  totalCreditsEarned: number;
  majorCreditsCompleted: number;
  majorCreditsRequired: number;
  genEdCreditsCompleted: number;
  genEdCreditsRequired: number;
  gpaByTerm: Record<string, number>;
  semesterSummaries: Record<string, SemesterSummaryDto>;
}
