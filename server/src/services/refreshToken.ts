import { connection } from '../db/connection.js';
import { generateTokens } from '../utils/generateTokens.js';
import { decodeToken } from '../utils/decodeToken.js';
import { errorMessages } from '../constants/messages.constants.js';

export async function refreshAccessToken(refreshToken: string) {
  // First, validate JWT signature and expiration
  let payload: any;
  try {
    payload = decodeToken(refreshToken);
  } catch (error) {
    throw new Error(errorMessages.invalidRefreshToken);
  }

  // Verify it's a refresh token (not an access token)
  if (payload.type !== 'refresh') {
    throw new Error(errorMessages.invalidTokenType);
  }

  // Extract userId from sub claim
  const userId = payload.sub as number;

  // Find the refresh token in database
  const storedToken = await connection('refresh_token')
    .where({ token: refreshToken })
    .first();

  // Validate token exists in database
  if (!storedToken) {
    throw new Error(errorMessages.refreshTokenNotFound);
  }

  // Check if token is revoked
  if (storedToken.revoked) {
    throw new Error(errorMessages.refreshTokenRevoked);
  }

  // Get user details
  const user = await connection('user')
    .where({ id: userId })
    .first();

  if (!user) {
    throw new Error(errorMessages.userNotFound('id'));
  }

  // Revoke old refresh token (token rotation for security)
  await connection('refresh_token')
    .where({ token: refreshToken })
    .update({ revoked: true });

  // Generate new token pair
  const tokens = await generateTokens({
    id: user.id,
    username: user.username,
    email: user.email,
  });

  return tokens;
}
