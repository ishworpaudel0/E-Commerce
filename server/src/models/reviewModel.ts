import { IReview } from "../interfaces/reviewInterface";
import { Schema, model } from "mongoose";

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

export default model<IReview>("Review", reviewSchema);
