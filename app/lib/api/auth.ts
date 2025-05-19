import { supabase } from '../supabase';
import type { LoginCommand, RegisterUserCommand } from '../../../types';

export async function login(command: LoginCommand) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: command.email,
    password: command.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: {
      email: data.user?.email,
    },
  };
}

export async function register(command: RegisterUserCommand) {
  const { data, error } = await supabase.auth.signUp({
    email: command.email,
    password: command.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: {
      email: data.user?.email,
    },
  };
} 