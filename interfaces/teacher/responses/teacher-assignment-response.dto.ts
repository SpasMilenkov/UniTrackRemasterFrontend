export interface TeacherAssignmentResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  status: string;
  isHomeroom: boolean;
  subjectCount: number;
}
