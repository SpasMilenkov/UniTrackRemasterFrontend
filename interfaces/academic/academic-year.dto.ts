export interface AcademicYearResponseDto {
  id: string;
  name: string | null;
  startDate: string;
  endDate: string;
  institutionId: string;
  createdAt: string;
  isActive: boolean;
  updatedAt: string;
}
