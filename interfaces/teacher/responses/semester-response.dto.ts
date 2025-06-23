export interface SemesterResponseDto {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isCurrent: boolean;
  academicYearId: string;
  academicYearName: string;
  institutionId: string;
  institutionName: string;
  createdAt: string;
  updatedAt: string;
}
