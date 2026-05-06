import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../util/http";

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  parentCategory?: { name: string; _id: string } | null; //not used in this project just placeholder if we want to expand.
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/categories");
      // Backend returns data inside a 'data' property so we use data.data
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

export const createCategory = createAsyncThunk(
  "category/create",
  async (
    categoryData: { name: string; description: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await http.post("/categories", categoryData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Creation failed",
      );
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  },
});

export default categorySlice.reducer;
