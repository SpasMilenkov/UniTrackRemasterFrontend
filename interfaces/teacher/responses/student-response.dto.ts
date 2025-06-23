export interface StudentResponseDto {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isSchoolStudent: boolean;
  isUniversityStudent: boolean;
  schoolId?: string;
  schoolName?: string;
  universityId?: string;
  universityName?: string;
  gradeId: string;
  gradeName?: string;
  markCount?: number;
  attendanceCount?: number;
  clubMembershipsCount?: number;
  electivesCount?: number;
  createdAt: string;
  updatedAt: string;
}
