import { Request, Response, NextFunction } from "express";

// Custom error class for operational errors
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware — must be registered last in Express.
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isDev = process.env.NODE_ENV === "development";

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  // Prisma unique constraint violation
  if ((err as any).code === "P2002") {
    res
      .status(409)
      .json({ message: "A record with that value already exists" });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Internal server error",
    ...(isDev && { stack: err.stack }),
  });
};
