import { logNode } from "../log";
import type { IngestionStateType, IngestionUpdate } from "../state";

// TODO(voice ingestion): wire a real STT provider (Whisper / Groq Whisper /
// Deepgram) once one is chosen — deferred, see the AI ingestion plan.
// Voice memories ingest with empty content for now, so downstream
// classification/summary fall back to whatever title the user gave it.
export async function transcribeAudio(state: IngestionStateType): Promise<IngestionUpdate> {
  logNode(state.memoryId, "transcribeAudio", { skipped: "STT provider not yet chosen" });
  return { rawContent: "" };
}
