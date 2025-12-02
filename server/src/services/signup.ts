import { createUser, findUserByEmail } from '../db/users';
import type { SignupInput } from '../types';
import { generateTokens } from '../utils/generateTokens';
import { hashPassword } from '../utils/password';

export async function signup(input: SignupInput) {
  const { username, email, password } = input;
  const existing = await findUserByEmail(email);
  if (existing) throw new Error('User already exists');
  const hashed = await hashPassword(password);
  await createUser({ username, email, password: hashed });
  return generateTokens({ username, email });
}
