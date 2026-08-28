import type { ErrorRequestHandler } from "express";
import { AppError } from "./app-error";
import { ApiResponse } from "../response/api-response";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json(ApiResponse.error(error.code, error.message, error.details));
  }

  logger.error(error);
  return res
    .status(500)
    .json(ApiResponse.error("INTERNAL_ERROR", "Internal server error"));
};
