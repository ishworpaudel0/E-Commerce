import { Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface IShippingAddress {
  address: string;
  city: string;
  phone: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}
