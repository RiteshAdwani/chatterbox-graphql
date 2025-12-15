import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MESSAGES_QUERY } from "../../graphql/queries/chats";
import { MESSAGE_SENT_SUBSCRIPTION } from "../../graphql/subscriptions/message";
import type {
  GetMessagesData,
  GetMessagesVariables,
  MessageSentData,
} from "../../types/chat";

export function useMessages(chatId: string | null) {
  const { data, loading, error, subscribeToMore } = useQuery<
    GetMessagesData,
    GetMessagesVariables
  >(GET_MESSAGES_QUERY, {
    variables: { chatId: chatId || "" },
    skip: !chatId,
  });

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = subscribeToMore<MessageSentData, { chatId: string }>({
      document: MESSAGE_SENT_SUBSCRIPTION,
      variables: { chatId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateQuery: (prev: any, { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        
        const prevMessages = prev.messages || [];
        const newMessage = subscriptionData.data.messageSent;
        
        // Check if message already exists (avoid duplicates)
        const messageExists = prevMessages.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (msg: any) => msg?.id === newMessage.id
        );
        
        if (messageExists) return prev;

        // Add new message to the list
        return {
          messages: [...prevMessages, newMessage],
        };
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [chatId, subscribeToMore]);

  return {
    messages: data?.messages || [],
    loading,
    error,
  };
}
