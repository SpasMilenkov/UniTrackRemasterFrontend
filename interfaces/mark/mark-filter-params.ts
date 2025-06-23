import type { MarkType } from "~/enums/mark-type.enum";

export interface MarkFilterParams {
  studentId: string | null;
  teacherId: string | null;
  subjectId: string | null;
  type: MarkType | null;
  fromDate: Date | null;
  toDate: Date | null;
}
