import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { SIGNUP_MUTATION } from "../../graphql/mutations/auth";
import { setLocalStorageData } from "../../utils/localStorage";
import { LOCAL_STORAGE_KEYS } from "../../constants/localStorageKeys";
import { MESSAGES } from "../../constants/messages.constants";
import { ROUTE_PATHS } from "../../config/routes";
import type { SignupData, SignupInput } from "../../types/auth";

export function useSignup() {
  const navigate = useNavigate();
  const [signupMutation, { loading, error }] = useMutation<
    SignupData,
    { input: SignupInput }
  >(SIGNUP_MUTATION);

  const signup = async (input: SignupInput) => {
    try {
      const { data } = await signupMutation({
        variables: { input },
      });

      if (data?.signup) {
        // Store tokens
        setLocalStorageData(
          LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
          data.signup.accessToken
        );
        setLocalStorageData(
          LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
          data.signup.refreshToken
        );

        message.success(MESSAGES.SIGNUP_SUCCESS);
        navigate(ROUTE_PATHS.HOME);
        
        return data.signup;
      }
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message || MESSAGES.SIGNUP_ERROR);
      }
      throw err;
    }
  };

  return {
    signup,
    loading,
    error,
  };
}
