import { Queue } from "bullmq";
import { redis } from "../../../config/redis";

export interface IngestionJobData {
  memoryId: string;
}

export const ingestionQueue = new Queue<IngestionJobData>("ingestion", { connection: redis });

/** Fire-and-forget from memory.service.ts — never let a queue failure fail the create/delete request. */
export async function enqueueIngestion(memoryId: string): Promise<void> {
  await ingestionQueue.add("ingest", { memoryId });
}
