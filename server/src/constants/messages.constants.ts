export const errorMessages = {
  missingEnvVar: (varName: string) => `Environment variable ${varName} is not defined.`,
  
  // Authentication errors
  authRequired: 'Authentication required',
  invalidToken: 'Invalid or expired token',
  tokenExpired: 'Token has expired. Please refresh your token or login again.',
  invalidTokenSignature: 'Invalid token signature. Please login again to get a new token.',
  invalidTokenFormat: 'Invalid token format. Please provide a valid JWT token.',
  tokenRevoked: 'Token has been revoked. Please login again.',
  invalidCredentials: 'Invalid credentials',
  userAlreadyExists: 'User already exists',
  userNotFound: (identifier: string) => `User ${identifier} not found`,
  failedToCreateUser: 'Failed to create user',
  
  // Chat errors
  chatNotFound: 'Chat not found',
  notChatParticipant: 'You are not a participant in this chat',
  directChatParticipants: 'Direct chats must have exactly 2 participants',
  groupChatParticipants: 'Group chats must have at least 2 participants',
  
  // Refresh token errors
  invalidRefreshToken: 'Invalid or expired refresh token',
  invalidTokenType: 'Invalid token type',
  refreshTokenNotFound: 'Refresh token not found',
  refreshTokenRevoked: 'Refresh token has been revoked',
  
  // General errors
  tokenNotProvided: 'Token not provided',
};

export enum ErrorCode {
  // Authentication
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN_SIGNATURE = 'INVALID_TOKEN_SIGNATURE',
  INVALID_TOKEN_FORMAT = 'INVALID_TOKEN_FORMAT',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  
  // Authorization
  FORBIDDEN = 'FORBIDDEN',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  
  // Validation errors
  BAD_REQUEST = 'BAD_REQUEST',
  
  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}
