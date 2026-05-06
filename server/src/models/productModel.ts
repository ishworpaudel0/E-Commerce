import { Schema, model } from "mongoose";
import { IProduct } from "../interfaces/productInterface";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    specifications: { type: Map, of: String },
    isFeatured: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  },
);

const ProductModel = model<IProduct>("Product", productSchema);
export default ProductModel;
