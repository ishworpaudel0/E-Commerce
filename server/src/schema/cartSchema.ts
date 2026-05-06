import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Product ID format"),
    quantity: z.number()
        .int()
        .min(1, "Quantity must be at least 1")
        .max(20, "Maximum 20 units allowed")
});