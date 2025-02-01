import type { Institution } from './institution';

export interface University extends Institution {
  levels: string[];
  focusAreas: string[];
  undergraduateCount: number;
  graduateCount: number;
  acceptanceRate: number;
  researchFunding: number;
  hasStudentHousing: boolean;
  departments: string[];
}
