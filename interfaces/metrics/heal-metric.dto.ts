/**
 * Health metrics for the system
 */
export interface HealthMetricDto {
  cpuUsage: number;
  memoryUsage: number;
  activeRequests: number;
  requestsPerSecond: number;
  averageResponseTime: number;
}
