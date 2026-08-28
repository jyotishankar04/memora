import type { Request, Response } from "express";
import { ApiResponse } from "../response/api-response";

export function notFound(req: Request, res: Response) {
  return res
    .status(404)
    .json(
      ApiResponse.error(
        "NOT_FOUND",
        `Route ${req.method} ${req.originalUrl} not found`,
      ),
    );
}
