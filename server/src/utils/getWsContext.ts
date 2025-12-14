import { decodeToken } from './decodeToken.js';
import { GraphQLError } from 'graphql';
import { errorMessages, ErrorCode } from '../constants/messages.constants.js';

export interface WsContext {
  connectionParams?: {
    accessToken?: string;
  };
}

export const getWsContext = ({ connectionParams }: WsContext) => {
  const accessToken = connectionParams?.accessToken;

  if (accessToken) {
    try {
      const payload = decodeToken(accessToken) as { id: number; username: string; email: string };
      return {
        userId: payload.id,
        token: accessToken,
      };
    } catch (error) {
      throw new GraphQLError(errorMessages.invalidToken, {
        extensions: { code: ErrorCode.UNAUTHENTICATED },
      });
    }
  }

  return {};
};
