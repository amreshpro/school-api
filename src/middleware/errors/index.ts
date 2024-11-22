import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

// Centralized error handling middleware
export default function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (createError.isHttpError(err)) {
    // If the error is an instance of `http-errors`, handle it
    res.status(err.status || 500).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Generic error handling for other types of errors
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
