import { login } from '../../services/login';
import { signup } from '../../services/signup';
import { logout } from '../../services/logout';
import { refreshAccessToken } from '../../services/refreshToken.js';
import { createChat, sendMessage, getChatsByUserId, getChatById, getMessagesByChatId } from '../../services/chat.js';
import { subscribeToMessages } from '../../services/subscription.js';
import type { LoginInput, SignupInput, CreateChatInput, SendMessageInput, Chat, Message, User } from '../../types.js';
import { requireAuth, type AuthContext } from '../../utils/requireAuth.js';
import type { WsContext } from '../../utils/getWsContext.js';
import { decodeToken } from '../../utils/decodeToken.js';
import { 
  dbGetMessagesByChatId, 
  dbGetChatParticipants,
  dbGetLastMessage,
} from '../../db/chats.js';
import { dbGetAllUsers, dbGetUserById, dbGetUsersByIds } from '../../db/users.js';

export const resolvers = {
  Query: {
    hello: (_root: unknown, _args: unknown, context: AuthContext) => {
      // Protected query - requires authentication
      requireAuth(context);
      const payload = decodeToken(context.token) as { id: number; username: string; email: string };
      return `Hello ${payload.username}, Welcome to ChatterBox!`;
    },

    // Get current authenticated user
    profile: async (_root: unknown, _args: unknown, context: AuthContext) => {
      requireAuth(context);
      const payload = decodeToken(context.token) as { id: number };
      const user = await dbGetUserById(payload.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },

    // Get all users (for selecting participants when creating a chat)
    users: async (_root: unknown, _args: unknown, context: AuthContext) => {
  requireAuth(context);
  const payload = decodeToken(context.token) as { id: number };
  const allUsers = await dbGetAllUsers();
  // Filter out the current user
  return allUsers.filter(user => user.id !== payload.id);
    },

    // Get all chats for the authenticated user
    chats: async (_root: unknown, _args: unknown, context: AuthContext) => {
      requireAuth(context);
      const payload = decodeToken(context.token) as { id: number };
      return await getChatsByUserId(payload.id);
    },

    // Get a specific chat by ID
    chat: async (_root: unknown, { id }: { id: string }, context: AuthContext) => {
      requireAuth(context);
      const payload = decodeToken(context.token) as { id: number };
      
      return await getChatById(id, payload.id);
    },

    // Get all messages for a specific chat
    messages: async (_root: unknown, { chatId }: { chatId: string }, context: AuthContext) => {
      requireAuth(context);
      const payload = decodeToken(context.token) as { id: number };

      return await getMessagesByChatId(chatId, payload.id);
    },
  },

  Mutation: {
    // Public mutations - no auth required
    login: async (_root: unknown, { input }: { input: LoginInput }) => {
      return await login(input);
    },

    signup: async (_root: unknown, { input }: { input: SignupInput }) => {
      return await signup(input);
    },

    refresh: async (_root: unknown, { refreshToken }: { refreshToken: string }) => {
      return await refreshAccessToken(refreshToken);
    },

    // Protected mutations - auth required
    logout: async (_root: unknown, _args: unknown, context: AuthContext) => {
      requireAuth(context);
      return logout(context);
    },

    // Create a new chat
    createChat: async (_root: unknown, { input }: { input: CreateChatInput }, context: AuthContext) => {
      requireAuth(context);
      const payload = decodeToken(context.token) as { id: number };

      return await createChat(
        payload.id,
        input.participantUserIds,
        input.type,
        input.name
      );
    },

    // Send a message in a chat
    sendMessage: async (_root: unknown, { input }: { input: SendMessageInput }, context: AuthContext) => {
      requireAuth(context);
      const payload = decodeToken(context.token) as { id: number };

      return await sendMessage(input.chatId, payload.id, input.text);
    },
  },

  Subscription: {
    messageSent: {
      subscribe: async (_root: unknown, { chatId }: { chatId: string }, context: WsContext & { userId?: number }) => {
        return await subscribeToMessages(chatId, context.userId);
      },
      resolve: (payload: { messageSent: Message }, { chatId }: { chatId: string }) => {
        // Filter messages to only send those for the subscribed chatId
        if (payload.messageSent.chatId === chatId) {
          return payload.messageSent;
        }
        return null;
      },
    },
  },

  // Field resolvers
  Chat: {
    participants: async (parent: Chat) => {
      const userIds = await dbGetChatParticipants(parent.id);
      return await dbGetUsersByIds(userIds);
    },

    messages: async (parent: Chat) => {
      return await dbGetMessagesByChatId(parent.id);
    },

    lastMessage: async (parent: Chat) => {
      return await dbGetLastMessage(parent.id);
    },
  },

  Message: {
    from: async (parent: Message) => {
      return await dbGetUserById(parent.fromUserId);
    },
  },

  User: {
    id: (parent: User) => {
      // Return numeric ID
      return parent.id;
    },
  },
};
