import slugify from "slugify";
import CategoryModel from "../models/categoryModel";
import { ICategory, CreateCategoryRequest } from "../interfaces/categoryInterface";

export const createCategory = async (data: CreateCategoryRequest): Promise<ICategory> => {
    const { name, description, parentCategory } = data;

    //Generate the slug from the name
    const slug = slugify(name, { lower: true, strict: true });

    //Not used
    if (parentCategory) {
        const parentExists = await CategoryModel.findById(parentCategory);
        if (!parentExists) {
            throw new Error("Parent category not found");
        }
    }
    const newCategory = new CategoryModel({
        name,
        slug,
        description,
        parentCategory: parentCategory || null
    });

    return await newCategory.save();
};

export const getAllCategories = async () => {
    return await CategoryModel.find().populate("parentCategory", "name");
};