import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserDetails } from "./userSlice";
import http from "../../util/http";
import {
  type AuthState,
  type UserLoginRequest,
  type UserRegisterRequest,
} from "../../types";
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  clearTokens,
} from "../../util/tokens";

const getSavedUser = () => {
  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const savedUser = getSavedUser();

const initialState: AuthState & {
  error: string | null;
  userName: string | null;
} = {
  isAuthenticated: !!getAccessToken(),
  userId: localStorage.getItem("userId") || savedUser?._id || null,
  userName: savedUser?.name || null,
  accessToken: getAccessToken() || null,
  refreshToken: getRefreshToken() || null,
  roles: savedUser?.roles || [],
  permissions: savedUser?.permissions || [],
  loading: false,
  error: null,
  email: savedUser?.email || null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: UserRegisterRequest, { rejectWithValue }) => {
    try {
      const response = await http.post("/auth/register", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: UserLoginRequest, { rejectWithValue }) => {
    try {
      const response = await http.post("/auth/login", credentials);
      const { accessToken, refreshToken, user } = response.data.data;
      saveAccessToken(accessToken);
      saveRefreshToken(refreshToken);
      return { accessToken, refreshToken, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (payload: { refreshToken: string }) => {
    try {
      await http.post("/auth/logout", payload);
    } finally {
      clearTokens();
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.userId = null;
      state.userName = null;
      state.email = null;
      state.roles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);
        state.loading = false;
        state.isAuthenticated = true;
        state.userId = user._id;
        state.userName = user.name;
        state.email = user.email;
        state.roles = user.roles;
        state.permissions = user.permissions;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.userId = null;
        state.userName = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        // We check against action.payload._id (the response from the backend)
        if (state.userId === action.payload._id) {
          state.userName = action.payload.name;
          state.email = action.payload.email;

          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem(
            "user",
            JSON.stringify({ ...currentUser, ...action.payload }),
          );
        }
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          if (action.payload?.status === 401) {
            state.isAuthenticated = false;
            state.accessToken = null;
          }
        },
      );
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
