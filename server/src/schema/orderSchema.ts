
import { z } from "zod";

export const createOrderSchema = z.object({
    address: z.string().min(5, "Full address is required"),
    city: z.string().min(2, "City is required"),
    phone: z.string()
        .regex(/^9\d{9}$/, "Phone number must be 10 digits and start with 9"),
    paymentMethod: z.enum(['COD', 'eSewa', 'Khalti']).optional().default('COD')
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
});