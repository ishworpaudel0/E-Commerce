import type { Role } from "./accessTypes";

export interface AuthenticatedUser {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface UserLoginRequest {
  email: string;
  password: string;
}
export interface AuthState {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  roles: Role[] | string[];
  permissions: string[];
  loading: boolean;
  isAuthenticated: boolean;
  email: string | null;
  userName: string | null;
}
