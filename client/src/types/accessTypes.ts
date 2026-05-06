export interface Permission {
  _id: string;
  name: string;
  description: string;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[] | string[];
}

export interface CreatePermissionRequest {
  name: string;
  description: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions?: string[];
}
