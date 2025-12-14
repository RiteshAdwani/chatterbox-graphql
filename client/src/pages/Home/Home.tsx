import { useNavigate } from "react-router-dom";
import { removeLocalStorageData } from "../../utils/localStorage";
import { LOCAL_STORAGE_KEYS } from "../../constants/localStorageKeys";
import {
  Container,
  Content,
  Card,
  Header,
  Title,
  LogoutButton,
  Text,
} from "./Home.styles";
import { Chats } from "../Chats/Chats";

export function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    removeLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    removeLocalStorageData(LOCAL_STORAGE_KEYS.USER);
    navigate("/login");
  };

  return (
    <Container>
      <Content>
        <Card>
          <Header>
            <Title>Home</Title>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </Header>
          <Text>Welcome to ChatterBox!</Text>
        </Card>
        <Chats />
      </Content>
    </Container>
  );
}
