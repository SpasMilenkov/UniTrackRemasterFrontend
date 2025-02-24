// schemas/init-institution-application.schema.ts
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { InstitutionType } from '~/enums/institution-type.enum';

export const initInstitutionApplicationSchema = () => {
  const { t } = useI18n();

  const institutionTypeValues = Object.values(InstitutionType) as [
    string,
    ...string[],
  ];

  return z.object({
    firstName: z.string({
      required_error: t('onboarding.validation.firstName.required'),
    }),
    lastName: z.string({
      required_error: t('onboarding.validation.lastName.required'),
    }),
    email: z
      .string({
        required_error: t('onboarding.validation.email.required'),
      })
      .email({
        message: t('onboarding.validation.email.invalid'),
      }),
    phoneNumber: z
      .string()
      .refine((number) => isPossiblePhoneNumber(number, 'BG'), {
        message: t('onboarding.validation.phoneNumber.invalid'),
      }),
    institutionName: z.string({
      required_error: t('onboarding.validation.institutionName.required'),
    }),
    institutionType: z.enum(institutionTypeValues, {
      required_error: t('onboarding.validation.institutionType.required'),
    }),
    country: z.string({
      required_error: t('onboarding.validation.country.required'),
    }),
    settlement: z.string({
      required_error: t('onboarding.validation.city.required'),
    }),
    postalCode: z.string({
      required_error: t('onboarding.validation.postcode.required'),
    }),
    street: z.string({
      required_error: t('onboarding.validation.street.required'),
    }),
  });
};
