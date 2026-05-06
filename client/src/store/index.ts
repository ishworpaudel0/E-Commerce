import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import reviewReducer from "./slices/reviewSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    user: userReducer,
    reviews: reviewReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
