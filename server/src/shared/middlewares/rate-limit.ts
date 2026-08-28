import rateLimit from "express-rate-limit";
import { ApiResponse } from "../response/api-response";

const rateLimitHandler = (_req: unknown, res: import("express").Response) => {
  res
    .status(429)
    .json(ApiResponse.error("RATE_LIMITED", "Too many requests, try again later."));
};

export const oauthRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
