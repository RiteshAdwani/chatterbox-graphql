import { useQuery } from "@apollo/client/react";
import { GET_USERS_QUERY } from "../graphql/queries/users";
import type { GetUsersData } from "../types/chat";

export function useUsers() {
  const { data, loading, error, refetch } = useQuery<GetUsersData>(
    GET_USERS_QUERY
  );

  return {
    users: data?.users || [],
    loading,
    error,
    refetch,
  };
}
