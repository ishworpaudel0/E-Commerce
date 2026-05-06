import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  clearTokens,
} from "./tokens";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const response = await axios.post(
          `${http.defaults.baseURL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        const { accessToken } = response.data.data;
        saveAccessToken(accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return http(originalRequest);
      } catch (refreshError) {
        clearTokens();
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default http;
