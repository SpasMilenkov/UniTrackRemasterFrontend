import type { FocusArea } from "~/enums/focus-area.enum";

/**
 * Response DTO for University
 */
export interface UniversityResponseDto {
  id: string;
  institutionId: string;
  name: string;
  description: string;
  motto: string;
  website: string;
  establishedDate: string | Date;
  focusAreas: FocusArea[];
  undergraduateCount: number;
  graduateCount: number;
  acceptanceRate: number;
  researchFunding: number;
  hasStudentHousing: boolean;
  departments: string[];
  facultiesCount: number;
  email: string;
  phone: string;
}
