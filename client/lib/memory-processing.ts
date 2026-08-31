import type { Memory } from "@/types/memory";

/** True while a memory is still mid-ingestion (memories.status, set server-side — see docs/URL_CAPTURE_AND_PREVIEW.md). */
export function isMemoryProcessing(item: Pick<Memory, "status">): boolean {
  return item.status === "processing";
}
