import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHandler";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthenticatedUser } from "../interfaces/userInterface";

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return errorResponse(res, {
      status: 401,
      message: "No authorization token provided",
    });
  }
  try {
    req.user = jwt.verify(token, config.JWT_SECRET) as AuthenticatedUser;
    next();
  } catch (error) {
    return errorResponse(res, {
      status: 401,
      message: "Invalid or expired token",
    });
  }
};
