export interface MajorResponseDto {
  id: string;
  name: string | null;
  code: string | null;
  shortDescription: string | null;
  detailedDescription: string | null;
  requiredCredits: number;
  durationInYears: number;
  careerOpportunities: string | null;
  admissionRequirements: string | null;
  facultyId: string;
  facultyName: string | null;
  studentCount: number;
  courseCount: number;
  createdAt: string;
  updatedAt: string;
}
 