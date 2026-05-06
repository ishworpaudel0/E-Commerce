import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../util/http";
import { type AuthenticatedUser, type Role } from "../../types";

interface UserWithPopulatedRoles extends Omit<AuthenticatedUser, "roles"> {
  roles: Role[];
  email: string;
}

export interface UserState {
  users: UserWithPopulatedRoles[];
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/users");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);
export const updateUserRoles = createAsyncThunk(
  "users/updateRoles",
  async (
    { id, roles }: { id: string; roles: string[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await http.patch(`/users/${id}/roles`, { roles });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update roles",
      );
    }
  },
);
export const updateUserDetails = createAsyncThunk(
  "users/update",
  async (
    data: { name?: string; email?: string }, // Removed id from arguments
    { rejectWithValue },
  ) => {
    try {
      const response = await http.patch(`/users/me`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const removeUser = createAsyncThunk(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await http.delete(`/users/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user",
      );
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserRoles.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default userSlice.reducer;
