import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../util/http";

export interface ReviewState {
  reviews: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchProductReviews = createAsyncThunk(
  "reviews/fetchByProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await http.get(`/reviews/${productId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch reviews",
        status: error.response?.status,
      });
    }
  },
);

export const addReview = createAsyncThunk(
  "reviews/add",
  async (
    {
      productId,
      rating,
      comment,
    }: { productId: string; rating: number; comment: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await http.post(`/reviews/${productId}`, {
        rating,
        comment,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to add review",
        status: error.response?.status,
      });
    }
  },
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || "Review failed";
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
