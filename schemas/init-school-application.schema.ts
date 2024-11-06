import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const initSchoolApplicationSchema = z.object({
  firstName: z
    .string({ message: 'First name is required' })
    .min(1, { message: 'First name is required' }),
  lastName: z
    .string({ message: 'Last name is required' })
    .min(1, { message: 'Last name is required' }),
  email: z
    .string({ message: 'Please enter an email address' })
    .email({ message: 'Please enter a valid email address' }),
  phoneNumber: z
    .string({
      message: 'Invalid phone number format. Please provide a valid BG number',
    })
    .refine(
      (number) => {
        return isPossiblePhoneNumber(number, 'BG');
      },
      {
        message:
          'Invalid phone number format. Please provide a valid BG number',
      }
    ),
  country: z
    .string({ message: 'Country is required' })
    .min(1, { message: 'Country is required' }),
  city: z
    .string({ message: 'City is required' })
    .min(1, { message: 'City is required' }),
  postcode: z
    .string({ message: 'Postcode is required' })
    .min(1, { message: 'Postcode is required' }),
  street: z
    .string({ message: 'Street address is required' })
    .min(1, { message: 'Street address is required' }),
  schoolName: z
    .string({ message: 'School name is requried' })
    .min(1, { message: 'School name is requried' }),
});
