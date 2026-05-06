import { Schema, model } from "mongoose";
import { ICategory } from "../interfaces/categoryInterface";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    // This allows you to have "Electronics" as a parent and "Laptop" as a child but not used in our project.
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const CategoryModel = model<ICategory>("Category", categorySchema);

export default CategoryModel;
