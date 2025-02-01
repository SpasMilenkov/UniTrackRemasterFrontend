import { z } from 'zod';
import { useI18n } from 'vue-i18n';

export const resetPasswordSchema = () => {
  const { t } = useI18n();

  return z
    .object({
      password: z
        .string()
        .min(10, {
          message: t('registrationPage.validation.password.tooShort'),
        })
        .refine(
          (pass) => {
            return validatePassword(pass);
          },
          {
            message: t('registrationPage.validation.password.requirements'),
          }
        ),
      confirmPassword: z
        .string()
        .min(10, {
          message: t('registrationPage.validation.password.tooShort'),
        })
        .refine(
          (pass) => {
            return validatePassword(pass);
          },
          {
            message: t('registrationPage.validation.password.requirements'),
          }
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('registrationPage.validation.confirmPassword.mismatch'),
      path: ['confirmPassword'],
    });
};
