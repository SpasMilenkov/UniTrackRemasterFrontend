import type { SubjectFilters } from "./subject-filters";

export interface InstitutionSubjectFilters extends SubjectFilters {
  institutionId: string;
}
