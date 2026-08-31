import { logger } from "../../../shared/utils/logger";

/** One consistent log line per ingestion node, so a run can be traced step by step in the console. */
export function logNode(memoryId: string, node: string, data: Record<string, unknown> = {}): void {
  logger.info({ memoryId, node, ...data }, `[ingestion] ${node}`);
}
