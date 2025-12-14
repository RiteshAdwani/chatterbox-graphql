import type { AuthContext } from '../utils/requireAuth.js';
import { revokeAllUserTokens, blacklistToken } from '../db/tokens.js';
import { decodeToken } from '../utils/decodeToken.js';
import { errorMessages } from '../constants/messages.constants.js';

export async function logout(context: AuthContext): Promise<boolean> {
  if (!context.token) {
    throw new Error(errorMessages.tokenNotProvided);
  }

  // Decode token to get user id
  const payload = decodeToken(context.token) as { id: number };
  const userId = payload.id;

  // Add access token to blacklist in database
  await blacklistToken(context.token);

  // Revoke all refresh tokens for this user
  await revokeAllUserTokens(userId);

  return true;
}
