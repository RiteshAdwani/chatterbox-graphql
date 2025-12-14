import { connection } from './connection.js';

// Revoke all refresh tokens for a user (used during logout)
export async function revokeAllUserTokens(userId: number) {
  await connection('refresh_token')
    .where({ userId })
    .update({ revoked: true });
}

// Clean up expired refresh tokens (can be run periodically as a maintenance task)
export async function cleanupExpiredTokens() {
  const now = new Date().toISOString();
  const deleted = await connection('refresh_token')
    .where('expiresAt', '<', now)
    .delete();
  return deleted;
}

// Check if a token is blacklisted
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await connection('blacklisted_token')
    .where({ token })
    .first();
  return !!result;
}

// Blacklist an access token
export async function blacklistToken(token: string) {
  await connection('blacklisted_token').insert({
    token,
    blacklistedAt: new Date().toISOString(),
  });
}
