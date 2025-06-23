import type { MetricDto } from "./metric.dto";

/**
 * Application performance metrics
 */
export interface ApplicationMetricsDto {
  timestamp: string;
  metrics: MetricDto[];
}
