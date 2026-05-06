import { Request, Response, NextFunction } from "express";
import * as roleService from "../services/roleService";
import { successResponse } from "../utils/responseHandler";
import httpCodes from "../constant/httpCodes";

export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await roleService.createRole(req.body);
    return successResponse(res, {
      data: response,
      message: "Role created successfully",
      status: httpCodes.RESOURCE_CREATED.statusCode,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await roleService.getAllRoles();
    return successResponse(res, {
      data: response,
      message: "Roles retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new Error("Invalid role id");
    }
    const response = await roleService.updateRole(id, req.body);
    return successResponse(res, {
      data: response,
      message: "Role updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await roleService.deleteRole(id as string);
    return successResponse(res, {
      message: "Role deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
