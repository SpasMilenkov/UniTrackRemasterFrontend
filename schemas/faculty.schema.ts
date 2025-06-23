import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';
import { FacultyStatus } from '~/enums/faculty-status.enum';

export const facultyFormSchema = z.object({
  name: z
    .string({
      required_error: 'Faculty name is required',
    })
    .min(2, 'Faculty name must be at least 2 characters long')
    .max(100, 'Faculty name cannot exceed 100 characters'),

  code: z
    .string({
      required_error: 'Faculty code is required',
    })
    .min(2, 'Faculty code must be at least 2 characters long')
    .max(20, 'Faculty code cannot exceed 20 characters'),

  shortDescription: z
    .string({
      required_error: 'Short description is required',
    })
    .min(5, 'Short description must be at least 5 characters long')
    .max(200, 'Short description cannot exceed 200 characters'),

  detailedDescription: z
    .string({
      required_error: 'Detailed description is required',
    })
    .min(10, 'Detailed description must be at least 10 characters long')
    .max(2000, 'Detailed description cannot exceed 2000 characters'),

  website: z.string().url('Website must be a valid URL').optional().nullable(),

  contactEmail: z
    .string()
    .email('Contact email must be a valid email address')
    .optional()
    .nullable(),

  contactPhone: z
    .string()
    .refine((value) => !value || isPossiblePhoneNumber(value, 'BG'), {
      message: 'Contact phone must be a valid phone number',
    })
    .optional()
    .nullable(),

  status: z.nativeEnum(FacultyStatus, {
    required_error: 'Faculty status is required',
  }),

  universityId: z
    .string({
      required_error: 'University ID is required',
    })
    .uuid('University ID must be a valid UUID'),
});

export type FacultyFormSchema = z.infer<typeof facultyFormSchema>;
export const createFacultySchema = facultyFormSchema;
export const updateFacultySchema = facultyFormSchema
  .partial()
  .required({ status: true });
