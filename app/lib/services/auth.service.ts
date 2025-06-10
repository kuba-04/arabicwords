import { AuthError, LoginCommand, LoginResponseDTO, RegisterResponseDTO, RegisterUserCommand } from '../../types';
import { supabase } from '../supabase';

export class AuthService {
  private static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      throw new Error('Password must contain at least one special character (!@#$%^&*)');
    }
  }

  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  public static async register(command: RegisterUserCommand): Promise<RegisterResponseDTO> {
    try {
      // Validate input
      AuthService.validateEmail(command.email);
      AuthService.validatePassword(command.password);

      // Register with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: command.email,
        password: command.password,
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        console.error('Registration failed - no user created');
        throw new Error('Registration failed - no user created');
      }

      if (!authData.session) {
        console.error('Registration failed - no session created');
        throw new Error('Registration failed - no session created');
      }

      // Return response
      return {
        token: authData.session.access_token,
        user: {
          id: authData.user.id,
          email: authData.user.email!,
        },
      };
    } catch (error) {
      console.error('Registration process error:', error);
      throw this.handleError(error);
    }
  }

  public static async login(command: LoginCommand): Promise<LoginResponseDTO> {
    try {
      // Validate input
      AuthService.validateEmail(command.email);

      // Login with Supabase
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: command.email,
        password: command.password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!authData.user || !authData.session) {
        throw new Error('Login failed');
      }

      // Return response
      return {
        token: authData.session.access_token,
        user: {
          id: authData.user.id,
          email: authData.user.email!,
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): AuthError {
    if (error instanceof Error) {
      return {
        code: 'AUTH_ERROR',
        message: error.message,
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
    };
  }

  public static async deleteAccount(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Step 1: Delete user profile and related data
      const { error: profileDeletionError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', user.id);

      if (profileDeletionError) {
        throw profileDeletionError;
      }

      // Step 2: Delete auth user record
      const { error: userDeletionError } = await supabase.auth.admin.deleteUser(user.id);

      if (userDeletionError) {
        throw userDeletionError;
      }

      // Sign out the user after successful deletion
      await supabase.auth.signOut();
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new AuthService();