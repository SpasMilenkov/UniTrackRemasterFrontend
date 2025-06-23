// schemas/teacher.schema.ts
import { z } from 'zod';

// Schema for teacher form
export const teacherFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  title: z.string().optional(),
  institutionId: z.string().min(1, 'Institution is required'),
  classGradeId: z.string().nullable().optional(),
});

// Grade assignment schemas
export const assignTeacherToGradesSchema = z.object({
  gradeIds: z
    .array(z.string().uuid('Invalid grade ID'))
    .min(1, 'At least one grade must be selected'),
});

export const updateTeacherGradeAssignmentsSchema = z.object({
  gradeIds: z.array(z.string().uuid('Invalid grade ID')),
});

export const unassignTeacherFromGradesSchema = z.object({
  gradeIds: z
    .array(z.string().uuid('Invalid grade ID'))
    .min(1, 'At least one grade must be selected'),
});

// Bulk assignment schemas
export const bulkAssignmentSchema = z.object({
  assignments: z
    .array(
      z.object({
        teacherId: z.string().uuid('Invalid teacher ID'),
        gradeIds: z.array(z.string().uuid('Invalid grade ID')),
      })
    )
    .min(1, 'At least one assignment must be specified'),
});

export const bulkUnassignmentSchema = z.object({
  unassignments: z
    .array(
      z.object({
        teacherId: z.string().uuid('Invalid teacher ID'),
        gradeIds: z.array(z.string().uuid('Invalid grade ID')),
      })
    )
    .min(1, 'At least one unassignment must be specified'),
});

// Teacher assignment form schema
export const teacherAssignmentFormSchema = z.object({
  gradeIds: z.array(z.string().uuid('Invalid grade ID')),
  homeroomGradeId: z.string().uuid('Invalid grade ID').optional().nullable(),
});

// Custom assignment schema for matrix input
export const customAssignmentSchema = z.object({
  assignments: z.record(
    z.string().uuid('Invalid teacher ID'),
    z.array(z.string().uuid('Invalid grade ID'))
  ),
});

// Type for teacher form data
export type TeacherFormSchema = z.infer<typeof teacherFormSchema>;
export type AssignTeacherToGradesSchema = z.infer<
  typeof assignTeacherToGradesSchema
>;
export type UpdateTeacherGradeAssignmentsSchema = z.infer<
  typeof updateTeacherGradeAssignmentsSchema
>;
export type UnassignTeacherFromGradesSchema = z.infer<
  typeof unassignTeacherFromGradesSchema
>;
export type BulkAssignmentSchema = z.infer<typeof bulkAssignmentSchema>;
export type BulkUnassignmentSchema = z.infer<typeof bulkUnassignmentSchema>;
export type TeacherAssignmentFormSchema = z.infer<
  typeof teacherAssignmentFormSchema
>;
export type CustomAssignmentSchema = z.infer<typeof customAssignmentSchema>;
