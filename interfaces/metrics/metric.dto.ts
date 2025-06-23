import type { MetricPointDto } from "./metric-point.dto";

/**
 * Description and data points for a metric
 */
export interface MetricDto {
  name: string;
  description?: string;
  unit?: string;
  points: MetricPointDto[];
}
