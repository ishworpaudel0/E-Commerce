import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/orderServices";
import { successResponse } from "../utils/responseHandler";

const getUserId = (req: Request) => {
  const user = (req as any).user;
  return user?.userId || user?._id;
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);

    console.log("DEBUG USER in createOrder:", {
      userId,
      fullUser: (req as any).user,
    });

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const order = await orderService.createOrder(userId, req.body);

    return successResponse(res, {
      status: 201,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error: any) {
    console.error("Order creation error:", error.message);
    next(error);
  }
};

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const orders = await orderService.getMyOrders(userId);
    return successResponse(res, { data: orders });
  } catch (error) {
    next(error);
  }
};

export const cancelUserOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const isAdmin = (req as any).user?.role === "admin";

    const order = await orderService.cancelOrder(
      orderId as string,
      userId,
      isAdmin,
    );

    return successResponse(res, {
      message: "Order cancelled",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(
      orderId as string,
      status,
    );

    return successResponse(res, {
      message: "Status updated",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await orderService.getAllOrders();
    return successResponse(res, { data: orders });
  } catch (error) {
    next(error);
  }
};
