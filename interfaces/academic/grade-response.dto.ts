export interface GradeResponseDto {
  id: string;
  name: string;
  institutionId: string;
  institutionName: string;
  academicYearId: string;
  academicYearName: string;
  homeRoomTeacherId?: string;
  homeRoomTeacherName?: string;
  studentsCount: number;
  createdAt: string;
  updatedAt: string;
}
