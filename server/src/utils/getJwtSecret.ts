import { errorMessages } from '../constants/messages.constants.js';

export function getJwtSecret(): string {
  const JWT_SECRET = process.env['JWT_SECRET'];
  if (!JWT_SECRET) {
    throw new Error(errorMessages.missingEnvVar('JWT_SECRET'));
  }
  return JWT_SECRET;
}
