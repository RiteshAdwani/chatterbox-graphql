import styled from "styled-components";
import { Layout } from "antd";

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
`;

export const SiderTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing.sm};
`;

export const EmptyState = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  text-align: center;
  padding: ${(props) => props.theme.spacing.xl} 0;
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
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.panel};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

export const ChatTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => props.theme.spacing.md};
`;

export const MessageInput = styled.div`
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.panel};
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

export const WelcomeContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const WelcomeContent = styled.div`
  text-align: center;
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
