/**
 * Metrics about system activities
 */
export interface ActivityStatisticsDto {
    totalAttendances: number;
    totalMarks: number;
    totalApplications: number;
    attendanceByStatus?: Record<string, number>;
    applicationsByStatus?: Record<string, number>;
  }