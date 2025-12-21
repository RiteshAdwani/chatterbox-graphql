import { expressjwt } from 'express-jwt';
import type { Request, Response, NextFunction } from 'express';
import { getJwtSecret } from '../../utils/getJwtSecret.js';

// Lazy initialization - only create middleware when first used
let _authMiddleware: ReturnType<typeof expressjwt> | null = null;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!_authMiddleware) {
    _authMiddleware = expressjwt({
      algorithms: ['HS256'],
      credentialsRequired: false,
      secret: getJwtSecret(),
    });
  }

  // Handle JWT errors gracefully - don't block the request
  _authMiddleware(req, res, (err) => {
    if (err) {
      // Set auth to null so GraphQL resolvers can handle it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).auth = undefined;
    }
    next();
  });
};
