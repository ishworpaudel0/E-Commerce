import {z} from 'zod';

export const createPermissionSchema = z.object({
    name: z.string().min(3, 'Permission name must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long')
}); 