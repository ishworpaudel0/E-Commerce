import { Request, Response, NextFunction } from "express";
import * as cartService from "../services/cartServices";
import { successResponse } from "../utils/responseHandler";

export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("DEBUG USER:", (req as any).user);
    const { productId, quantity } = req.body;

    const user = (req as any).user;
    const userId = user?.userId || user?._id || user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User context missing" });
    }

    const cart = await cartService.addToCart(userId, productId, quantity || 1);

    return successResponse(res, {
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;
    const userId = user?.userId || user?._id || user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User context missing" });
    }

    const cart = await cartService.getCart(userId);

    return successResponse(res, {
      message: "Cart retrieved",
      data: cart || { items: [], totalPrice: 0 },
    });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const user = (req as any).user;
    const userId = user?.userId || user?._id || user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User context missing" });
    }

    const cart = await cartService.removeItemFromCart(
      userId,
      productId as string,
    );

    return successResponse(res, {
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const clearUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;
    const userId = user?.userId || user?._id || user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User context missing" });
    }

    const cart = await cartService.clearCart(userId);

    return successResponse(res, {
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
