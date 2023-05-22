import { z } from 'zod';

const ApiSuccessSchema = z.object({
  message: z.literal('success'),
});

export type ApiClientResult<T> =
  | {
      error: Error;
      result?: undefined;
    }
  | { error?: undefined; result: T };

export type ApiSuccess = z.infer<typeof ApiSuccessSchema>;
