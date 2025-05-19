import { AuthService } from '../../services/auth.service';
import type { RegisterUserCommand } from '../../../types';
import { validateAuthRequest } from '../../middleware/validate-request';

export async function POST(request: Request) {
  try {
    // Validate request
    const validatedData = await validateAuthRequest(request);
    if (validatedData instanceof Response) return validatedData;

    const authService = new AuthService();
    const result = await authService.register(validatedData as RegisterUserCommand);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 