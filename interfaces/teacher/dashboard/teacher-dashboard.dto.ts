import type { StudentsByGradeDto } from "~/interfaces/event";
import type { AbsenceResponseDto } from "../responses/absence-response.dto";
import type { MarkResponseDto } from "../responses/mark-response.dto";
import type { SubjectResponseDto } from "../responses/subject-response.dto";
import type { SemesterContext } from "../shared/semester-context";

export interface TeacherDashboardDto extends SemesterContext {
  teacherId: string;
  teacherName: string;
  totalSubjects: number;
  totalStudents: number;
  totalMarksGiven: number;
  totalAbsencesRecorded: number;
  subjects: SubjectResponseDto[];
  studentsByGrade: StudentsByGradeDto[];
  recentMarks: MarkResponseDto[];
  recentAbsences: AbsenceResponseDto[];
  averageMarksBySubject: { [key: string]: number };
}
