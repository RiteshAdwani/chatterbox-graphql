import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { CREATE_CHAT_MUTATION } from "../../graphql/mutations/chat";
import { GET_CHATS_QUERY } from "../../graphql/queries/chats";
import { MESSAGES } from "../../constants/messages.constants";
import type {
  CreateChatData,
  CreateChatVariables,
  CreateChatInput,
} from "../../types/chat";

export function useCreateChat() {
  const navigate = useNavigate();
  const [createChatMutation, { loading, error }] = useMutation<
    CreateChatData,
    CreateChatVariables
  >(CREATE_CHAT_MUTATION, {
    refetchQueries: [{ query: GET_CHATS_QUERY }],
    awaitRefetchQueries: true,
  });

  const createChat = async (input: CreateChatInput) => {
    try {
      const { data } = await createChatMutation({
        variables: { input },
      });

      if (data?.createChat) {
        message.success(MESSAGES.CHAT_CREATED);
        // Navigate to the new chat
        navigate(`/${data.createChat.id}`);
        return data.createChat;
      }
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message || MESSAGES.CHAT_CREATE_ERROR);
      }
      throw err;
    }
  };

  return {
    createChat,
    loading,
    error,
  };
}
