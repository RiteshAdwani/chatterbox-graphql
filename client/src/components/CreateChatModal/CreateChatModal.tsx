import { useState } from "react";
import { useCreateChat } from "../../hooks/chat/useCreateChat";
import { useUsers } from "../../hooks/useUsers";
import type { ChatType } from "../../types/chat";
import {
  StyledModal,
  FormSection,
  Label,
  StyledSelect,
  StyledInput,
  ChatTypeContainer,
  ChatTypeButton,
  HelperText,
} from "./CreateChatModal.styles";

interface CreateChatModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateChatModal({ open, onClose }: CreateChatModalProps) {
  const { users, loading: loadingUsers } = useUsers();
  const { createChat, loading: creatingChat } = useCreateChat();
  
  const [chatType, setChatType] = useState<ChatType>("DIRECT");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [chatName, setChatName] = useState("");

  // Reset form when modal opens
  const handleClose = () => {
    setChatType("DIRECT");
    setSelectedUserIds([]);
    setChatName("");
    onClose();
  };

  const handleCreateChat = async () => {
    if (selectedUserIds.length === 0) {
      return;
    }

    await createChat({
      participantUserIds: selectedUserIds,
      type: chatType,
      name: chatType === "GROUP" ? chatName || undefined : undefined,
    });

    handleClose();
  };

  const handleUserChange = (value: unknown) => {
    setSelectedUserIds(value as string[]);
  };

  const userOptions = users.map((user) => ({
    label: `${user.username} (${user.email})`,
    value: user.id,
  }));

  const isValid =
    selectedUserIds.length > 0 &&
    (chatType === "DIRECT" || (chatType === "GROUP" && chatName.trim()));

  return (
    <StyledModal
      title="Create New Chat"
      open={open}
      onCancel={handleClose}
      onOk={handleCreateChat}
      okText="Create Chat"
      okButtonProps={{ 
        disabled: !isValid || creatingChat,
        loading: creatingChat 
      }}
      cancelButtonProps={{ disabled: creatingChat }}
      width={500}
    >
      <FormSection>
        <Label>Chat Type</Label>
        <ChatTypeContainer>
          <ChatTypeButton
            type="button"
            $selected={chatType === "DIRECT"}
            onClick={() => setChatType("DIRECT")}
          >
            Direct Message
          </ChatTypeButton>
          <ChatTypeButton
            type="button"
            $selected={chatType === "GROUP"}
            onClick={() => setChatType("GROUP")}
          >
            Group Chat
          </ChatTypeButton>
        </ChatTypeContainer>
        <HelperText>
          {chatType === "DIRECT"
            ? "One-on-one conversation with another user"
            : "Chat with multiple users"}
        </HelperText>
      </FormSection>

      {chatType === "GROUP" && (
        <FormSection>
          <Label>Group Name *</Label>
          <StyledInput
            placeholder="Enter group name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            disabled={creatingChat}
          />
        </FormSection>
      )}

      <FormSection>
        <Label>
          Select Participants * 
          {chatType === "DIRECT" ? " (1 user)" : " (at least 1 user)"}
        </Label>
        <StyledSelect
          mode="multiple"
          placeholder="Select users to chat with"
          value={selectedUserIds}
          onChange={handleUserChange}
          options={userOptions}
          loading={loadingUsers}
          disabled={creatingChat}
          maxCount={chatType === "DIRECT" ? 1 : undefined}
          filterOption={(input, option) =>
            (option?.label ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        />
        {chatType === "DIRECT" && selectedUserIds.length > 0 && (
          <HelperText>
            You can only select one user for direct messages
          </HelperText>
        )}
      </FormSection>
    </StyledModal>
  );
}
