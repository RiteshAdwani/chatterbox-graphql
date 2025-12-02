import type { Request, Response, NextFunction } from 'express';

export const authMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
  // For now, just pass through all requests
  // TODO: Add JWT authentication logic here
  next();
};

export const handleLogin = () => {};
