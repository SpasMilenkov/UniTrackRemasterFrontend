export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  title?: string;
  institutionId: string;
  classGradeId?: string;
  departmentId?: string;
  specialization?: string;
  experience?: number;
  certifications?: string;
  academicLevel?: string;
  researchAreas?: string;
  qualification?: string;
}
