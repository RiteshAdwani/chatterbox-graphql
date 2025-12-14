import { dbFindUserByEmail } from '../db/users';
import type { AuthToken, LoginInput } from '../types';
import { generateTokens } from '../utils/generateTokens';
import { comparePassword } from '../utils/password';
import { errorMessages } from '../constants/messages.constants';

export async function login(input: LoginInput): Promise<AuthToken> {
  const { email, password } = input;
  const user = await dbFindUserByEmail(email);
  if (!user) throw new Error(errorMessages.invalidCredentials);
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error(errorMessages.invalidCredentials);
  return generateTokens({ id: user.id, username: user.username, email: user.email });
}
