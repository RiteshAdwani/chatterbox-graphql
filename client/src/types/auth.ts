export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  login: AuthResponse;
}

export interface SignupData {
  signup: AuthResponse;
}

export interface RefreshTokenData {
  refresh: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenVariables {
  refreshToken: string;
}

export interface LogoutData {
  logout: boolean;
}
