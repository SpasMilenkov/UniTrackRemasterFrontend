// schemas/grading-system.schema.ts
import { z } from 'zod';
import { GradingSystemType } from '~/enums/grading-system-type.enum';

// Schema for a grade scale
export const gradeScaleSchema = z.object({
  grade: z
    .string()
    .min(1, 'Grade is required')
    .max(20, 'Grade must be less than 20 characters'),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  minimumScore: z
    .number()
    .min(0, 'Minimum score must be at least 0')
    .max(100, 'Minimum score cannot exceed 100'),
  maximumScore: z
    .number()
    .min(0, 'Maximum score must be at least 0')
    .max(100, 'Maximum score cannot exceed 100'),
  gpaValue: z
    .number()
    .min(0, 'GPA value must be at least 0')
    .max(4.0, 'GPA value cannot exceed 4.0'),
});

// Add refinements to ensure minimum is less than maximum
export const validatedGradeScaleSchema = gradeScaleSchema.refine(
  (data) => data.minimumScore < data.maximumScore,
  {
    message: 'Minimum score must be less than maximum score',
    path: ['minimumScore'],
  }
);

// Schema for creating a grading system
export const createGradingSystemSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  type: z.nativeEnum(GradingSystemType, {
    errorMap: () => ({ message: 'Please select a valid grading system type' }),
  }),
  isDefault: z.boolean().default(false),
  minimumPassingScore: z
    .number()
    .min(0, 'Minimum passing score must be at least 0')
    .max(100, 'Minimum passing score cannot exceed 100'),
  maximumScore: z
    .number()
    .min(0, 'Maximum score must be at least 0')
    .max(100, 'Maximum score cannot exceed 100')
    .default(100),
  institutionId: z.string().uuid('Institution ID must be a valid UUID'),
  gradeScales: z.array(validatedGradeScaleSchema).optional(),
});

// Add refinement to ensure minimumPassingScore < maximumScore
export const validatedCreateGradingSystemSchema =
  createGradingSystemSchema.refine(
    (data) => data.minimumPassingScore < data.maximumScore,
    {
      message: 'Minimum passing score must be less than maximum score',
      path: ['minimumPassingScore'],
    }
  );

// Validate grade scales don't overlap
export const fullGradingSystemValidation =
  validatedCreateGradingSystemSchema.refine(
    (data) => {
      if (!data.gradeScales || data.gradeScales.length <= 1) return true;

      // Sort scales by minimumScore
      const sortedScales = [...data.gradeScales].sort(
        (a, b) => a.minimumScore - b.minimumScore
      );

      // Check for overlaps
      for (let i = 0; i < sortedScales.length - 1; i++) {
        if (sortedScales[i].maximumScore > sortedScales[i + 1].minimumScore) {
          return false;
        }
      }

      return true;
    },
    {
      message: 'Grade scales cannot overlap with each other',
      path: ['gradeScales'],
    }
  );

// Ensure full coverage from 0 to maximum
export const completeGradingSystemSchema = fullGradingSystemValidation.refine(
  (data) => {
    if (!data.gradeScales || data.gradeScales.length === 0) return true;

    // Sort scales by minimumScore
    const sortedScales = [...data.gradeScales].sort(
      (a, b) => a.minimumScore - b.minimumScore
    );

    // Check if the minimum scale starts at 0
    const startsAtZero = Math.abs(sortedScales[0].minimumScore) < 0.001;

    // Check if the maximum scale ends at the maximum score
    const endsAtMax =
      Math.abs(
        sortedScales[sortedScales.length - 1].maximumScore - data.maximumScore
      ) < 0.001;

    // Check for gaps
    for (let i = 0; i < sortedScales.length - 1; i++) {
      if (
        Math.abs(
          sortedScales[i].maximumScore - sortedScales[i + 1].minimumScore
        ) > 0.001
      ) {
        return false;
      }
    }

    return startsAtZero && endsAtMax;
  },
  {
    message:
      'Grade scales must cover the entire range from 0 to maximum score without gaps',
    path: ['gradeScales'],
  }
);

// Schema for updating a grading system
export const updateGradingSystemSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  isDefault: z.boolean().optional(),
  minimumPassingScore: z
    .number()
    .min(0, 'Minimum passing score must be at least 0')
    .max(100, 'Minimum passing score cannot exceed 100')
    .optional(),
  maximumScore: z
    .number()
    .min(0, 'Maximum score must be at least 0')
    .max(100, 'Maximum score cannot exceed 100')
    .optional(),
  gradeScales: z.array(validatedGradeScaleSchema).optional(),
});

// Add refinement for the update schema too
export const validatedUpdateGradingSystemSchema =
  updateGradingSystemSchema.refine(
    (data) => {
      if (
        data.minimumPassingScore === undefined ||
        data.maximumScore === undefined
      )
        return true;
      return data.minimumPassingScore < data.maximumScore;
    },
    {
      message: 'Minimum passing score must be less than maximum score',
      path: ['minimumPassingScore'],
    }
  );

// Export types for use in components
export type GradeScaleFormData = z.infer<typeof validatedGradeScaleSchema>;
export type CreateGradingSystemFormData = z.infer<
  typeof completeGradingSystemSchema
>;
export type UpdateGradingSystemFormData = z.infer<
  typeof validatedUpdateGradingSystemSchema
>;
