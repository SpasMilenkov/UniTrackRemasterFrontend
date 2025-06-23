// schemas/invitation.ts
import { z } from 'zod';
import { ProfileStatus } from '~/interfaces/invitation';
export const acceptInvitationSchema = z.object({
  profileId: z.string().uuid('Invalid profile ID'),
  profileType: z.enum(['Student', 'Teacher', 'Admin'], {
    errorMap: () => ({
      message: 'Profile type must be Student, Teacher, or Admin',
    }),
  }),
});
export const declineInvitationSchema = z.object({
  profileId: z.string().uuid('Invalid profile ID'),
  profileType: z.enum(['Student', 'Teacher', 'Admin'], {
    errorMap: () => ({
      message: 'Profile type must be Student, Teacher, or Admin',
    }),
  }),
  reason: z
    .string()
    .min(1, 'Please provide a reason for declining')
    .max(500, 'Reason must be less than 500 characters')
    .optional(),
});
export const resendInvitationSchema = z.object({
  profileId: z.string().uuid('Invalid profile ID'),
  profileType: z.enum(['Student', 'Teacher', 'Admin'], {
    errorMap: () => ({
      message: 'Profile type must be Student, Teacher, or Admin',
    }),
  }),
});
export const cancelInvitationSchema = z.object({
  profileId: z.string().uuid('Invalid profile ID'),
  profileType: z.enum(['Student', 'Teacher', 'Admin'], {
    errorMap: () => ({
      message: 'Profile type must be Student, Teacher, or Admin',
    }),
  }),
});
export const invitationFiltersSchema = z
  .object({
    status: z.nativeEnum(ProfileStatus).optional(),
    type: z.enum(['Student', 'Teacher', 'Admin']).optional(),
    search: z.string().max(100, 'Search term too long').optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return new Date(data.dateFrom) <= new Date(data.dateTo);
      }
      return true;
    },
    {
      message: 'Start date must be before end date',
      path: ['dateTo'],
    }
  );
// Form types derived from schemas
export type AcceptInvitationForm = z.infer<typeof acceptInvitationSchema>;
export type DeclineInvitationForm = z.infer<typeof declineInvitationSchema>;
export type ResendInvitationForm = z.infer<typeof resendInvitationSchema>;
export type CancelInvitationForm = z.infer<typeof cancelInvitationSchema>;
export type InvitationFiltersForm = z.infer<typeof invitationFiltersSchema>;
