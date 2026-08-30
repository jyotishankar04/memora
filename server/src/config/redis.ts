import { Redis } from "ioredis";
import { env } from "./env";

// BullMQ requires this exact option — it manages its own retry/blocking
// behavior and errors if the underlying client gives up on its own.
export const redis = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });
