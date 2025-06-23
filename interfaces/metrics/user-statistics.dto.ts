/**
 * Application-wide metrics about all users
 */
export interface UserStatisticsDto {
  totalUsers: number;
  activeUsers: number;
  adminCount: number;
  teacherCount: number;
  studentCount: number;
  parentCount: number;
  usersByRole?: Record<string, number>;
}
