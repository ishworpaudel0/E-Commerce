import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../util/http";
import type { IOrder } from "../../types/orderTypes";

export interface OrderState {
  orders: IOrder[];
  allOrders: IOrder[];
  currentOrder: IOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  allOrders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "orders/create",
  async (shippingData: any, { rejectWithValue }) => {
    try {
      const response = await http.post("/orders", shippingData);
      return response.data.data;
    } catch (error: any) {
      console.error("Order creation error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

// Fetch User's Own Orders
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/orders/my-orders");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

// Fetch All Orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get("/orders/admin/all");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all orders",
      );
    }
  },
);

// Update Order Status (Admin)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async (
    { orderId, status }: { orderId: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await http.patch(`/orders/status/${orderId}`, {
        status,
      });
      return { orderId, status, data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })

      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status (Admin)
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        state.allOrders = state.allOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order,
        );
      });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
