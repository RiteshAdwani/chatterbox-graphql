import { dbCreateChat, dbAddMessage, dbGetChatsByUserId, dbGetChatById, dbGetMessagesByChatId } from '../db/chats.js';
import { dbGetUsersByIds } from '../db/users.js';
import { validateChatAccess } from '../utils/validateChatAccess.js';
import { pubsub } from '../utils/pubsub.js';
import { EVENTS } from '../constants/events.constants.js';
import type { ChatType } from '../types.js';
import { errorMessages, ErrorCode } from '../constants/messages.constants.js';
import { GraphQLError } from 'graphql';

/**
 * Get all chats for a user.
 */
export async function getChatsByUserId(userId: number) {
  return await dbGetChatsByUserId(userId);
}

/**
 * Get a specific chat by ID with participant validation
 */
export async function getChatById(chatId: string, userId: number) {
  await validateChatAccess(chatId, userId);
  return await dbGetChatById(chatId);
}

/**
 * Get messages for a chat with participant validation
 */
export async function getMessagesByChatId(chatId: string, userId: number) {
  await validateChatAccess(chatId, userId);
  return await dbGetMessagesByChatId(chatId);
}

/**
 * Service to create a new chat with validation
 */
export async function createChat(
  currentUserId: number,
  participantUserIds: number[],
  type: ChatType,
  name?: string
) {
  // Ensure the current user is included in participants
  if (!participantUserIds.includes(currentUserId)) {
    participantUserIds.push(currentUserId);
  }

  // Validate all participants exist (single query instead of N queries)
  const users = await dbGetUsersByIds(participantUserIds);
  if (users.length !== participantUserIds.length) {
    // Find which user IDs are missing
    const foundIds = users.map(u => u.id);
    const missingIds = participantUserIds.filter(id => !foundIds.includes(id));
    throw new GraphQLError(errorMessages.userNotFound(`id: ${missingIds.join(', ')}`), {
      extensions: { code: ErrorCode.NOT_FOUND },
    });
  }

  // Create the chat (will validate participant counts)
  return await dbCreateChat(participantUserIds, type, name);
}

/**
 * Service to send a message to a chat with validation and publishing
 */
export async function sendMessage(
  chatId: string,
  fromUserId: number,
  text: string
) {
  // Validate user is a participant before sending message
  await validateChatAccess(chatId, fromUserId);
  
  const message = await dbAddMessage(chatId, fromUserId, text);
  
  // Publish message to subscribers
  await pubsub.publish(EVENTS.MESSAGE_SENT, {
    messageSent: message,
  });
  
  return message;
}
