import { z } from "zod";

export const createUser = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(10)
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10),
});