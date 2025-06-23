import { z } from 'zod';

// Base schema without validation
export const academicYearFormSchema = z.object({
  name: z
    .string({
      required_error: 'Academic year name is required',
    })
    .min(2, 'Academic year name must be at least 2 characters long')
    .max(50, 'Academic year name cannot exceed 50 characters'),
  startDate: z
    .string({
      required_error: 'Start date is required',
    })
    .datetime({ message: 'Invalid start date format' }),
  endDate: z
    .string({
      required_error: 'End date is required',
    })
    .datetime({ message: 'Invalid end date format' }),
  institutionId: z
    .string({
      required_error: 'Institution ID is required',
    })
    .uuid('Institution ID must be a valid UUID'),
});

// Create the refined schema for creation (with date validation)
export const createAcademicYearSchema = academicYearFormSchema.refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start < end;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// Create the partial schema for updates (with conditional date validation)
export const updateAcademicYearSchema = academicYearFormSchema.partial().refine(
  (data) => {
    // Only validate dates if both are provided
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start < end;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// Export TypeScript types
export type AcademicYearFormSchema = z.infer<typeof academicYearFormSchema>;
export type CreateAcademicYearSchema = z.infer<typeof createAcademicYearSchema>;
export type UpdateAcademicYearSchema = z.infer<typeof updateAcademicYearSchema>;
