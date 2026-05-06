export interface Role {
    name: string;
    description: string;
    permissions?: string[];
}
export interface createRoleRequest {
    name: string;
    description: string;
    permissions?: string[];
}