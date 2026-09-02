import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

/** Must run after `authenticate` — relies on `req.user` already being set. */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user?.roles.includes("admin")) {
    return next(new AppError("Forbidden", 403, "FORBIDDEN"));
  }
  next();
}
