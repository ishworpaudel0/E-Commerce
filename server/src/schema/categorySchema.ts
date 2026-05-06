import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(3, 'Category name must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    parentCategory: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Parent ID format").optional().nullable(),
});