/**
 * Metrics about academic entities
 */
export interface AcademicStatisticsDto {
  totalInstitutions: number;
  schoolCount: number;
  universityCount: number;
  facultyCount: number;
  departmentCount: number;
  majorCount: number;
  subjectCount: number;
  gradeCount: number;
  institutionsByType?: Record<string, number>;
}
