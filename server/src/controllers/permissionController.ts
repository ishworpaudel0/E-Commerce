import { Request, Response, NextFunction } from "express";
import * as permissionService from "../services/permissionService";
import { successResponse } from "../utils/responseHandler";

export const createPermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await permissionService.createdPermissions(req.body);
    return successResponse(res, {
      data: response,
      message: "Permission created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await permissionService.getAllPermissions();
    return successResponse(res, {
      data: response,
      message: "Permissions retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};
