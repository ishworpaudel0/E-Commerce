import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../util/http";
import { type Product } from "./productSlice";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/cart");
      return response.data.data; // Returns  items and totalPrice
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart",
      );
    }
  },
);

export const addItemToCart = createAsyncThunk(
  "cart/add",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await http.post("/cart/add", { productId, quantity });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item",
      );
    }
  },
);

export const removeItem = createAsyncThunk(
  "cart/remove",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await http.delete(`/cart/remove/${productId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      });
  },
});

export default cartSlice.reducer;
