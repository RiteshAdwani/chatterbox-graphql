import { MessageOutlined } from "@ant-design/icons";
import {
  WelcomeContainer,
  WelcomeContent,
  WelcomeTitle,
  WelcomeText,
} from "../../pages/Chats/Chats.styles";

export function WelcomeScreen() {
  return (
    <WelcomeContainer>
      <WelcomeContent>
        <MessageOutlined style={{ fontSize: 64, color: "#00a884" }} />
        <WelcomeTitle>ChatterBox</WelcomeTitle>
        <WelcomeText>Select a chat to start messaging</WelcomeText>
      </WelcomeContent>
    </WelcomeContainer>
  );
}
