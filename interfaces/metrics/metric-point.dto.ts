/**
 * Single datapoint for a metric
 */
export interface MetricPointDto {
  timestamp: string;
  value: number;
  labels?: Record<string, string>;
}
