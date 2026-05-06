import { Document, Types } from "mongoose";

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    category: Types.ObjectId; // References category
    brand: string;
    stock: number;
    images: string[];
    specifications: Record<string, string>; // e.g., { "RAM": "16GB", "Storage": "512GB SSD" }
    isFeatured: boolean;
    averageRating: number;
    numReviews: number;
    status: 'active' | 'inactive';
}