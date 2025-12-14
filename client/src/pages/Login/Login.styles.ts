import styled from "styled-components";
import { Card } from "antd";
import { Link } from "react-router-dom";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
`;

export const StyledCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  box-shadow: ${(props) => props.theme.shadows.lg};
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

export const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;

export const Footer = styled.div`
  text-align: center;
  margin-top: ${(props) => props.theme.spacing.md};
`;

export const FooterText = styled.span`
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.primary};

  &:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;
