import type { TeacherAssignmentResponseDto } from "./teacher-assignment-response.dto";

export interface GradeWithTeachersResponseDto {
  id: string;
  name: string;
  institutionId: string;
  institutionName: string;
  academicYearId: string;
  academicYearName: string;
  homeRoomTeacherId?: string;
  homeRoomTeacherName?: string;
  studentCount: number;
  assignedTeachers: TeacherAssignmentResponseDto[];
  createdAt: string;
  updatedAt: string;
}
