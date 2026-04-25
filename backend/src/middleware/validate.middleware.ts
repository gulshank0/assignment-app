import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Factory middleware to validate request body against a Zod schema.
 * Returns 400 with formatted error messages on failure.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e: any) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    req.body = result.data;
    next();
  };
