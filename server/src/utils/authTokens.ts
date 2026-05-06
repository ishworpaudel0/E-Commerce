import { config } from "../config";
import { UserWithRolesAndPermission } from "../interfaces/userInterface";
import jwt from "jsonwebtoken";

export const generateAccessToken = (
  user: UserWithRolesAndPermission,
  roles?: string[],
  permissions?: string[],
) => {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      roles,
      permissions,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" },
  );
};

export const generateRefreshToken = (userId: UserWithRolesAndPermission) => {
  if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: "30m" });
};
