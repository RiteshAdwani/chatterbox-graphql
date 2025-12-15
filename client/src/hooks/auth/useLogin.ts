import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { LOGIN_MUTATION } from "../../graphql/mutations/auth";
import { setLocalStorageData } from "../../utils/localStorage";
import { LOCAL_STORAGE_KEYS } from "../../constants/localStorageKeys";
import { MESSAGES } from "../../constants/messages.constants";
import { ROUTE_PATHS } from "../../config/routes";
import type { LoginData, LoginInput } from "../../types/auth";

export function useLogin() {
  const navigate = useNavigate();
  const [loginMutation, { loading, error }] = useMutation<
    LoginData,
    { input: LoginInput }
  >(LOGIN_MUTATION);

  const login = async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({
        variables: { input },
      });

      if (data?.login) {
        // Store tokens
        setLocalStorageData(
          LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
          data.login.accessToken
        );
        setLocalStorageData(
          LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
          data.login.refreshToken
        );

        message.success(MESSAGES.LOGIN_SUCCESS);
        navigate(ROUTE_PATHS.HOME);
        
        return data.login;
      }
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message || MESSAGES.LOGIN_ERROR);
      }
      throw err;
    }
  };

  return {
    login,
    loading,
    error,
  };
}
