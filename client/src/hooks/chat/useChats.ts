import { useQuery } from "@apollo/client/react";
import { GET_CHATS_QUERY, GET_CHAT_QUERY } from "../../graphql/queries/chats";
import type { GetChatsData, GetChatData, GetChatVariables } from "../../types/chat";

export function useChats() {
  const { data, loading, error, refetch } = useQuery<GetChatsData>(
    GET_CHATS_QUERY
  );

  return {
    chats: data?.chats || [],
    loading,
    error,
    refetch,
  };
}

export function useChat(chatId: string) {
  const { data, loading, error, refetch } = useQuery<
    GetChatData,
    GetChatVariables
  >(GET_CHAT_QUERY, {
    variables: { id: chatId },
    skip: !chatId,
  });

  return {
    chat: data?.chat,
    loading,
    error,
    refetch,
  };
}
