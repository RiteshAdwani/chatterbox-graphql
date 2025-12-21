import jwt from 'jsonwebtoken';
import { connection } from '../db/connection.js';
import { getJwtSecret } from './getJwtSecret.js';

const ACCESS_TOKEN_EXPIRY = process.env['ACCESS_TOKEN_EXPIRY'] || '1m'; // Default: 15 minutes
const REFRESH_TOKEN_EXPIRY = process.env['REFRESH_TOKEN_EXPIRY'] || '7d'; // Default: 7 days

// Extract number of days from expiry string (e.g., "7d" -> 7)
const getExpiryDays = (expiry: string): number => {
  const match = expiry.match(/^(\d+)d$/);
  return match ? parseInt(match[1]!, 10) : 7; // Default to 7 days if parsing fails
};

export async function generateTokens(payload: { id: number; username: string; email: string }) {
  const JWT_SECRET = getJwtSecret();
  
  // Generate short-lived access token with user info
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY } as jwt.SignOptions);
  
  // Generate long-lived refresh token as JWT
  const refreshToken = jwt.sign(
    { sub: payload.id, type: 'refresh' }, 
    JWT_SECRET, 
    { expiresIn: REFRESH_TOKEN_EXPIRY } as jwt.SignOptions
  );
  
  // Calculate expiry date for database
  const expiresAt = new Date();
  const expiryDays = getExpiryDays(REFRESH_TOKEN_EXPIRY);
  expiresAt.setDate(expiresAt.getDate() + expiryDays);
  
  // Store refresh token in database for revocation control
  await connection('refresh_token').insert({
    token: refreshToken,
    userId: payload.id,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    revoked: false,
  });
  
  return { accessToken, refreshToken };
}
