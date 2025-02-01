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
  focusAreas: number[];
  departments: string[];
  accreditations: number[];
}
