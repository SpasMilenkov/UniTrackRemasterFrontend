import type { AcademicStatisticsDto } from './academic-statistics.dto';
import type { ActivityStatisticsDto } from './activity-statistics.dto';
import type { UserStatisticsDto } from './user-statistics.dto';

/**
 * Combined system statistics
 */
export interface SystemStatisticsDto {
  collectedAt: string;
  users: UserStatisticsDto;
  academic: AcademicStatisticsDto;
  activity: ActivityStatisticsDto;
}
