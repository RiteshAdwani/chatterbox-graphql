import { connection } from './connection.js';
import { nanoid } from 'nanoid';
import { type Chat, type Message, ChatType } from '../types.js';
import { errorMessages } from '../constants/messages.constants.js';

// Get all chats for a specific user, sorted by last message timestamp
export async function dbGetChatsByUserId(userId: number): Promise<Chat[]> {
  const chats = await connection('chat')
    .join('chat_participant', 'chat.id', 'chat_participant.chatId')
    .leftJoin('message as lastMsg', function() {
      this.on('chat.id', '=', 'lastMsg.chatId')
        .andOn('lastMsg.createdAt', '=', connection.raw(`(
          SELECT MAX(createdAt)
          FROM message
          WHERE message.chatId = chat.id
        )`));
    })
    .where('chat_participant.userId', userId)
    .select('chat.*')
    .groupBy('chat.id', 'chat.name', 'chat.type', 'chat.createdAt')
    .orderByRaw('COALESCE(MAX(lastMsg.createdAt), chat.createdAt) DESC');

  return chats;
}

// Get a specific chat by ID
export async function dbGetChatById(chatId: string): Promise<Chat | undefined> {
  const chat = await connection('chat').where('id', chatId).first();

  return chat;
}

// Get all messages for a specific chat
export async function dbGetMessagesByChatId(chatId: string): Promise<Message[]> {
  const messages = await connection('message').where('chatId', chatId).orderBy('createdAt', 'asc');

  return messages;
}

// Get all participants in a chat
export async function dbGetChatParticipants(chatId: string): Promise<number[]> {
  const participants = await connection('chat_participant')
    .where('chatId', chatId)
    .select('userId');

  return participants.map((p: { userId: number }) => p.userId);
}

// Get the last message in a chat
export async function dbGetLastMessage(chatId: string): Promise<Message | undefined> {
  const message = await connection('message')
    .where('chatId', chatId)
    .orderBy('createdAt', 'desc')
    .first();

  return message;
}

// Create a new chat
export async function dbCreateChat(
  participantUserIds: number[],
  type: ChatType,
  name?: string,
): Promise<Chat> {
  // Validate: DIRECT chats must have exactly 2 participants
  if (type === ChatType.DIRECT && participantUserIds.length !== 2) {
    throw new Error(errorMessages.directChatParticipants);
  }

  // Validate: GROUP chats must have at least 2 participants
  if (type === ChatType.GROUP && participantUserIds.length < 2) {
    throw new Error(errorMessages.groupChatParticipants);
  }

  const chatId = nanoid(10);
  const now = new Date().toISOString();

  // Insert chat
  await connection('chat').insert({
    id: chatId,
    name: name || null,
    type,
    createdAt: now,
  });

  // Add participants
  const participants = participantUserIds.map((userId) => ({
    chatId,
    userId,
    joinedAt: now,
  }));

  await connection('chat_participant').insert(participants);

  return {
    id: chatId,
    name: name || null,
    type,
    createdAt: now,
  };
}

// Add a message to a chat
export async function dbAddMessage(
  chatId: string,
  fromUserId: number,
  text: string,
): Promise<Message> {
  const messageId = nanoid(10);
  const now = new Date().toISOString();

  const message = {
    id: messageId,
    chatId,
    fromUserId,
    text,
    createdAt: now,
  };

  await connection('message').insert(message);

  return message;
}

// Check if a user is a participant in a chat
export async function dbIsUserInChat(chatId: string, userId: number): Promise<boolean> {
  const participant = await connection('chat_participant').where({ chatId, userId }).first();

  return !!participant;
}
