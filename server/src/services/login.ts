import { findUserByEmail } from '../db/users';
import type { AuthToken, LoginInput } from '../types';
import { generateTokens } from '../utils/generateTokens';
import { comparePassword } from '../utils/password';

export async function login(input: LoginInput): Promise<AuthToken> {
  const { email, password } = input;
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  return generateTokens({ username: user.username, email: user.email });
}
