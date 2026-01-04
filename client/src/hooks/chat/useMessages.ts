import { useQuery, useSubscription } from "@apollo/client/react";
import {
  GET_CHATS_QUERY,
  GET_MESSAGES_QUERY,
} from "../../graphql/queries/chats";
import { MESSAGE_SENT_SUBSCRIPTION } from "../../graphql/subscriptions/message";
import type {
  GetChatsData,
  GetMessagesData,
  GetMessagesVariables,
  MessageSentData,
} from "../../types/chat";

export function useMessages(chatId: string | null) {
  const { data, loading, error } = useQuery<
    GetMessagesData,
    GetMessagesVariables
  >(GET_MESSAGES_QUERY, {
    variables: { chatId: chatId || "" },
    skip: !chatId,
  });

  // Subscribe to new messages for this chat
  useSubscription<MessageSentData, { chatId: string }>(
    MESSAGE_SENT_SUBSCRIPTION,
    {
      variables: { chatId: chatId || "" },
      skip: !chatId,
      onData: ({ client, data: subscriptionData }) => {
        const newMessage = subscriptionData.data?.messageSent;
        if (!newMessage) return;

        // Update the messages cache
        client.cache.updateQuery<GetMessagesData, GetMessagesVariables>(
          {
            query: GET_MESSAGES_QUERY,
            variables: { chatId: chatId || "" },
          },
          (existingData) => {
            if (!existingData?.messages) return existingData;

            // Check if message already exists (avoid duplicates)
            const messageExists = existingData.messages.some(
              (msg) => msg.id === newMessage.id
            );

            if (messageExists) return existingData;

            // Add new message to the list
            return {
              messages: [...existingData.messages, newMessage],
            };
          }
        );

        // Update the chat list cache as well
        client.cache.updateQuery<GetChatsData>(
          {
            query: GET_CHATS_QUERY,
          },
          (existingData) => {
            if (!existingData?.chats) return existingData;

            // Find the chat and update its lastMessage
            const updatedChats = existingData.chats.map((chat) =>
              chat.id === newMessage.chatId
                ? { ...chat, lastMessage: newMessage }
                : chat
            );
            return { chats: updatedChats };
          }
        );
      },
    }
  );

  return {
    messages: data?.messages || [],
    loading,
    error,
  };
}
