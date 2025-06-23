// interfaces/academic/teacher.dto.ts

export interface TeacherResponseDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  title: string | null;
  institutionId: string;
  classGradeId: string | null;
  // Optional fields that might be included in API responses
  institutionName?: string | null;
  classGradeName?: string | null;
  subjectsCount?: number;
  studentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
