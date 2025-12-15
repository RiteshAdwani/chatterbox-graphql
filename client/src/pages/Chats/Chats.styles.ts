import styled from "styled-components";
import { Layout, Button } from "antd";

const { Sider, Content } = Layout;

export const StyledLayout = styled(Layout)`
  height: 100vh;
`;

export const StyledSider = styled(Sider)`
  background-color: ${(props) => props.theme.colors.panel};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

export const SiderHeader = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(props) => props.theme.spacing.sm};
`;

export const AppTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

export const SiderTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

export const LogoutButton = styled(Button)`
  &:hover {
    color: ${(props) => props.theme.colors.error || "#ff4d4f"};
    border-color: ${(props) => props.theme.colors.error || "#ff4d4f"};
  }
`;

export const NewChatButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
  border-color: ${(props) => props.theme.colors.primary};

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    border-color: ${(props) => props.theme.colors.secondary};
  }
`;

export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing.sm};
`;

export const ChatItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) =>
    props.$selected ? props.theme.colors.primary + "10" : "transparent"};
  border: 2px solid
    ${(props) =>
      props.$selected ? props.theme.colors.primary : "transparent"};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.panel};
  }

  & + & {
    margin-top: ${(props) => props.theme.spacing.xs};
  }
`;

export const ChatItemAvatar = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 50%;
  font-size: 24px;
`;

export const ChatItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ChatItemName = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  color: ${(props) => props.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ChatItemLastMessage = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmptyState = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;
  padding: ${(props) => props.theme.spacing.xl} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledContent = styled(Content)`
  background-color: ${(props) => props.theme.colors.background};
`;

export const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ChatHeader = styled.div`
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.panel};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  z-index: 1;
`;

export const ChatTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: ${(props) => props.theme.colors.text};
`;

export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${(props) => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xs};
  background-color: #e5ddd5; /* WhatsApp-like background */
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.03) 10px,
    rgba(255, 255, 255, 0.03) 20px
  );
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

export const MessageInput = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.panel};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

export const MessageInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.panel};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

export const MessageInputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 8px;
  padding: ${(props) => props.theme.spacing.sm} ${(props) =>
    props.theme.spacing.md};
`;

export const MessageTextarea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: ${(props) => props.theme.colors.text};
  resize: none;
  max-height: 100px;
  font-family: inherit;
  line-height: 1.5;

  &::placeholder {
    color: ${(props) => props.theme.colors.textSecondary};
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.border};
    border-radius: 3px;
  }
`;

export const SendButton = styled(Button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.primary};
  border-color: ${(props) => props.theme.colors.primary};
  padding: 0;

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors.secondary};
    border-color: ${(props) => props.theme.colors.secondary};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.border};
    border-color: ${(props) => props.theme.colors.border};
    cursor: not-allowed;
  }

  .anticon {
    font-size: 20px;
  }
`;

export const WelcomeContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const WelcomeContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`;

export const WelcomeTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

export const WelcomeText = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;

// WhatsApp-style message bubbles
export const MessageBubble = styled.div<{ $isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isOwn ? "flex-end" : "flex-start")};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  width: 100%;
`;

export const MessageSender = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 4px;
  padding-left: ${(props) => props.theme.spacing.sm};
`;

export const MessageContent = styled.div<{ $isOwn?: boolean }>`
  background-color: ${(props) =>
    props.$isOwn ? props.theme.colors.primary : props.theme.colors.panel};
  color: ${(props) => (props.$isOwn ? "#fff" : props.theme.colors.text)};
  padding: 8px 12px;
  border-radius: 12px;
  position: relative;
  display: inline-block;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  max-width: 70%;
  word-wrap: break-word;
`;

export const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  margin-bottom: 4px;
`;

export const MessageTime = styled.div`
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
  margin-top: 2px;
`;
