import type { SemesterContext } from "../shared/semester-context";

export interface MarkResponseDto extends SemesterContext {
  id: string;
  value: number;
  grade?: string;
  gpaPoints?: number;
  status?: string;
  topic?: string;
  description?: string;
  type: string;
  subjectId: string;
  subjectName?: string;
  teacherId: string;
  teacherName?: string;
  studentId: string;
  studentName?: string;
  createdAt: string;
  updatedAt: string;
}
