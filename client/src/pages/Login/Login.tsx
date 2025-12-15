import { Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useLogin } from "../../hooks/auth/useLogin";
import { ROUTE_PATHS } from "../../config/routes";
import type { LoginInput } from "../../types/auth";
import {
  Container,
  StyledCard,
  Header,
  Title,
  Subtitle,
  Footer,
  FooterText,
  StyledLink,
} from "./Login.styles";

export function Login() {
  const { login, loading } = useLogin();

  const onFinish = async (values: LoginInput) => {
    await login(values);
  };

  return (
    <Container>
      <StyledCard>
        <Header>
          <Title>ChatterBox</Title>
          <Subtitle>Sign in to your account</Subtitle>
        </Header>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: "100%" }}
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        <Footer>
          <FooterText>Don't have an account? </FooterText>
          <StyledLink to={ROUTE_PATHS.SIGNUP}>Sign up</StyledLink>
        </Footer>
      </StyledCard>
    </Container>
  );
}
