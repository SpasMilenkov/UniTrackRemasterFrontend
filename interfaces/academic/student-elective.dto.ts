export interface StudentElectiveResponseDto {
  id: string;
  studentId: string;
  studentName: string | null;
  subjectId: string;
  subjectName: string | null;
  enrollmentDate: string;
  status: string | null;
}
 