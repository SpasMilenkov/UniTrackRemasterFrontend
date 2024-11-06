import { z } from 'zod';

export const codeAuthSchema = z.object({
  email: z.string().email(),
  code: z.string(),
});
