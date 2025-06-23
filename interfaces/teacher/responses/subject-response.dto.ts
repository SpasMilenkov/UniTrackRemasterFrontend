export interface SubjectResponseDto {
  id: string;
  name: string;
  code: string;
  shortDescription?: string;
  detailedDescription?: string;
  subjectType: string;
  academicLevel: string;
  minGradeLevel?: number;
  maxGradeLevel?: number;
  creditHours?: number;
  creditValue?: number;
  isElective: boolean;
  electiveType?: string;
  maxStudents?: number;
  hasLab: boolean;
  primaryTeacherId?: string;
  primaryTeacherName?: string;
  departmentId?: string;
  departmentName?: string;
  createdAt: string;
  updatedAt: string;
}
