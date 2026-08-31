import { logNode } from "../log";
import type { IngestionStateType, IngestionUpdate } from "../state";

/** note + video (no transcript source yet, see transcribe-audio.ts) — the seeded rawContent just gets trimmed. */
export function normalizeNote(state: IngestionStateType): IngestionUpdate {
  const rawContent = state.rawContent.trim();
  logNode(state.memoryId, "normalizeNote", { contentLength: rawContent.length });
  return { rawContent };
}
