// schemas/student.schema.ts
import { z } from 'zod';

// Schema for student form
export const studentFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  isSchoolStudent: z.boolean().default(false),
  isUniversityStudent: z.boolean().default(false),
  schoolId: z.string().nullable().optional(),
  universityId: z.string().nullable().optional(),
  gradeId: z.string().min(1, 'Grade is required'),
});

// Create an extended schema for new students (with required password)
export const newStudentFormSchema = studentFormSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Type for student form data
export type StudentFormSchema = z.infer<typeof studentFormSchema>;
export type NewStudentFormSchema = z.infer<typeof newStudentFormSchema>;
