import type { AccreditationType } from "~/enums/accreditation-type.enum";
import type { FocusArea } from "~/enums/focus-area.enum";

export interface InitUniversityDto {
  id: string;
  name: string;
  motto: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  establishedDate: Date;
  undergraduateCount: number;
  graduateCount: number;
  acceptanceRate: number;
  researchFunding: number;
  hasStudentHousing: boolean;
  focusAreas: FocusArea[];
  departments: string[];
  accreditations: AccreditationType[];
}
