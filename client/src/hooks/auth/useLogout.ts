import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { LOGOUT_MUTATION } from "../../graphql/mutations/auth";
import { MESSAGES } from "../../constants/messages.constants";
import { ROUTE_PATHS } from "../../config/routes";

export function useLogout() {
  const navigate = useNavigate();
  const [logoutMutation, { loading, error }] = useMutation(LOGOUT_MUTATION);

  const logout = async () => {
    try {
      await logoutMutation();

      // Clear all localStorage
      localStorage.clear();

      message.success(MESSAGES.LOGOUT_SUCCESS);
      navigate(ROUTE_PATHS.LOGIN);
    } catch (err) {
      // Even if the mutation fails, clear local storage and redirect
      console.error("Logout error:", err);
      localStorage.clear();
      message.info(MESSAGES.LOGOUT_INFO);
      navigate(ROUTE_PATHS.LOGIN);
    }
  };

  return {
    logout,
    loading,
    error,
  };
}
