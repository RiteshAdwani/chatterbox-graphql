import { gql } from '@apollo/client';

export const GET_CHATS_QUERY = gql`
  query GetChats {
    chats {
      id
      name
      type
      participants {
        id
        username
        email
      }
      lastMessage {
        id
        text
        createdAt
        from {
          id
          username
        }
      }
      createdAt
    }
  }
`;

export const GET_CHAT_QUERY = gql`
  query GetChat($id: ID!) {
    chat(id: $id) {
      id
      name
      type
      participants {
        id
        username
        email
      }
      messages {
        id
        text
        createdAt
        from {
          id
          username
        }
      }
      createdAt
    }
  }
`;

export const GET_MESSAGES_QUERY = gql`
  query GetMessages($chatId: ID!) {
    messages(chatId: $chatId) {
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
