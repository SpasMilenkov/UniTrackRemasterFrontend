export interface SubjectAttendanceInsightDto {
  subjectId: string;
  subjectName: string;
  semesterId?: string;
  semesterName: string;
  studentAttendanceRate: number;
  studentAverageScore: number;
  classAvgAttendanceRate: number;
  classAvgScore: number;
  attendanceScoreCorrelation: number;
  improvementPotential: number;
  optimalAttendanceTarget: number;
  performanceImpact: string;
  personalizedRecommendation: string;
}
