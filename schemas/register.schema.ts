import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string().refine(
      (number) => {
        return isPossiblePhoneNumber(number, 'BG');
      },
      { message: 'Invalid phone number format' }
    ),
    password: z
      .string()
      .min(10, {
        message: 'The password cannot be less than 10 characters long',
      })
      .refine(
        (pass) => {
          return validatePassword(pass);
        },
        {
          message:
            'Password must contain at least one upper case letter, one lower case letter, one number and one special character',
        }
      ),
    confirmPassword: z
      .string()
      .min(10, {
        message: 'The password cannot be less than 10 characters long',
      })
      .refine(
        (pass) => {
          return validatePassword(pass);
        },
        {
          message:
            'Password must contain at least one upper case letter, one lower case letter, one number and one special character',
        }
      ),
    orgId: z.string(),
    orgRole: z.string(),
    orgType: z.number()
  })
  .refine(
    (ctx) => {
      return ctx.password === ctx.confirmPassword;
    },
    {
      message: 'Password should match confirm Password',
      path: ['confirmPassword'],
    }
  );
