import { z } from 'zod';
import { DepartmentStatus } from '~/enums/department-status.enum';
import { DepartmentType } from '~/enums/department-type.enum';

export const departmentFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code cannot exceed 20 characters'),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  contactEmail: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .nullable(),
  contactPhone: z.string().optional().nullable(),
  facultyId: z.string().uuid('Please select a valid faculty'),
  type: z.nativeEnum(DepartmentType),
  status: z.nativeEnum(DepartmentStatus),
});

export type DepartmentFormSchema = z.infer<typeof departmentFormSchema>;
export const createDepartmentSchema = departmentFormSchema;
export const updateDepartmentSchema = departmentFormSchema
  .partial()
  .required({ type: true, status: true });
