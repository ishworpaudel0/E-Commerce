import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/adminServices";
import { successResponse } from "../utils/responseHandler";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await adminService.getDashboardStats();
    return successResponse(res, {
      message: "Dashboard stats fetched",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await adminService.getAllOrdersForAdmin();
    return successResponse(res, {
      message: "All orders fetched",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
