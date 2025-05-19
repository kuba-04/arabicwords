import { LoginCommand, RegisterUserCommand } from '../types';
import { login, register } from '../lib/api/auth';

export async function loginUser(command: LoginCommand) {
  return login(command);
}

export async function registerUser(command: RegisterUserCommand) {
  return register(command);
} 