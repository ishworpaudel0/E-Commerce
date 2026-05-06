import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateRequestBody =
  (schema: z.ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;
    next();
  };

export const validateParams =
  (schema: z.ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    req.params = result.data;
    next();
  };

export const validateQueryParams =
  (schema: z.ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, result.data);

    next();
  };
