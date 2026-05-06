import http from "../util/http";
import { type UserLoginRequest, type UserRegisterRequest } from "../types";

export const login = async (body: UserLoginRequest) => {
  return http.post("/auth/login", body);
};

export const register = async (body: UserRegisterRequest) => {
  return http.post("/auth/register", body);
};

export interface LogoutData {
  refreshToken: string;
}

export const logout = async (body: LogoutData) => {
  return http.post("/auth/logout", body);
};
