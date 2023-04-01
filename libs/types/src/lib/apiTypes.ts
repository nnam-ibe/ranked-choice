import { z } from 'zod';

const ApiSuccessSchema = z.object({
  message: z.literal('success'),
});

export type ApiSuccess = z.infer<typeof ApiSuccessSchema>;
