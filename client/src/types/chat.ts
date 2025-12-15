export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  createdAt: string;
  from: User;
}

export type ChatType = "DIRECT" | "GROUP";

export interface Chat {
  id: string;
  name?: string;
  type: ChatType;
  participants: User[];
  messages?: Message[];
  lastMessage?: Message;
  createdAt: string;
}

// Query types
export interface GetUsersData {
  users: User[];
}

export interface GetChatsData {
  chats: Chat[];
}

export interface GetChatData {
  chat: Chat;
}

export interface GetChatVariables {
  id: string;
}

export interface GetMessagesData {
  messages: Message[];
}

export interface GetMessagesVariables {
  chatId: string;
}

// Mutation types
export interface CreateChatInput {
  participantUserIds: string[];
  name?: string;
  type: ChatType;
}

export interface CreateChatData {
  createChat: Chat;
}

export interface CreateChatVariables {
  input: CreateChatInput;
}

export interface SendMessageInput {
  chatId: string;
  text: string;
}

export interface SendMessageData {
  sendMessage: Message;
}

export interface SendMessageVariables {
  input: SendMessageInput;
}

// Subscription types
export interface MessageSentData {
  messageSent: Message;
}

export interface MessageSentVariables {
  chatId: string;
}
