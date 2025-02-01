export interface StudentResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isSchoolStudent: boolean;
  isUniversityStudent: boolean;
  schoolId?: string;
  universityId?: string;
}
