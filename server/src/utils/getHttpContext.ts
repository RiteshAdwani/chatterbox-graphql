import { type Request } from 'express';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from './getJwtSecret.js';
import { isTokenBlacklisted } from '../db/tokens.js';
import { errorMessages, ErrorCode } from '../constants/messages.constants.js';

interface HttpContextRequest extends Request {
  auth?: { username: string; email?: string };
}

export const getHttpContext = async ({ req }: { req: HttpContextRequest }) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  
  // If there's a token, validate it
  if (token) {
    try {
      // Check if token is blacklisted
      const blacklisted = await isTokenBlacklisted(token);
      if (blacklisted) {
        throw new GraphQLError(errorMessages.tokenRevoked, {
          extensions: {
            code: ErrorCode.TOKEN_REVOKED,
            http: { status: 401 },
          },
        });
      }

      // Verify the token
      jwt.verify(token, getJwtSecret());
    } catch (err: unknown) {
      // Convert JWT errors to GraphQL errors
      let message = errorMessages.authRequired;
      let code = ErrorCode.UNAUTHENTICATED;

      if (err instanceof GraphQLError) {
        throw err; // Re-throw GraphQL errors as-is
      }

      if (err instanceof Error) {
        if (err.name === 'TokenExpiredError') {
          message = errorMessages.tokenExpired;
          code = ErrorCode.TOKEN_EXPIRED;
        } else if (err.name === 'JsonWebTokenError') {
          if (err.message.includes('invalid signature')) {
            message = errorMessages.invalidTokenSignature;
            code = ErrorCode.INVALID_TOKEN_SIGNATURE;
          } else if (err.message.includes('jwt malformed')) {
            message = errorMessages.invalidTokenFormat;
            code = ErrorCode.INVALID_TOKEN_FORMAT;
          } else {
            message = errorMessages.invalidToken;
            code = ErrorCode.INVALID_TOKEN;
          }
        }
      }

      throw new GraphQLError(message, {
        extensions: {
          code,
          http: { status: 401 },
        },
      });
    }
  }
  
  return { token };
};

