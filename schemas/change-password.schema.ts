// schemas/change-password.schema.ts
import { z } from 'zod';

export const changePasswordSchema = () => {
  return z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters'),
      confirmPassword: z.string().min(1, 'Password confirmation is required'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
};

export type ChangePasswordPayload = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
