import { HumanMessage } from "@langchain/core/messages";
import { getVisionModels, invokeWithFallback } from "../../../ai.providers";
import { logger } from "../../../../../shared/utils/logger";

const PROMPT = `You are analyzing an image a user saved to their personal knowledge base.

1. Transcribe any text visible in the image verbatim (OCR) — this could be
   code, an error message, a receipt, a chat conversation, a recipe, etc.
   If there is no legible text, say "No text detected."
2. Describe the image visually: notable UI components/layout, objects,
   colors/style, and any other detail that explains what the image shows.

Respond in plain text using this structure:
Text in image: <verbatim OCR text, or "No text detected.">
Visual description: <structured description>`;

/**
 * OCR + visual description for an image via a vision-capable chat model.
 * `imageUrl` can be an R2-hosted attachment URL or a live public image
 * URL — either way the model is just pointed at it, no local download.
 * Never throws — degrades to "" on any failure (including every model in
 * the fallback list failing), same convention as every other ingestion step.
 */
export async function analyzeImage(imageUrl: string): Promise<string> {
  try {
    const message = new HumanMessage({
      content: [
        { type: "text", text: PROMPT },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    });
    return (await invokeWithFallback(getVisionModels(), [message])).trim();
  } catch (err) {
    logger.warn({ err, imageUrl }, "analyzeImage: failed to analyze image");
    return "";
  }
}
