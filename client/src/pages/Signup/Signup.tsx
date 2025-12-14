import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { SIGNUP_MUTATION } from "../../graphql/mutations/signup";
import {
  setLocalStorageData,
} from "../../utils/localStorage";
import { LOCAL_STORAGE_KEYS } from "../../constants/localStorageKeys";
import { ROUTE_PATHS } from "../../config/routes";
import type { SignupData, SignupInput } from "../../types/auth";
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
  const navigate = useNavigate();
  const [signup, { loading }] = useMutation<SignupData, { input: SignupInput }>(
    SIGNUP_MUTATION
  );

  const onFinish = async (
    values: SignupInput & { confirmPassword: string }
  ) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupInput } = values;
      console.log(confirmPassword);

      const { data } = await signup({
        variables: { input: signupInput },
      });

      if (data?.signup) {
        // Store tokens
        setLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, data.signup.accessToken);
        setLocalStorageData(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, data.signup.refreshToken);

        // Store user data
        setLocalStorageData(LOCAL_STORAGE_KEYS.USER, data.signup.user);

        message.success("Account created successfully!");
        navigate(ROUTE_PATHS.HOME);
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "Signup failed. Please try again.");
      }
    }
  };

  return (
    <Container>
      <StyledCard>
        <Header>
          <Title>ChatterBox</Title>
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
