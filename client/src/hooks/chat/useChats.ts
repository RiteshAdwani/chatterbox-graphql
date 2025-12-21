import { useQuery } from "@apollo/client/react";
import { GET_CHATS_QUERY } from "../../graphql/queries/chats";
import type { GetChatsData } from "../../types/chat";

export function useChats() {
  const { data, loading, error, refetch } =
    useQuery<GetChatsData>(GET_CHATS_QUERY);

  return {
    chats: data?.chats || [],
    loading,
    error,
    refetch,
  };
}
