export interface GradeAssignmentResponseDto {
  id: string;
  name: string;
  institutionId: string;
  institutionName: string;
  academicYearId: string;
  academicYearName: string;
  studentCount: number;
  isHomeroom: boolean;
  createdAt: string;
}
