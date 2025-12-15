import type { Chat } from "../types/chat";

/**
 * Gets the display name for a chat
 * - For GROUP chats: returns the group name
 * - For DIRECT chats: returns the other participant's username
 */
export function getChatDisplayName(chat: Chat, currentUserId: string): string {
  if (chat.type === "GROUP") {
    return chat.name || "Unnamed Group";
  }
  
  // For DIRECT chats, find the other participant
  const otherParticipant = chat.participants.find(p => p.id !== currentUserId);
  return otherParticipant?.username || "Unknown User";
}

/**
 * Gets the chat avatar emoji
 * - For GROUP chats: 👥
 * - For DIRECT chats: 💬
 */
export function getChatAvatar(chat: Chat): string {
  return chat.type === "GROUP" ? "👥" : "💬";
}
