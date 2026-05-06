import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/categoryServices";
import { successResponse } from "../utils/responseHandler";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return successResponse(res, {
      status: 201,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getAllCategories();
    return successResponse(res, {
      status: 200,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
