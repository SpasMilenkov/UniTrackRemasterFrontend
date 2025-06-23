/**
 * HTTP request metrics
 */
export interface RequestMetricsDto {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsByEndpoint?: Record<string, number>;
  responseTimeByEndpoint?: Record<string, number>;
}
