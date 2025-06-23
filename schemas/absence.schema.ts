// schemas/absence.schema.ts
import { z } from 'zod';
import { AbsenceStatus } from '~/enums/absence-status.enum';

export const absenceFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required',
  }),
  status: z.nativeEnum(AbsenceStatus, {
    required_error: 'Attendance status is required',
  }),
  reason: z
    .string()
    .max(500, 'Reason cannot exceed 500 characters')
    .optional()
    .nullable(),
  isExcused: z.boolean().default(false),
  studentId: z
    .string({
      required_error: 'Student ID is required',
    })
    .uuid('Student ID must be a valid UUID'),
  teacherId: z.string().uuid('Teacher ID must be a valid UUID'),
  subjectId: z
    .string()
    .uuid('Subject ID must be a valid UUID')
    .optional()
    .nullable(),
});

export type AbsenceFormSchema = z.infer<typeof absenceFormSchema>;
export const createAbsenceSchema = absenceFormSchema;
export const updateAbsenceSchema = absenceFormSchema
  .partial()
  .required({ status: true }); // Always require a status for updates
