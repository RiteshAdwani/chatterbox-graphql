export type User = {
  id: string;
  email: String;
};

export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  username: string;
  email: string;
  password: string;
};
