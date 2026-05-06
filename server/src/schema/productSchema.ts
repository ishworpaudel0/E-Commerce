
import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().positive("Price must be a positive number"),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    brand: z.string().min(1, "Brand is required"),
    category: z.string().min(1, "Category ID is required"),
    images: z.array(z.string()).optional(),
});

//partial schema for updates
export const updateProductSchema = createProductSchema.partial();