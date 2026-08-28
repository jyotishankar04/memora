import dotenv from "dotenv";
import z from "zod";
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  MAILHOG_URL: z.string().min(1, "MAILHOG_URL is required"),
  // SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  // SMTP_PORT: z.coerce.number().default(1025),
  // SMTP_USERNAME: z.string().optional(),
  // SMTP_PASSWORD: z.string().optional(),
  // SMTP_FROM_ADDRESS: z.string().email().optional(),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  FRONTEND_URL: z.string().url().min(1, "FRONTEND_URL is required"),
});

export const env = envSchema.parse(process.env);