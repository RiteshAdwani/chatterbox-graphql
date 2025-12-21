import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../../hooks/auth/useProfile";
import { CreateChatModal } from "../../components/CreateChatModal/CreateChatModal";
import { ChatListSidebar } from "../../components/ChatListSidebar/ChatListSidebar";
import { ChatWindow } from "../../components/ChatWindow/ChatWindow";
import { WelcomeScreen } from "../../components/WelcomeScreen/WelcomeScreen";
import { StyledLayout, StyledContent } from "./Chats.styles";

interface ChatsProps {
  onLogout: () => void;
  logoutLoading?: boolean;
}

export function Chats({ onLogout, logoutLoading }: ChatsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const params = useParams<{ chatId?: string }>();
  const chatId = params?.chatId;
  const navigate = useNavigate();

  // Get current user from GraphQL
  const { user: currentUser } = useProfile();
  const currentUserId = currentUser?.id || "";

  const handleSelectChat = (chatId: string) => {
    navigate(`/${chatId}`);
  };

  return (
    <>
      <StyledLayout>
        <ChatListSidebar
          selectedChatId={chatId}
          currentUserId={currentUserId}
          onSelectChat={handleSelectChat}
          onCreateChat={() => setShowCreateModal(true)}
          onLogout={onLogout}
          logoutLoading={logoutLoading}
        />

        <StyledContent>
          {chatId ? (
            <ChatWindow currentUserId={currentUserId} />
          ) : (
            <WelcomeScreen />
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
