import { useMutation } from "@apollo/client/react";
import { message } from "antd";
import { SEND_MESSAGE_MUTATION } from "../../graphql/mutations/chat";
import { GET_MESSAGES_QUERY } from "../../graphql/queries/chats";
import { MESSAGES } from "../../constants/messages.constants";
import type {
  SendMessageData,
  SendMessageVariables,
  SendMessageInput,
  GetMessagesData,
} from "../../types/chat";

export function useSendMessage(chatId: string) {
  const [sendMessageMutation, { loading, error }] = useMutation<
    SendMessageData,
    SendMessageVariables
  >(SEND_MESSAGE_MUTATION, {
    update(cache, { data }) {
      if (!data?.sendMessage) return;

      const newMessage = data.sendMessage;

      // Read existing messages from cache
      const existingData = cache.readQuery<GetMessagesData>({
        query: GET_MESSAGES_QUERY,
        variables: { chatId },
      });

      if (existingData) {
        // Check if message already exists (avoid duplicates)
        const messageExists = existingData.messages.some(
          (msg) => msg.id === newMessage.id
        );

        if (!messageExists) {
          // Write updated messages back to cache
          cache.writeQuery<GetMessagesData>({
            query: GET_MESSAGES_QUERY,
            variables: { chatId },
            data: {
              messages: [...existingData.messages, newMessage],
            },
          });
        }
      }
    },
  });

  const sendMessage = async (text: string) => {
    try {
      const input: SendMessageInput = {
        chatId,
        text,
      };

      const { data } = await sendMessageMutation({
        variables: { input },
      });

      if (data?.sendMessage) {
        return data.sendMessage;
      }
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message || MESSAGES.MESSAGE_SEND_ERROR);
      }
      throw err;
    }
  };

  return {
    sendMessage,
    loading,
    error,
  };
}
