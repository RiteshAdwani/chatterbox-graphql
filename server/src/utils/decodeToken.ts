import jwt from 'jsonwebtoken';
import { errorMessages } from '../constants/messages.constants';

export const decodeToken = (token: string) => {
  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    throw new Error(errorMessages.missingEnvVar('JWT_SECRET'));
  }
  return jwt.verify(token, secret);
};
