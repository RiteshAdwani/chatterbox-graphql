import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { Button, Spin, Empty } from "antd";
import {
  PlusOutlined,
  MessageOutlined,
  SendOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useChats } from "../../hooks/chat/useChats";
import { useMessages } from "../../hooks/chat/useMessages";
import { useSendMessage } from "../../hooks/chat/useSendMessage";
import { useProfile } from "../../hooks/auth/useProfile";
import { CreateChatModal } from "../../components/CreateChatModal/CreateChatModal";
import { getChatDisplayName, getChatAvatar } from "../../utils/chatHelpers";
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
  MessageInputContainer,
  MessageInputWrapper,
  MessageTextarea,
  SendButton,
  WelcomeContainer,
  WelcomeContent,
  WelcomeTitle,
  WelcomeText,
  ChatItem,
  ChatItemAvatar,
  ChatItemContent,
  ChatItemName,
  ChatItemLastMessage,
  NewChatButton,
  MessageBubble,
  MessageContent,
  MessageText,
  MessageTime,
  MessageSender,
  LogoutButton,
  HeaderActions,
  AppTitle,
} from "./Chats.styles";

interface ChatsProps {
  onLogout: () => void;
  logoutLoading?: boolean;
}

export function Chats({ onLogout, logoutLoading }: ChatsProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user from GraphQL
  const { user: currentUser } = useProfile();
  const currentUserId = currentUser?.id || "";

  const { chats, loading } = useChats();
  const { messages, loading: messagesLoading } = useMessages(selectedChat);
  const { sendMessage, loading: sending } = useSendMessage(selectedChat || "");

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    try {
      await sendMessage(messageText.trim());
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  // Format time for messages
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <StyledLayout>
        {/* Chat List Sidebar */}
        <StyledSider width={350}>
          <SiderHeader>
            <AppTitle>
              <SiderTitle>ChatterBox</SiderTitle>
            </AppTitle>
            <HeaderActions>
              <NewChatButton
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowCreateModal(true)}
                size="small"
              >
                New
              </NewChatButton>
              <LogoutButton
                icon={<LogoutOutlined />}
                onClick={onLogout}
                loading={logoutLoading}
                size="small"
              />
            </HeaderActions>
          </SiderHeader>

          <ChatList>
            {loading ? (
              <EmptyState>
                <Spin />
              </EmptyState>
            ) : chats.length === 0 ? (
              <EmptyState>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No chats yet"
                >
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Your First Chat
                  </Button>
                </Empty>
              </EmptyState>
            ) : (
              chats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  $selected={chat.id === selectedChat}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <ChatItemAvatar>{getChatAvatar(chat)}</ChatItemAvatar>
                  <ChatItemContent>
                    <ChatItemName>
                      {getChatDisplayName(chat, currentUserId)}
                    </ChatItemName>
                    {chat.lastMessage && (
                      <ChatItemLastMessage>
                        {chat.lastMessage.from.id === currentUserId
                          ? "You: "
                          : ""}
                        {chat.lastMessage.text}
                      </ChatItemLastMessage>
                    )}
                  </ChatItemContent>
                </ChatItem>
              ))
            )}
          </ChatList>
        </StyledSider>

        {/* Chat Content Area */}
        <StyledContent>
          {selectedChat && selectedChatData ? (
            <ChatContainer>
              <ChatHeader>
                <ChatTitle>
                  {getChatDisplayName(selectedChatData, currentUserId)}
                </ChatTitle>
              </ChatHeader>

              <MessagesArea>
                {messagesLoading ? (
                  <EmptyState>
                    <Spin />
                  </EmptyState>
                ) : messages.length === 0 ? (
                  <EmptyState>
                    No messages yet. Start the conversation!
                  </EmptyState>
                ) : (
                  <>
                    {messages.map((message) => {
                      const isOwnMessage = message.from.id === currentUserId;
                      return (
                        <MessageBubble key={message.id} $isOwn={isOwnMessage}>
                          {!isOwnMessage &&
                            selectedChatData?.type === "GROUP" && (
                              <MessageSender>
                                {message.from.username}
                              </MessageSender>
                            )}
                          <MessageContent $isOwn={isOwnMessage}>
                            <MessageText>{message.text}</MessageText>
                            <MessageTime>
                              {formatTime(message.createdAt)}
                            </MessageTime>
                          </MessageContent>
                        </MessageBubble>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </MessagesArea>

              <MessageInputContainer>
                <MessageInputWrapper>
                  <MessageTextarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message"
                    rows={1}
                  />
                </MessageInputWrapper>
                <SendButton
                  type="primary"
                  shape="circle"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sending}
                  loading={sending}
                />
              </MessageInputContainer>
            </ChatContainer>
          ) : (
            <WelcomeContainer>
              <WelcomeContent>
                <MessageOutlined style={{ fontSize: 64, color: "#00a884" }} />
                <WelcomeTitle>ChatterBox</WelcomeTitle>
                <WelcomeText>Select a chat to start messaging</WelcomeText>
              </WelcomeContent>
            </WelcomeContainer>
          )}
        </StyledContent>
      </StyledLayout>

      <CreateChatModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}
