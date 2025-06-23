// schemas/institution.schema.ts
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { InstitutionType } from '~/enums/institution-type.enum';
import { IntegrationStatus } from '~/enums/integration-status.enum';
import { AccreditationType } from '~/enums/accreditation-type.enum';
import { LocationType } from '~/enums/location-type.enum';

export const useInstitutionFormSchema = () => {
  const { t } = useI18n();

  // Address sub-schema
  const addressSchema = z.object({
    country: z
      .string({
        required_error: t('validation.institution.address.country.required'),
      })
      .min(2, {
        message: t('validation.institution.address.country.tooShort'),
      }),

    settlement: z
      .string({
        required_error: t('validation.institution.address.settlement.required'),
      })
      .min(2, {
        message: t('validation.institution.address.settlement.tooShort'),
      }),

    street: z
      .string({
        required_error: t('validation.institution.address.street.required'),
      })
      .min(2, { message: t('validation.institution.address.street.tooShort') }),

    postalCode: z
      .string({
        required_error: t('validation.institution.address.postalCode.required'),
      })
      .regex(/^\d{4,10}$/, {
        message: t('validation.institution.address.postalCode.invalid'),
      }),
  });

  // Main institution schema
  return z.object({
    name: z
      .string({ required_error: t('validation.institution.name.required') })
      .min(2, { message: t('validation.institution.name.tooShort') }),

    type: z.nativeEnum(InstitutionType, {
      required_error: t('validation.institution.type.required'),
      invalid_type_error: t('validation.institution.type.invalid'),
    }),

    email: z
      .string({ required_error: t('validation.institution.email.required') })
      .email({ message: t('validation.institution.email.invalid') }),

    phone: z
      .string({ required_error: t('validation.institution.phone.required') })
      .refine((number) => isPossiblePhoneNumber(number, 'BG'), {
        message: t('validation.institution.phone.invalid'),
      }),

    website: z
      .string()
      .url({ message: t('validation.institution.website.invalid') })
      .optional()
      .or(z.literal('')),

    description: z.string().optional().or(z.literal('')),

    motto: z.string().optional().or(z.literal('')),

    location: z.nativeEnum(LocationType).optional(),

    integrationStatus: z.nativeEnum(IntegrationStatus).optional(),

    accreditations: z.array(z.nativeEnum(AccreditationType)).optional(),

    address: addressSchema,

    establishedDate: z
      .date({
        required_error: t('validation.institution.establishedDate.required'),
      })
      .or(
        z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .transform((str) => new Date(str))
      ),
  });
};

// Form type for use in components
export type InstitutionFormType = z.infer<
  ReturnType<typeof useInstitutionFormSchema>
>;
