import type { FocusArea } from "~/enums/focus-area.enum";

/**
 * DTO for updating an existing University
 */
export interface UpdateUniversityDto {
  focusAreas?: FocusArea[];
  undergraduateCount?: number;
  graduateCount?: number;
  acceptanceRate?: number;
  researchFunding?: number;
  hasStudentHousing?: boolean;
  departments?: string[];
}
