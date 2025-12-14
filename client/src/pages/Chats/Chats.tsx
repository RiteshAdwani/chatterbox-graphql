import { useState } from "react";
import {
  StyledLayout,
  StyledSider,
  SiderHeader,
  SiderTitle,
  ChatList,
  EmptyState,
  StyledContent,
  ChatContainer,
  ChatHeader,
  ChatTitle,
  MessagesArea,
  MessageInput,
  WelcomeContainer,
  WelcomeContent,
  WelcomeTitle,
  WelcomeText,
} from "./Chats.styles";

export function Chats() {
  const [selectedChat] = useState<string | null>(null);

  return (
    <StyledLayout>
      {/* Chat List Sidebar */}
      <StyledSider width={400} breakpoint="lg" collapsedWidth="0">
        <SiderHeader>
          <SiderTitle>Chats</SiderTitle>
        </SiderHeader>

        <ChatList>
          <EmptyState>No chats yet</EmptyState>
        </ChatList>
      </StyledSider>

      {/* Chat Content Area */}
      <StyledContent>
        {selectedChat ? (
          <ChatContainer>
            <ChatHeader>
              <ChatTitle>Chat Header</ChatTitle>
            </ChatHeader>

            <MessagesArea>
              <EmptyState>Messages will appear here</EmptyState>
            </MessagesArea>

            <MessageInput>
              <EmptyState>Message input will be here</EmptyState>
            </MessageInput>
          </ChatContainer>
        ) : (
          <WelcomeContainer>
            <WelcomeContent>
              <WelcomeTitle>ChatterBox</WelcomeTitle>
              <WelcomeText>Select a chat to start messaging</WelcomeText>
            </WelcomeContent>
          </WelcomeContainer>
        )}
      </StyledContent>
    </StyledLayout>
  );
}
