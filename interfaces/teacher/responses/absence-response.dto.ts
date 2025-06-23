import type { SemesterContext } from "../shared/semester-context";

export interface AbsenceResponseDto extends SemesterContext {
  id: string;
  date: string;
  status: string;
  reason?: string;
  isExcused: boolean;
  studentId: string;
  studentName?: string;
  subjectId?: string;
  subjectName?: string;
  createdAt: string;
  updatedAt: string;
}
