import jwt from 'jsonwebtoken';
import { getJwtSecret } from './getJwtSecret.js';

export const decodeToken = (token: string) => {
  return jwt.verify(token, getJwtSecret());
};
