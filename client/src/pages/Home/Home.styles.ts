import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.xl};
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Card = styled.div`
  background-color: ${(props) => props.theme.colors.panel};
  padding: ${(props) => props.theme.spacing.xl};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.md};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

export const LogoutButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  background-color: ${(props) => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    opacity: 0.9;
  }
`;

export const Text = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;
