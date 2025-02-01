import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';
import { FocusArea } from '~/enums/focus-area.enum';

export const useUniversityFormSchema = () => {
  const { t } = useI18n();

  return z.object({
    // Basic Information
    name: z
      .string({
        required_error: t('onboarding.universityForm.validation.name.required'),
      })
      .min(2, t('onboarding.universityForm.validation.name.min'))
      .max(200, t('onboarding.universityForm.validation.name.max')),

    motto: z
      .string({
        required_error: t(
          'onboarding.universityForm.validation.motto.required'
        ),
      })
      .max(200, t('onboarding.universityForm.validation.motto.max')),

    description: z
      .string({
        required_error: t(
          'onboarding.universityForm.validation.description.required'
        ),
      })
      .max(500, t('onboarding.universityForm.validation.description.max')),

    // Contact Information
    email: z
      .string({
        required_error: t(
          'onboarding.universityForm.validation.email.required'
        ),
      })
      .email(t('onboarding.universityForm.validation.email.invalid')),

    phone: z
      .string({
        required_error: t(
          'onboarding.universityForm.validation.phone.required'
        ),
      })
      .refine((number) => isPossiblePhoneNumber(number, 'BG'), {
        message: t('onboarding.universityForm.validation.phone.invalid'),
      }),

    website: z
      .string({
        required_error: t(
          'onboarding.universityForm.validation.website.required'
        ),
      })
      .url(t('onboarding.universityForm.validation.website.invalid')),

    establishedDate: z
      .number({
        required_error: t(
          'onboarding.universityForm.validation.establishedDate.required'
        ),
      })
      .refine((timestamp) => timestamp <= Date.now(), {
        message: t('onboarding.universityForm.validation.establishedDate.past'),
      })
      .refine(
        (timestamp) => {
          const minDate = new Date('1000-01-01').getTime();
          return timestamp >= minDate && timestamp <= Date.now();
        },
        {
          message: t(
            'onboarding.universityForm.validation.establishedDate.range'
          ),
        }
      )
      .refine((timestamp) => !isNaN(timestamp), {
        message: t(
          'onboarding.universityForm.validation.establishedDate.invalid'
        ),
      }),

    // Academic Information
    undergraduateCount: z
      .number({
        required_error: t(
          'onboarding.universityForm.validation.undergraduateCount.required'
        ),
      })
      .min(0, t('onboarding.universityForm.validation.undergraduateCount.min'))
      .max(
        100000,
        t('onboarding.universityForm.validation.undergraduateCount.max')
      ),

    graduateCount: z
      .number({
        required_error: t(
          'onboarding.universityForm.validation.graduateCount.required'
        ),
      })
      .min(0, t('onboarding.universityForm.validation.graduateCount.min'))
      .max(50000, t('onboarding.universityForm.validation.graduateCount.max')),

    acceptanceRate: z
      .number({
        required_error: t(
          'onboarding.universityForm.validation.acceptanceRate.required'
        ),
      })
      .min(0, t('onboarding.universityForm.validation.acceptanceRate.min'))
      .max(100, t('onboarding.universityForm.validation.acceptanceRate.max')),

    researchFunding: z
      .number({
        required_error: t(
          'onboarding.universityForm.validation.researchFunding.required'
        ),
      })
      .min(0, t('onboarding.universityForm.validation.researchFunding.min')),

    hasStudentHousing: z.boolean({
      required_error: t(
        'onboarding.universityForm.validation.hasStudentHousing.required'
      ),
    }),

    // Specialization Information
    focusAreas: z
      .array(
        z.nativeEnum(FocusArea)
      )
      .min(1, t('onboarding.universityForm.validation.focusAreas.min')),

    departments: z
      .array(z.string())
      .min(1, t('onboarding.universityForm.validation.departments.min')),

    accreditations: z
      .array(z.number())
      .min(1, t('onboarding.universityForm.validation.accreditations.min')),
  });
};
