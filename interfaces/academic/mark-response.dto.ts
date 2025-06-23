import type { MarkType } from '~/enums/mark-type.enum';

export interface MarkResponseDto {
  id: string;
  value: number;
  topic: string;
  description: string | null;
  type: MarkType;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  createdAt: string;
  updatedAt: string;
}
