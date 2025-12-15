import { useLogout } from "../../hooks/auth/useLogout";
import { Chats } from "../Chats/Chats";

export function Home() {
  const { logout, loading } = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return <Chats onLogout={handleLogout} logoutLoading={loading} />;
}
