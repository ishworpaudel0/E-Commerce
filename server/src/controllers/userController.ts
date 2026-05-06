import * as userService from "../services/userServices";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/responseHandler";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await userService.getAll();
    return successResponse(res, {
      data: response,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const response = await userService.getById(id as string);
    return successResponse(res, {
      data: response,
      message: "User retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;
    if (!roles || !Array.isArray(roles)) {
      throw new Error("Roles array is required");
    }
    const response = await userService.updateUserRoles(id as string, roles);
    return successResponse(res, {
      data: response,
      message: "User roles updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const response = await userService.updateUser(id as string, req.body);
    return successResponse(res, {
      data: response,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id as string);
    return successResponse(res, {
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.getById((req as any).user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// PATCH /me
export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = (req as any).user.userId;

    console.log("Updating User with ID:", id);

    const updatedUser = await userService.updateUser(id, req.body);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { newPassword } = req.body;
    const userId = (req as any).user.userId;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    await userService.updateUserPassword(userId, newPassword);

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
