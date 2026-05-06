export interface userRegisterRequest {
    name: string;
    email: string;
    password: string;
    roles?: string[];
}
export interface userLoginRequest {
    email: string,
    password: string
}
export interface AuthenticatedUser {
    _id: string;
    email: string;
    name: string;
    roles: string[];
    permissions: string[];
}
export interface Permission {
    _id: string;
    name: string;
    description: string;
}

export interface Role {
    _id: string;
    name: string;
    description: string;
    permissions: Permission[];
}

export interface UserWithRolesAndPermission {
    _id: string;
    name: string;
    email: string;
    password: string;
    roles: Role[];
}