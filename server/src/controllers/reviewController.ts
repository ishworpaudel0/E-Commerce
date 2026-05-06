import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/reviewServices";
import { successResponse } from "../utils/responseHandler";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("🔐 Auth user in controller:", (req as any).user);

    const decodedUser = (req as any).user;
    const userId = decodedUser?.userId || decodedUser?._id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const { productId } = req.params;

    const review = await reviewService.addReview(
      userId,
      productId as string,
      req.body,
    );

    return successResponse(res, {
      status: 201,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    console.error("Review creation error:", error);
    next(error);
  }
};

export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsForProduct(
      productId as string,
    );

    return successResponse(res, {
      data: reviews,
      message: "Reviews retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};
