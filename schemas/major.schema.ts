import { z } from 'zod';

export const majorFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code cannot exceed 20 characters'),
  shortDescription: z
    .string()
    .min(10, 'Short description must be at least 10 characters'),
  detailedDescription: z.string().optional(),
  requiredCredits: z.number().int().min(0, 'Credits cannot be negative'),
  durationInYears: z
    .number()
    .int()
    .min(1, 'Duration must be at least 1 year')
    .max(10, 'Duration cannot exceed 10 years'),
  careerOpportunities: z.string().optional(),
  admissionRequirements: z.string().optional(),
  facultyId: z.string().uuid('Please select a valid faculty'),
});

export type MajorFormSchema = z.infer<typeof majorFormSchema>;

export const createMajorSchema = majorFormSchema;
export const updateMajorSchema = majorFormSchema.partial();