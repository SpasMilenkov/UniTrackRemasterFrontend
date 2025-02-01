export interface SchoolFilterParams {
    searchTerm?: string;
    institutionType?: string[];
    schoolType?: string[];
    universityType?: string[];
    schoolLevel?: string[];
    universityLevel?: string[];
    location?: string[];
    focusArea?: string[];
    page: number;
    pageSize: number;
  }