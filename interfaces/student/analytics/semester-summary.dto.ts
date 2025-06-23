import type { CourseGradeDto } from "./course-grade.dto";

export interface SemesterSummaryDto {
  semesterId: string;
  semesterName: string;
  semesterType: string;
  academicYear: string;
  gpa: number;
  credits: number;
  courses: CourseGradeDto[];
}
