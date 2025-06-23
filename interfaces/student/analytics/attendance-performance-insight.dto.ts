import type { SubjectAttendanceInsightDto } from "./subject-attendance-insight.dto";

export interface AttendancePerformanceInsightDto {
  studentId: string;
  studentName: string;
  period: string;
  semesterId?: string;
  semesterName: string;
  overallStudentAttendanceRate: number;
  overallStudentAverageScore: number;
  overallStudentGrade: string;
  overallClassAttendanceRate: number;
  overallClassAverageScore: number;
  overallCorrelation: number;
  attendancePerformanceClassRank: number;
  subjectInsights: SubjectAttendanceInsightDto[];
  primaryAreaForImprovement: string;
  estimatedGpaImpact: number;
}
