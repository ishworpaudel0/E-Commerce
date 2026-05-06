import * as productService from "../services/productServices";
import { successResponse } from "../utils/responseHandler";
import { Request, Response, NextFunction } from "express";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract URLs from Cloudinary results
    if (req.files && Array.isArray(req.files)) {
      req.body.images = (req.files as any[]).map((file) => file.path);
    }

    const product = await productService.createProduct(req.body);

    return successResponse(res, {
      status: 201,
      message: "Product created with images successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await productService.getAllProducts(req.query);

    return successResponse(res, {
      data: response,
      message: "Products retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const response = await productService.updateProduct(id as string, req.body);
    if (!response) {
      throw new Error("Product not found");
    }
    return successResponse(res, {
      data: response,
      message: "Product updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
// to get detail product page by slug
export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== "string") {
      throw new Error("Invalid slug parameter");
    }
    const product = await productService.getProductBySlug(slug);
    if (!product) throw new Error("Product not found");

    return successResponse(res, {
      data: product,
      message: "Product retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};
