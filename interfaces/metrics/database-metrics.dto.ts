/**
 * Database performance metrics
 */
export interface DatabaseMetricsDto {
  activeConnections: number;
  maxConnections: number;
  averageQueryTime: number;
  queryCount: number;
  errorCount: number;
}
