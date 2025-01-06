import { z } from 'zod';

export const myAnimeLiveValidationSchema = z.object({
  query: z.object({
    url: z.string().url(),
  }),
});
