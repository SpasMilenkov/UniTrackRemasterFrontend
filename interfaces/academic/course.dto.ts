import type { CourseType } from "~/enums/course-type.enum";

export interface CourseResponseDto {
  id: string;
  code: string | null;
  name: string | null;
  description: string | null;
  credits: number;
  type: CourseType;
  subjectId: string;
  subjectName: string | null;
  majorId: string | null;
  majorName: string | null;
  semesterId: string;
  semesterName: string | null;
  enrolledStudentsCount: number;
  assignmentsCount: number;
  createdAt: string;
  updatedAt: string;
}
