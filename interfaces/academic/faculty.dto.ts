import type { FacultyStatus } from '~/enums/faculty-status.enum';

export interface FacultyResponseDto {
  id: string;
  name: string | null;
  code: string | null;
  shortDescription: string | null;
  detailedDescription: string | null;
  website: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: FacultyStatus;
  universityId: string;
  universityName: string | null;
  majorsCount: number;
  departmentsCount: number;
  createdAt: string;
  updatedAt: string;
}
