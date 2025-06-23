import type { DepartmentStatus } from '~/enums/department-status.enum';
import type { DepartmentType } from '~/enums/department-type.enum';

/**
 * Department Response DTO
 *
 * This interface represents the data structure returned by the API
 * for a department entity
 */
export interface DepartmentResponseDto {
  id: string;
  name: string | null;
  code: string | null;
  description: string | null;
  location: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  type: DepartmentType;
  status: DepartmentStatus;
  facultyId: string;
  facultyName: string | null;
  teachersCount: number;
  createdAt: string;
  updatedAt: string;
}
