import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useSignup } from "../../hooks/auth/useSignup";
import { ROUTE_PATHS } from "../../config/routes";
import type { SignupInput } from "../../types/auth";
import {
  Container,
  StyledCard,
  Header,
  Title,
  Subtitle,
  Footer,
  FooterText,
  StyledLink,
} from "./Signup.styles";

export function Signup() {
  const { signup, loading } = useSignup();

  const onFinish = async (
    values: SignupInput & { confirmPassword: string }
  ) => {
    // Remove confirmPassword before sending to API
    const { ...signupInput } = values;

    await signup(signupInput);
  };

  return (
    <Container>
      <StyledCard>
        <Header>
          <Title>{import.meta.env.VITE_APP_NAME || "ChatterBox"}</Title>
          <Subtitle>Create your account</Subtitle>
        </Header>

        <Form
          name="signup"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

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
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
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
              Sign up
            </Button>
          </Form.Item>
        </Form>

        <Footer>
          <FooterText>Already have an account? </FooterText>
          <StyledLink to={ROUTE_PATHS.LOGIN}>Log in</StyledLink>
        </Footer>
      </StyledCard>
    </Container>
  );
}
