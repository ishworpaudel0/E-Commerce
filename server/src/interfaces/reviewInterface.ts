import {Document, Types} from "mongoose";

export interface IReview extends Document {
    product: Types.ObjectId; // Reference to Product
    user: Types.ObjectId; // Reference to User
    rating: number; 
    comment: string;
}