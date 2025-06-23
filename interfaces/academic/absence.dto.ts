import type { AbsenceStatus } from '~/enums/absence-status.enum';

export interface AbsenceResponseDto {
  id: string;
  date: Date;
  status: AbsenceStatus;
  reason: string | null;
  isExcused: boolean;
  studentId: string;
  studentName: string;
  courseId: string | null;
  courseName: string | null;
  subjectId: string | null;
  subjectName: string | null;
  createdAt: Date;
  updatedAt: Date;
}
