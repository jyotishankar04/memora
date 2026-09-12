import { analyzeImage } from "./lib/analyze-image";
import { logNode } from "../log";
import type { IngestionStateType, IngestionUpdate } from "../state";
import { isWithinLimit } from "../../../plans/plans.service";
import { PlanLimitType } from "../../../../db/enums";

export async function processImageVision(state: IngestionStateType): Promise<IngestionUpdate> {
  if (!state.attachmentUrl) {
    logNode(state.memoryId, "processImageVision", { skipped: "no attachment" });
    return { rawContent: "" };
  }

  if (!(await isWithinLimit(state.userId, PlanLimitType.AI_MONTHLY_VISION_QUERIES))) {
    logNode(state.memoryId, "processImageVision", { skipped: "vision quota exceeded" });
    return { rawContent: "" };
  }

  const rawContent = await analyzeImage(state.attachmentUrl, {
    userId: state.userId,
    requestType: "ingestion:vision",
    memoryId: state.memoryId,
  });
  logNode(state.memoryId, "processImageVision", { attachmentUrl: state.attachmentUrl, contentLength: rawContent.length });
  return { rawContent };
}
