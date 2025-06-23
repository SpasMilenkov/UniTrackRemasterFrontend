// schemas/mark.schema.ts
import { z } from 'zod';
import { MarkType } from '~/enums/mark-type.enum';

const baseMarkFormSchema = z.object({
  grade: z.string().optional().nullable(),
  score: z
    .number()
    .min(0, 'Score must be at least 0')
    .max(100, 'Score cannot exceed 100')
    .optional()
    .nullable(),
  topic: z
    .string({
      required_error: 'Topic is required',
    })
    .min(2, 'Topic must be at least 2 characters long')
    .max(100, 'Topic cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .nullable(),
  type: z.nativeEnum(MarkType, {
    required_error: 'Mark type is required',
  }),
  subjectId: z
    .string({
      required_error: 'Subject ID is required',
    })
    .uuid('Subject ID must be a valid UUID'),
  teacherId: z
    .string({
      required_error: 'Teacher ID is required',
    })
    .uuid('Teacher ID must be a valid UUID'),
  studentId: z
    .string({
      required_error: 'Student ID is required',
    })
    .uuid('Student ID must be a valid UUID'),
  semesterId: z
    .string()
    .uuid('Semester ID must be a valid UUID')
    .optional()
    .nullable()
    .or(z.literal('').transform(() => null)), // Transform empty string to null
});

// Main form schema with validation refinement
export const markFormSchema = baseMarkFormSchema.refine(
  (data) => {
    // Either grade (string) or score (number) must be provided
    const hasGrade = data.grade && data.grade.trim().length > 0;
    const hasScore =
      data.score !== null && data.score !== undefined && !isNaN(data.score);
    return hasGrade || hasScore;
  },
  {
    message: 'Either grade or score must be provided',
    path: ['grade'], // This will show the error on the grade field
  }
);

export type MarkFormSchema = z.infer<typeof markFormSchema>;

// Create schema (same as form schema)
export const createMarkSchema = markFormSchema;

// Update schema (partial with the same validation)
export const updateMarkSchema = baseMarkFormSchema.partial().refine(
  (data) => {
    // For updates, allow empty object but if data exists, require either grade or score
    if (Object.keys(data).length === 0) return true;

    const hasGrade = data.grade && data.grade.trim().length > 0;
    const hasScore =
      data.score !== null && data.score !== undefined && !isNaN(data.score);

    // If neither grade nor score fields are being updated, it's valid
    if (!('grade' in data) && !('score' in data)) return true;

    // If either field is being updated, at least one must have a value
    return hasGrade || hasScore;
  },
  {
    message: 'Either grade or score must be provided',
    path: ['grade'],
  }
);

export type CreateMarkSchema = z.infer<typeof createMarkSchema>;
export type UpdateMarkSchema = z.infer<typeof updateMarkSchema>;
