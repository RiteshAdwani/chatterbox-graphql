import { gql } from '@apollo/client';

export const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription MessageSent($chatId: ID!) {
    messageSent(chatId: $chatId) {
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
