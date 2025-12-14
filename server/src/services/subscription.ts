import { validateChatAccess } from '../utils/validateChatAccess.js';
import { pubsub } from '../utils/pubsub.js';
import { EVENTS } from '../constants/events.constants.js';
import { GraphQLError } from 'graphql';
import { errorMessages, ErrorCode } from '../constants/messages.constants.js';

/**
 * Subscribe to messages in a chat with authentication and validation
 */
export async function subscribeToMessages(chatId: string, userId?: number) {
  // Check if user is authenticated
  if (!userId) {
    throw new GraphQLError(errorMessages.authRequired, {
      extensions: { code: ErrorCode.UNAUTHENTICATED },
    });
  }

  // Validate user is a participant before allowing subscription
  await validateChatAccess(chatId, userId);
  
  return pubsub.asyncIterableIterator(EVENTS.MESSAGE_SENT);
}
