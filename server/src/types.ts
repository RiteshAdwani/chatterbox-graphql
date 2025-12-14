export type User = {
  id: number;
  username: string;
  email: string;
};

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  username: string;
  email: string;
  password: string;
};

export enum ChatType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

export type Chat = {
  id: string;
  name: string | null;
  type: ChatType;
  createdAt: string;
  participants?: User[];
  lastMessage?: Message;
};

export type Message = {
  id: string;
  chatId: string;
  fromUserId: number;
  text: string;
  createdAt: string;
};

export type ChatParticipant = {
  chatId: string;
  userId: number;
  joinedAt: string;
};

export type CreateChatInput = {
  participantUserIds: number[];
  name?: string;
  type: ChatType;
};

export type SendMessageInput = {
  chatId: string;
  text: string;
};
