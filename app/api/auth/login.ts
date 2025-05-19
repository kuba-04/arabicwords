import { AuthService } from '../../lib/services/auth.service';
import type { LoginCommand } from '../../types';
import { validateAuthRequest } from '../../lib/middleware/validate-request';

export async function POST(request: Request) {
  try {
    // Validate request
    const validatedData = await validateAuthRequest(request);
    if (validatedData instanceof Response) return validatedData;

    const authService = new AuthService();
    const result = await authService.login(validatedData as LoginCommand);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
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