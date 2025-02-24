import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { isPossiblePhoneNumber } from 'libphonenumber-js';

export const useUniversityFormSchema = () => {
  const { t } = useI18n();

  return z.object({
    name: z
      .string({
        required_error: t('onboarding.validation.university.name.required'),
      })
      .min(2, {
        message: t('onboarding.validation.university.name.tooShort'),
      }),

    motto: z
      .string({
        required_error: t('onboarding.validation.university.motto.required'),
      })
      .min(2, {
        message: t('onboarding.validation.university.motto.tooShort'),
      }),

    description: z
      .string({
        required_error: t(
          'onboarding.validation.university.description.required'
        ),
      })
      .min(50, {
        message: t('onboarding.validation.university.description.tooShort'),
      }),

    email: z
      .string({
        required_error: t('onboarding.validation.university.email.required'),
      })
      .email({
        message: t('onboarding.validation.university.email.invalid'),
      }),

    phone: z
      .string({
        required_error: t('onboarding.validation.university.phone.required'),
      })
      .refine((number) => isPossiblePhoneNumber(number, 'BG'), {
        message: t('onboarding.validation.university.phone.invalid'),
      }),

    website: z
      .string({
        required_error: t('onboarding.validation.university.website.required'),
      })
      .url({
        message: t('onboarding.validation.university.website.invalid'),
      }),

    establishedDate: z.number({
      required_error: t(
        'onboarding.validation.university.establishedDate.required'
      ),
    }),

    accreditations: z.array(z.number()).min(1, {
      message: t('onboarding.validation.university.accreditations.required'),
    }),

    programs: z.array(z.string()).min(1, {
      message: t('onboarding.validation.university.programs.required'),
    }),
  });
};
