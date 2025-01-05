import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';

export const registerSchema = () => {
  const { t } = useI18n();
  return z
    .object({
      firstName: z.string({
        required_error: t('registrationPage.validation.firstName.required'),
      }),
      lastName: z.string({
        required_error: t('registrationPage.validation.lastName.required'),
      }),
      email: z
        .string({
          required_error: t('registrationPage.validation.email.required'),
        })
        .email({
          message: t('registrationPage.validation.email.invalid'),
        }),
      phoneNumber: z.string().refine(
        (number) => {
          return isPossiblePhoneNumber(number, 'BG');
        },
        {
          message: t('registrationPage.validation.phoneNumber.invalid'),
        }
      ),
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
      orgId: z.string(),
      orgRole: z.string(),
      orgType: z.number(),
    })
    .refine(
      (ctx) => {
        return ctx.password === ctx.confirmPassword;
      },
      {
        message: t('registrationPage.validation.confirmPassword.mismatch'),
        path: ['confirmPassword'],
      }
    );
};
