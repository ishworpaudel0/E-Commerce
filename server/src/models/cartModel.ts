import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default model<ICart>("Cart", cartSchema);
