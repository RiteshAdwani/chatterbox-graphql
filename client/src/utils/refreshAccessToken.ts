import { LOCAL_STORAGE_KEYS } from "../constants/localStorageKeys";
import { apolloClient } from "../graphql/config/client";
import { REFRESH_TOKEN_MUTATION } from "../graphql/mutations/auth";
import {
  getLocalStorageData,
  removeLocalStorageData,
  setLocalStorageData,
} from "./localStorage";

// Function to refresh the access token using Apollo Client
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

    const response = await apolloClient.mutate<{
      refresh: {
        accessToken: string;
        refreshToken: string;
      };
    }>({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refreshToken,
      },
    });

    const accessToken = response.data?.refresh?.accessToken;
    const newRefreshToken = response.data?.refresh?.refreshToken;

    if (!accessToken) {
      throw new Error("No access token received");
    }

    // Store new tokens
    setLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (newRefreshToken) {
      setLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    console.warn(error);
    // Clear all tokens on refresh failure
    removeLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    removeLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

    // Redirect to login
    window.location.href = "/login";
    return null;
  }
};
