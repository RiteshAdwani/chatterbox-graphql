import { useQuery } from "@apollo/client/react";
import { GET_PROFILE_QUERY } from "../../graphql/queries/profile";
import type { User } from "../../types/auth";

interface GetProfileData {
  profile: User;
}

export function useProfile() {
  const { data, loading, error } = useQuery<GetProfileData>(GET_PROFILE_QUERY);

  return {
    user: data?.profile,
    loading,
    error,
  };
}
