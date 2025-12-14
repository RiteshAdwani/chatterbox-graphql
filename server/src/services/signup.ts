import { dbCreateUser, dbFindUserByEmail } from '../db/users';
import type { SignupInput } from '../types';
import { generateTokens } from '../utils/generateTokens';
import { hashPassword } from '../utils/password';
import { errorMessages } from '../constants/messages.constants';

export async function signup(input: SignupInput) {
  const { username, email, password } = input;
  const existing = await dbFindUserByEmail(email);
  if (existing) throw new Error(errorMessages.userAlreadyExists);
  const hashed = await hashPassword(password);
  const userId = await dbCreateUser({ username, email, password: hashed });
  if (!userId) throw new Error(errorMessages.failedToCreateUser);
  return generateTokens({ id: userId, username, email });
}
