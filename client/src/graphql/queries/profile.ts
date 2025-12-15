import { gql } from "@apollo/client";

export const GET_PROFILE_QUERY = gql`
  query GetProfile {
    profile {
      id
      username
      email
    }
  }
`;
