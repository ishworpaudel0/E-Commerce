import {z} from 'zod';

export const createRolesSchema = z.object({
    name: z.string().min(3, 'Role name must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    permissions: z.array(z.string()).optional()
}); 
export const updateRolesSchema = z.object({
    name: z.string().min(3, 'Role name must be at least 3 characters long').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters long').optional(),
    permissions: z.array(z.string()).optional()
});