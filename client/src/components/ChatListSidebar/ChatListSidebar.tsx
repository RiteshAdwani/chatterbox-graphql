import { Button, Spin, Empty } from "antd";
import { PlusOutlined, LogoutOutlined } from "@ant-design/icons";
import { useChats } from "../../hooks/chat/useChats";
import { getChatDisplayName, getChatAvatar } from "../../utils/chatHelpers";
import {
  StyledSider,
  SiderHeader,
  SiderTitle,
  ChatList,
  EmptyState,
  ChatItem,
  ChatItemAvatar,
  ChatItemContent,
  ChatItemName,
  ChatItemLastMessage,
  NewChatButton,
  LogoutButton,
  HeaderActions,
  AppTitle,
} from "../../pages/Chats/Chats.styles";

interface ChatListSidebarProps {
  selectedChatId?: string;
  currentUserId: string;
  onSelectChat: (chatId: string) => void;
  onCreateChat: () => void;
  onLogout: () => void;
  logoutLoading?: boolean;
}

export function ChatListSidebar({
  selectedChatId,
  currentUserId,
  onSelectChat,
  onCreateChat,
  onLogout,
  logoutLoading,
}: ChatListSidebarProps) {
  const { chats, loading } = useChats();

  return (
    <StyledSider width={350}>
      <SiderHeader>
        <AppTitle>
          <SiderTitle>ChatterBox</SiderTitle>
        </AppTitle>
        <HeaderActions>
          <NewChatButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateChat}
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
                onClick={onCreateChat}
              >
                Create Your First Chat
              </Button>
            </Empty>
          </EmptyState>
        ) : (
          chats.map((chat) => (
            <ChatItem
              key={chat.id}
              $selected={chat.id === selectedChatId}
              onClick={() => onSelectChat(chat.id)}
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
  );
}
