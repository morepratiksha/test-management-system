export interface LoginPayload {
  userId: string;
  password: string;
}

export interface AuthUser {
  [key: string]: unknown;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}