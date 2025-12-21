import { useQuery } from "@apollo/client/react";
import { GET_CHAT_QUERY } from "../../graphql/queries/chats";
import type { GetChatData, GetChatVariables } from "../../types/chat";

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
