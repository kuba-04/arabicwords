import { AuthService } from '../../lib/auth.service';
import type { RegisterUserCommand } from '../../types';

export async function POST(request: Request) {
  try {
    const authService = new AuthService();
    const command = await request.json() as RegisterUserCommand;

    const result = await authService.register(command);

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