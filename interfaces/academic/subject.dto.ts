// interfaces/academic/subject.dto.ts
import type { SubjectType } from '~/enums/subject-type.enum';
import type { AcademicLevel } from '~/enums/academic-level.enum';
import type { ElectiveType } from '~/enums/elective-type.enum';

export interface SubjectResponseDto {
  id: string;
  name: string | null;
  code: string | null;
  shortDescription: string | null;
  detailedDescription: string | null;
  subjectType: SubjectType;
  academicLevel: AcademicLevel;
  minGradeLevel: number | null;
  maxGradeLevel: number | null;
  creditHours: number | null;
  creditValue: number | null;
  isElective: boolean;
  electiveType: ElectiveType | null;
  maxStudents: number | null;
  hasLab: boolean;
  primaryTeacherId: string | null;
  primaryTeacherName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  enrollmentsCount?: number; // Count of student enrollments for electives
  createdAt: string;
  updatedAt: string;
}
