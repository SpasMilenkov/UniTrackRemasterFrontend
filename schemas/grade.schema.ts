import { z } from 'zod';

export const gradeFormSchema = z.object({
  name: z
    .string({
      required_error: 'Grade name is required',
    })
    .min(2, 'Grade name must be at least 2 characters long')
    .max(50, 'Grade name cannot exceed 50 characters'),
  institutionId: z
    .string({
      required_error: 'Institution ID is required',
    })
    .uuid('Institution ID must be a valid UUID'),
  academicYearId: z
    .string({
      required_error: 'Academic Year ID is required',
    })
    .uuid('Academic Year ID must be a valid UUID'),
  homeRoomTeacherId: z
    .string()
    .uuid('Home Room Teacher ID must be a valid UUID')
    .optional()
    .nullable(),
});

export type GradeFormSchema = z.infer<typeof gradeFormSchema>;
export const createGradeSchema = gradeFormSchema;
export const updateGradeSchema = gradeFormSchema.partial();
