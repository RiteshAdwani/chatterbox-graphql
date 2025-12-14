import { GraphQLError } from 'graphql';
import { dbIsUserInChat, dbGetChatById } from '../db/chats.js';
import { errorMessages, ErrorCode } from '../constants/messages.constants.js';

/**
 * Validates that a chat exists and the user is a participant.
 * Throws GraphQLError if chat doesn't exist or user is not a participant.
 */
export async function validateChatAccess(chatId: string, userId: number): Promise<void> {
  // Check if chat exists
  const chat = await dbGetChatById(chatId);
  if (!chat) {
    throw new GraphQLError(errorMessages.chatNotFound, {
      extensions: { code: ErrorCode.NOT_FOUND },
    });
  }

  // Check if user is a participant
  const isParticipant = await dbIsUserInChat(chatId, userId);
  if (!isParticipant) {
    throw new GraphQLError(errorMessages.notChatParticipant, {
      extensions: { code: ErrorCode.FORBIDDEN },
    });
  }
}
