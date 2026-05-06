export interface IOrderItem {
  product: string;
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

export interface IOrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface IOrder {
  _id: string;
  user: IOrderUser | string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: string;
  rating: number;
  comment: string;
}
