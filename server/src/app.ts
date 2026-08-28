import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors";
import routes from "./routes/index";
import { errorHandler } from "./shared/errors/error-handler";
import { notFound } from "./shared/middlewares/not-found";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use("/api/v1", routes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
