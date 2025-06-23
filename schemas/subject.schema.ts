// schemas/subject.schema.ts
import { z } from 'zod';
import { SubjectType } from '~/enums/subject-type.enum';
import { AcademicLevel } from '~/enums/academic-level.enum';
import { ElectiveType } from '~/enums/elective-type.enum';

// Base schema with common fields
const baseSubjectSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100),
  code: z
    .string()
    .min(2, { message: 'Code must be at least 2 characters' })
    .max(20),
  shortDescription: z.string().max(200).optional().nullable(),
  detailedDescription: z.string().max(2000).optional().nullable(),
  subjectType: z.nativeEnum(SubjectType),
  academicLevel: z.nativeEnum(AcademicLevel),
  isElective: z.boolean().default(false),
  hasLab: z.boolean().default(false),
  primaryTeacherId: z.string().uuid().optional().nullable(),
  departmentId: z.string().uuid().optional().nullable(),

  // Fields that are conditional based on subject type
  minGradeLevel: z.number().int().min(1).max(12).optional().nullable(),
  maxGradeLevel: z.number().int().min(1).max(12).optional().nullable(),
  creditHours: z.number().int().min(1).max(12).optional().nullable(),
  creditValue: z.number().min(0.5).max(10).optional().nullable(),
  electiveType: z.nativeEnum(ElectiveType).optional().nullable(),
  maxStudents: z.number().int().min(1).max(100).optional().nullable(),
  institutionId: z.string().uuid(),
});

// Create the form schema with refinements
export const subjectFormSchema = baseSubjectSchema
  .refine(
    (data) => {
      // If both min and max grade levels are provided, ensure min <= max
      if (
        data.minGradeLevel !== null &&
        data.minGradeLevel !== undefined &&
        data.maxGradeLevel !== null &&
        data.maxGradeLevel !== undefined
      ) {
        return data.minGradeLevel <= data.maxGradeLevel;
      }
      return true;
    },
    {
      message:
        'Minimum grade level must be less than or equal to maximum grade level',
      path: ['minGradeLevel'],
    }
  )
  .refine(
    (data) => {
      // For school subjects, validate grade levels
      if (data.subjectType === SubjectType.SchoolSubject) {
        // No additional validation needed here, the basic refinement above covers it
        return true;
      }
      return true;
    },
    {
      message: 'Invalid grade level for school subject',
      path: ['minGradeLevel'],
    }
  )
  .refine(
    (data) => {
      // For university courses, validate credit hours and values
      if (data.subjectType === SubjectType.UniversityCourse) {
        // Credit hours should be provided for university courses
        return data.creditHours !== null && data.creditHours !== undefined;
      }
      return true;
    },
    {
      message: 'Credit hours are required for university courses',
      path: ['creditHours'],
    }
  )
  .refine(
    (data) => {
      // For elective courses, validate elective type
      if (data.isElective) {
        return data.electiveType !== null && data.electiveType !== undefined;
      }
      return true;
    },
    {
      message: 'Elective type is required for elective subjects',
      path: ['electiveType'],
    }
  );

// Define the TypeScript type for our form
export type SubjectFormSchema = z.infer<typeof subjectFormSchema>;
