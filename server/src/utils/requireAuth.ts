import { GraphQLError } from 'graphql';
import { errorMessages, ErrorCode } from '../constants/messages.constants.js';

export interface AuthContext {
  token?: string;
}

export function requireAuth(context: AuthContext): asserts context is Required<AuthContext> {
  if (!context.token) {
    throw new GraphQLError(errorMessages.authRequired, {
      extensions: {
        code: ErrorCode.UNAUTHENTICATED,
        http: { status: 401 },
      },
    });
  }
}
