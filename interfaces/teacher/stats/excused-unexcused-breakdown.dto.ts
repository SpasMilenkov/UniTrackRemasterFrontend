import type { SubjectExcusedUnexcusedDto } from "../responses/subject-excused-unexcused.dto";
import type { SemesterContext } from "../shared/semester-context";

export interface ExcusedUnexcusedBreakdownDto extends SemesterContext {
  excusedCount: number;
  unexcusedCount: number;
  excusedPercentage: number;
  unexcusedPercentage: number;
  subjectBreakdown: SubjectExcusedUnexcusedDto[];
}
