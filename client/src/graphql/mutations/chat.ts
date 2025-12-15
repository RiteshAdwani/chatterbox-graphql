import { gql } from '@apollo/client';

// Chat mutations
export const CREATE_CHAT_MUTATION = gql`
  mutation CreateChat($input: CreateChatInput!) {
    createChat(input: $input) {
      id
      name
      type
      participants {
        id
        username
        email
      }
      createdAt
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      chatId
      text
      createdAt
      from {
        id
        username
        email
      }
    }
  }
`;
