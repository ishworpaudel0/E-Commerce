import { NextFunction, Response } from "express";
import { AuthRequest } from "./userMiddleware";
import { UserWithRolesAndPermission } from "../interfaces/userInterface";

export interface AuthorizeOptions {
  permission: string;
}

export const authorizeWithPermission = (options: AuthorizeOptions) => {
  const { permission } = options;

  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new Error("User not authenticated"));
    }
    if (user?.roles.includes("SUPER_ADMIN")) {
      return next();
    }

    const userPermissions = user.permissions || [];

    const isAuthorized = userPermissions.includes(permission);

    if (!isAuthorized) {
      return next(new Error("User does not have the required permission"));
    }

    next();
  };
};
