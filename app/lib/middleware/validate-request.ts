import { z } from 'zod';
import type { AuthCommand } from '../../types';

const authCommandSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function validateRequest(schema: z.ZodType<AuthCommand>) {
  return async (request: Request) => {
    try {
      const body = await request.json();
      const validatedData = await schema.parseAsync(body);
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: 'Validation failed',
            details: error.errors,
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
      throw error;
    }
  };
}

export default validateRequest(authCommandSchema); 