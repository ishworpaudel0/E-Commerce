import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHandler";
import { errorLogger } from "../utils/logger";
import httpCodes from "../constant/httpCodes";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  errorLogger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
  });
  const status = err.status || httpCodes.INTERNAL_SERVER_ERROR.statusCode;
  const message = err.message || "An unexpected error occurred";

  return errorResponse(res, {
    status,
    message,
    code: err.code || "INTERNAL_ERROR",
    details: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
