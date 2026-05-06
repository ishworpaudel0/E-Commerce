import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import http from "../../util/http";

export interface Product {
  _id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  category: { _id: string; name: string }; // Populated from backend
  brand: string;
  stock: number;
  images: string[];
  averageRating?: number;
  numReviews?: number;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  totalProducts: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  totalProducts: 0,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await http.get("/products", { params });
      return response.data.data; // Expecting  products, meta
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await http.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product",
      );
    }
  },
);

export const updateExistingProduct = createAsyncThunk(
  "products/update",
  async (
    { id, data }: { id: string; data: Partial<Product> },
    { rejectWithValue },
  ) => {
    try {
      const response = await http.patch(`/products/${id}`, data);
      return response.data.data; // Returns updated product object
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await http.get(`/products/${slug}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.meta.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products.unshift(action.payload);
        },
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateExistingProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateExistingProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          const index = state.products.findIndex(
            (p) => p._id === action.payload._id,
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
          if (state.selectedProduct?._id === action.payload._id) {
            state.selectedProduct = action.payload;
          }
        },
      )
      .addCase(updateExistingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Product by Slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.selectedProduct = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
