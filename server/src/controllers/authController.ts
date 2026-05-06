import { Request, Response, NextFunction } from "express";
import * as authServices from "../services/authServices";
import { successResponse, errorResponse } from "../utils/responseHandler";
import httpCodes from "../constant/httpCodes";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authServices.register(req.body);
    return successResponse(res, {
      status: httpCodes.RESOURCE_CREATED.statusCode,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authServices.login(req.body);
    return successResponse(res, {
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;
    const userId = user?.userId || user?._id || user?.id;

    if (userId) {
      await authServices.logout(userId);
    }

    res.clearCookie("accessToken");
    return successResponse(res, {
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, {
        status: 401,
        message: "Refresh Token required",
      });
    }

    const result = await authServices.refreshAccessToken(refreshToken);

    return successResponse(res, {
      data: result,
      message: "Token refreshed successfully",
    });
  } catch (error: any) {
    next(error);
    return errorResponse(res, {
      status: 403,
      message: "Invalid Refresh Token",
    });
  }
};
