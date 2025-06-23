// schemas/semester.schema.ts
import { z } from 'zod';
import { SemesterType, SemesterStatus } from '~/interfaces/academic/semester';

// Helper for optional date validation
const optionalDateString = z
  .string()
  .refine((date) => !date || !isNaN(Date.parse(date)), 'Invalid date format')
  .optional();

// Required date validation
const requiredDateString = z
  .string()
  .min(1, 'Date is required')
  .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format');

// Semester type enum validation
const semesterTypeSchema = z.nativeEnum(SemesterType, {
  errorMap: () => ({ message: 'Please select a valid semester type' }),
});

// Semester status enum validation
const semesterStatusSchema = z.nativeEnum(SemesterStatus, {
  errorMap: () => ({ message: 'Please select a valid semester status' }),
});

// Base semester schema with all fields
const baseSemesterSchema = z.object({
  name: z
    .string()
    .min(1, 'Semester name is required')
    .max(100, 'Semester name must be less than 100 characters'),

  startDate: requiredDateString,
  endDate: requiredDateString,

  type: semesterTypeSchema,

  status: semesterStatusSchema.optional().default(SemesterStatus.Upcoming),

  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),

  weekCount: z
    .number()
    .int('Week count must be a whole number')
    .min(0, 'Week count cannot be negative')
    .max(52, 'Week count cannot exceed 52')
    .optional()
    .default(0),

  // Registration dates
  registrationStartDate: optionalDateString,
  registrationEndDate: optionalDateString,

  // Academic deadlines
  addDropDeadline: optionalDateString,
  withdrawalDeadline: optionalDateString,

  // Exam periods
  midtermStartDate: optionalDateString,
  midtermEndDate: optionalDateString,
  finalExamStartDate: optionalDateString,
  finalExamEndDate: optionalDateString,

  // Administrative deadlines
  gradeSubmissionDeadline: optionalDateString,
});

// Create semester schema (includes academicYearId)
export const createSemesterSchema = baseSemesterSchema
  .extend({
    academicYearId: z
      .string()
      .min(1, 'Academic year ID is required')
      .uuid('Academic year ID must be a valid UUID'),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return startDate < endDate;
    },
    {
      message: 'Start date must be before end date',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      // Validate registration dates if both are provided
      if (data.registrationStartDate && data.registrationEndDate) {
        const regStart = new Date(data.registrationStartDate);
        const regEnd = new Date(data.registrationEndDate);
        return regStart <= regEnd;
      }
      return true;
    },
    {
      message: 'Registration start date must be before or equal to end date',
      path: ['registrationEndDate'],
    }
  )
  .refine(
    (data) => {
      // Validate midterm dates if both are provided
      if (data.midtermStartDate && data.midtermEndDate) {
        const midStart = new Date(data.midtermStartDate);
        const midEnd = new Date(data.midtermEndDate);
        return midStart <= midEnd;
      }
      return true;
    },
    {
      message: 'Midterm start date must be before or equal to end date',
      path: ['midtermEndDate'],
    }
  )
  .refine(
    (data) => {
      // Validate final exam dates if both are provided
      if (data.finalExamStartDate && data.finalExamEndDate) {
        const finalStart = new Date(data.finalExamStartDate);
        const finalEnd = new Date(data.finalExamEndDate);
        return finalStart <= finalEnd;
      }
      return true;
    },
    {
      message: 'Final exam start date must be before or equal to end date',
      path: ['finalExamEndDate'],
    }
  )
  .refine(
    (data) => {
      // Ensure registration period is within semester dates
      if (data.registrationStartDate) {
        const regStart = new Date(data.registrationStartDate);
        const semStart = new Date(data.startDate);
        return regStart <= semStart;
      }
      return true;
    },
    {
      message: 'Registration start should be before or at semester start',
      path: ['registrationStartDate'],
    }
  )
  .refine(
    (data) => {
      // Ensure add/drop deadline is after semester start
      if (data.addDropDeadline) {
        const addDrop = new Date(data.addDropDeadline);
        const semStart = new Date(data.startDate);
        return addDrop >= semStart;
      }
      return true;
    },
    {
      message: 'Add/drop deadline should be after semester start',
      path: ['addDropDeadline'],
    }
  )
  .refine(
    (data) => {
      // Ensure withdrawal deadline is after add/drop deadline
      if (data.addDropDeadline && data.withdrawalDeadline) {
        const addDrop = new Date(data.addDropDeadline);
        const withdrawal = new Date(data.withdrawalDeadline);
        return withdrawal >= addDrop;
      }
      return true;
    },
    {
      message: 'Withdrawal deadline should be after add/drop deadline',
      path: ['withdrawalDeadline'],
    }
  );

// Update semester schema (no academicYearId since it can't be changed)
export const updateSemesterSchema = baseSemesterSchema
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return startDate < endDate;
    },
    {
      message: 'Start date must be before end date',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      // Apply the same validation rules as create schema
      if (data.registrationStartDate && data.registrationEndDate) {
        const regStart = new Date(data.registrationStartDate);
        const regEnd = new Date(data.registrationEndDate);
        return regStart <= regEnd;
      }
      return true;
    },
    {
      message: 'Registration start date must be before or equal to end date',
      path: ['registrationEndDate'],
    }
  )
  .refine(
    (data) => {
      if (data.midtermStartDate && data.midtermEndDate) {
        const midStart = new Date(data.midtermStartDate);
        const midEnd = new Date(data.midtermEndDate);
        return midStart <= midEnd;
      }
      return true;
    },
    {
      message: 'Midterm start date must be before or equal to end date',
      path: ['midtermEndDate'],
    }
  )
  .refine(
    (data) => {
      if (data.finalExamStartDate && data.finalExamEndDate) {
        const finalStart = new Date(data.finalExamStartDate);
        const finalEnd = new Date(data.finalExamEndDate);
        return finalStart <= finalEnd;
      }
      return true;
    },
    {
      message: 'Final exam start date must be before or equal to end date',
      path: ['finalExamEndDate'],
    }
  );

// Form schema that includes optional academicYearId for forms
export const semesterFormSchema = baseSemesterSchema.extend({
  academicYearId: z
    .string()
    .min(1, 'Academic year ID is required')
    .uuid('Academic year ID must be a valid UUID')
    .optional(),
});
// Validation helper functions
export const validateCreateSemester = (data: unknown): CreateSemesterSchema => {
  return createSemesterSchema.parse(data);
};

export const validateUpdateSemester = (data: unknown): UpdateSemesterSchema => {
  return updateSemesterSchema.parse(data);
};

export const validateSemesterForm = (data: unknown): SemesterFormSchema => {
  return semesterFormSchema.parse(data);
};

// Options for form dropdowns
export const semesterTypeOptions = Object.values(SemesterType).map((type) => ({
  label: type,
  value: type,
}));

export const semesterStatusOptions = Object.values(SemesterStatus).map(
  (status) => ({
    label: status,
    value: status,
  })
);

// Semester query schema for filtering and searching
export const semesterQuerySchema = z.object({
  academicYearId: z.string().uuid().optional(),
  type: z.nativeEnum(SemesterType).optional(),
  status: z.nativeEnum(SemesterStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().max(100).optional(),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
  sortBy: z
    .enum(['name', 'startDate', 'endDate', 'createdAt'])
    .optional()
    .default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Semester response schema for API responses
export const semesterResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.nativeEnum(SemesterType),
  status: z.nativeEnum(SemesterStatus),
  startDate: z.string(),
  endDate: z.string(),
  weekCount: z.number().int(),
  description: z.string().nullable().optional(),
  academicYearId: z.string().uuid(),
  academicYearName: z.string(),

  // Academic calendar dates
  registrationStartDate: z.string().nullable().optional(),
  registrationEndDate: z.string().nullable().optional(),
  addDropDeadline: z.string().nullable().optional(),
  withdrawalDeadline: z.string().nullable().optional(),
  midtermStartDate: z.string().nullable().optional(),
  midtermEndDate: z.string().nullable().optional(),
  finalExamStartDate: z.string().nullable().optional(),
  finalExamEndDate: z.string().nullable().optional(),
  gradeSubmissionDeadline: z.string().nullable().optional(),

  // Audit fields
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for bulk operations
export const bulkSemesterOperationSchema = z.object({
  action: z.enum(['delete', 'archive', 'activate', 'update_status']),
  semesterIds: z
    .array(z.string().uuid())
    .min(1, 'At least one semester must be selected'),
  data: z
    .object({
      status: z.nativeEnum(SemesterStatus).optional(),
    })
    .optional(),
});

// Helper schemas for specific use cases
export const semesterSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.nativeEnum(SemesterType),
  status: z.nativeEnum(SemesterStatus),
  startDate: z.string(),
  endDate: z.string(),
  academicYearName: z.string(),
});

// Form-specific schemas with institution type context
export const higherEdSemesterSchema = createSemesterSchema.refine(
  (data) => {
    // Higher education semesters should use traditional semester types
    const higherEdTypes = [
      SemesterType.Fall,
      SemesterType.Spring,
      SemesterType.Summer,
      SemesterType.Winter,
      SemesterType.Intersession,
    ];

    return higherEdTypes.includes(data.type);
  },
  {
    message: 'Invalid semester type for higher education institution',
    path: ['type'],
  }
);

export const k12TermSchema = createSemesterSchema
  .refine(
    (data) => {
      // K-12 terms should use quarter or trimester types
      const k12Types = [
        SemesterType.FirstQuarter,
        SemesterType.SecondQuarter,
        SemesterType.ThirdQuarter,
        SemesterType.FourthQuarter,
        SemesterType.FirstTrimester,
        SemesterType.SecondTrimester,
        SemesterType.ThirdTrimester,
      ];

      return k12Types.includes(data.type);
    },
    {
      message: 'Invalid term type for K-12 institution',
      path: ['type'],
    }
  )
  .transform((data) => {
    // Remove higher-ed specific fields for K-12
    return {
      ...data,
      registrationStartDate: undefined,
      registrationEndDate: undefined,
      addDropDeadline: undefined,
      withdrawalDeadline: undefined,
      finalExamStartDate: undefined,
      finalExamEndDate: undefined,
    };
  });

// Export type definitions
export type CreateSemesterSchema = z.infer<typeof createSemesterSchema>;
export type UpdateSemesterSchema = z.infer<typeof updateSemesterSchema>;
export type SemesterQuerySchema = z.infer<typeof semesterQuerySchema>;
export type SemesterResponseSchema = z.infer<typeof semesterResponseSchema>;
export type BulkSemesterOperationSchema = z.infer<
  typeof bulkSemesterOperationSchema
>;
export type SemesterSummarySchema = z.infer<typeof semesterSummarySchema>;
export type HigherEdSemesterSchema = z.infer<typeof higherEdSemesterSchema>;
export type K12TermSchema = z.infer<typeof k12TermSchema>;

// Form schema type used in components
export type SemesterFormSchema = CreateSemesterSchema;

// Validation helpers
export const validateSemesterForInstitutionType = (
  data: CreateSemesterSchema,
  isHigherEducation: boolean
): CreateSemesterSchema => {
  if (isHigherEducation) {
    return higherEdSemesterSchema.parse(data);
  } else {
    return k12TermSchema.parse(data);
  }
};

// Default values generators
export const getDefaultSemesterValues = (
  isHigherEducation: boolean,
  academicYearId?: string
): Partial<CreateSemesterSchema> => {
  const baseDefaults = {
    name: '',
    academicYearId: academicYearId || '',
    status: SemesterStatus.Upcoming,
    startDate: '',
    endDate: '',
    description: '',
  };

  if (isHigherEducation) {
    return {
      ...baseDefaults,
      type: SemesterType.Fall,
      weekCount: 16,
    };
  } else {
    return {
      ...baseDefaults,
      type: SemesterType.FirstQuarter,
      weekCount: 9,
      // Clear higher-ed specific fields
      registrationStartDate: undefined,
      registrationEndDate: undefined,
      addDropDeadline: undefined,
      withdrawalDeadline: undefined,
      finalExamStartDate: undefined,
      finalExamEndDate: undefined,
    };
  }
};

// Semester name generators based on type and year
export const generateSemesterName = (
  type: SemesterType,
  academicYearName: string,
  isHigherEducation: boolean
): string => {
  const yearPart =
    academicYearName.split('-')[0] || new Date().getFullYear().toString();

  if (isHigherEducation) {
    switch (type) {
      case SemesterType.Fall:
        return `Fall ${yearPart}`;
      case SemesterType.Spring:
        return `Spring ${parseInt(yearPart) + 1}`;
      case SemesterType.Summer:
        return `Summer ${parseInt(yearPart) + 1}`;
      case SemesterType.Winter:
        return `Winter ${parseInt(yearPart) + 1}`;
      case SemesterType.Intersession:
        return `Intersession ${yearPart}`;
      default:
        return `${type} ${yearPart}`;
    }
  } else {
    switch (type) {
      case SemesterType.FirstQuarter:
        return `Q1 ${yearPart}`;
      case SemesterType.SecondQuarter:
        return `Q2 ${yearPart}`;
      case SemesterType.ThirdQuarter:
        return `Q3 ${parseInt(yearPart) + 1}`;
      case SemesterType.FourthQuarter:
        return `Q4 ${parseInt(yearPart) + 1}`;
      case SemesterType.FirstTrimester:
        return `T1 ${yearPart}`;
      case SemesterType.SecondTrimester:
        return `T2 ${yearPart}`;
      case SemesterType.ThirdTrimester:
        return `T3 ${parseInt(yearPart) + 1}`;
      default:
        return `${type} ${yearPart}`;
    }
  }
};
