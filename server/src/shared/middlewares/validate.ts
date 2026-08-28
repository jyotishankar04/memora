import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/app-error";

export function validate(schema: ZodType, source: "body" | "query" | "params" = "body"): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new AppError("Validation failed", 400, "BAD_REQUEST", result.error.flatten()));
    }

    req[source] = result.data;
    next();
  };
}
