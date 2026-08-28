import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { verifyAccessToken } from "../utils/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new AppError("Missing or malformed Authorization header", 401, "UNAUTHORIZED"));
  }

  const token = header.slice("Bearer ".length);
  const payload = verifyAccessToken(token);

  req.user = { id: payload.sub, email: payload.email, roles: payload.roles };
  next();
}
