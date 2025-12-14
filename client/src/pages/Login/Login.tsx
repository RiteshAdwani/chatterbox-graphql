import { Form, Input, Button, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import {
  setLocalStorageData,
} from "../../utils/localStorage";
import { LOCAL_STORAGE_KEYS } from "../../constants/localStorageKeys";
import { ROUTE_PATHS } from "../../config/routes";
import type { LoginData, LoginInput } from "../../types/auth";
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
import { LOGIN_MUTATION } from "../../graphql/mutations/login";

export function Login() {
  const navigate = useNavigate();
  const [login, { loading }] = useMutation<LoginData, { input: LoginInput }>(
    LOGIN_MUTATION
  );

  const onFinish = async (values: LoginInput) => {
    try {
      const { data } = await login({
        variables: { input: values },
      });

      if (data?.login) {
        // Store tokens
        setLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, data.login.accessToken);
        setLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, data.login.refreshToken);

        // Store user data
        setLocalStorageData(LOCAL_STORAGE_KEYS.USER, data.login.user);

        message.success("Login successful!");
        navigate(ROUTE_PATHS.HOME);
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "Login failed. Please try again.");
      }
    }
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
