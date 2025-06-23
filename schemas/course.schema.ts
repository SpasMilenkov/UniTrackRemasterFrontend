// schemas/course.schema.ts
import { z } from 'zod';
import { CourseType } from '~/enums/course-type.enum';

export const courseFormSchema = z.object({
  code: z
    .string({
      required_error: 'Course code is required',
    })
    .min(2, 'Course code must be at least 2 characters')
    .max(20, 'Course code cannot exceed 20 characters'),
  name: z
    .string({
      required_error: 'Course name is required',
    })
    .min(3, 'Course name must be at least 3 characters')
    .max(100, 'Course name cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .nullable(),
  credits: z
    .number({
      required_error: 'Credits are required',
    })
    .min(0, 'Credits cannot be negative')
    .max(30, 'Credits cannot exceed 30'),
  type: z.nativeEnum(CourseType, {
    required_error: 'Course type is required',
  }),
  subjectId: z
    .string({
      required_error: 'Subject ID is required',
    })
    .uuid('Subject ID must be a valid UUID'),
  majorId: z
    .string()
    .uuid('Major ID must be a valid UUID')
    .optional()
    .nullable(),
  semesterId: z
    .string({
      required_error: 'Semester ID is required',
    })
    .uuid('Semester ID must be a valid UUID'),
});

export type CourseFormSchema = z.infer<typeof courseFormSchema>;
export const createCourseSchema = courseFormSchema;
export const updateCourseSchema = courseFormSchema.partial();
