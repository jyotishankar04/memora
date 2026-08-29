import type { ErrorRequestHandler } from "express";
import { AppError } from "./app-error";
import { ApiResponse } from "../response/api-response";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const log = req.log ?? logger;

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      log.error({ err: error, code: error.code }, error.message);
    }
    return res
      .status(error.statusCode)
      .json(ApiResponse.error(error.code, error.message, error.details));
  }

  log.error({ err: error }, "Unhandled error");
  return res
    .status(500)
    .json(ApiResponse.error("INTERNAL_ERROR", "Internal server error"));
};
