export interface SubjectFilters {
  query?: string;
  departmentId?: string | null;
  academicLevel?: string | null;
  electiveType?: string | null;
  hasLab?: boolean | null;
  isElective?: boolean | null;
  page?: number;
  pageSize?: number;
}
