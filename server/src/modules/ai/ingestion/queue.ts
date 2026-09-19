import { Queue } from "bullmq";
import { redis } from "../../../config/redis";
import { resolveEffectivePlan } from "../../plans/plans.service";

export interface IngestionJobData {
  memoryId: string;
}

export const ingestionQueue = new Queue<IngestionJobData>("ingestion", { connection: redis });

// BullMQ: lower number = processed first. Free users fall back to the
// default (lowest priority) via the `?? DEFAULT_QUEUE_PRIORITY` below,
// so an unrecognized/future plan key never accidentally jumps the queue.
export const PLAN_QUEUE_PRIORITY: Record<string, number> = { pro: 1, plus: 5, free: 10 };
export const DEFAULT_QUEUE_PRIORITY = 10;

/** Fire-and-forget from memory.service.ts — never let a queue failure fail the create/delete request. */
export async function enqueueIngestion(memoryId: string, userId: string): Promise<void> {
  const { plan } = await resolveEffectivePlan(userId);
  const priority = PLAN_QUEUE_PRIORITY[plan.key] ?? DEFAULT_QUEUE_PRIORITY;
  await ingestionQueue.add("ingest", { memoryId }, { priority });
}
