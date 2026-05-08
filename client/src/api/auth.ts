import http from "../util/http";
import { type UserLoginRequest, type UserRegisterRequest } from "../types";

export const login = async (body: UserLoginRequest) => {  //UserLoginRequest ensures data sent matches what server wants
  return http.post("/auth/login", body);
};

export const register = async (body: UserRegisterRequest) => {
  return http.post("/auth/register", body);
};
//Sends users entered data to server.
// If it matches server sends tokens.

export interface LogoutData {
  refreshToken: string;
}

//Tells the server to immediately invalidate users session.
export const logout = async (body: LogoutData) => {
  return http.post("/auth/logout", body);
};
