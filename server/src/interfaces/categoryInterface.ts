import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  parentCategory?: Types.ObjectId | null; // For nesting (e.g., Laptop under Electronics) but not used in this project.
  status: "active" | "inactive";
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentCategory?: string;
}
