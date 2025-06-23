export interface SearchParams {
  query?: string;
  gradeId?: string | null;
  schoolId?: string | null;
  universityId?: string | null;
  isSchoolStudent?: boolean | null;
  isUniversityStudent?: boolean | null;
}

export interface SemesterAnalyticsParams {
  term?: SemesterType | null;
  academicYear?: string | null;
  semesterId?: string | null;
}

export interface PaginatedStudentResponseDto {
  students: Student[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface StudentSearchParams {
  query?: string;
  gradeId?: string | null;
  schoolId?: string | null;
  universityId?: string | null;
  isSchoolStudent?: boolean | null;
  isUniversityStudent?: boolean | null;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  ascending?: boolean;
}
