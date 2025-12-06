import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  // Fallback for unexpected errors
  return res.status(500).json({
    error: {
      message: "Something went wrong. Please try again later.",
      code: "INTERNAL_SERVER_ERROR",
    },
  });
}
