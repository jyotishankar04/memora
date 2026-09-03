import { getEmbeddings } from "../../ai.providers";
import { logAiUsage } from "../../../ai-usage/usage-logger";
import { logNode } from "../log";
import type { IngestionStateType, IngestionUpdate } from "../state";

// Verbatim from docs/AI_REQUIREMENTS.md's GenerateEmbeddings node: one
// document-level embedding from title+summary+intent+tags, plus one
// embedding per chunk.
export async function generateEmbeddings(state: IngestionStateType): Promise<IngestionUpdate> {
  const embeddings = getEmbeddings();
  const docText = [
    state.aiTitle ?? "",
    state.aiSummary ?? "",
    state.inferredIntent ?? "",
    `Tags: ${state.suggestedTags.join(", ")}`,
  ].join("\n");
  const chunkTexts = state.chunks.map((chunk) => chunk.content);

  const [documentEmbedding, chunkEmbeddings] = await Promise.all([
    embeddings.embedQuery(docText),
    chunkTexts.length > 0 ? embeddings.embedDocuments(chunkTexts) : Promise.resolve([]),
  ]);

  logNode(state.memoryId, "generateEmbeddings", {
    documentEmbeddingDims: documentEmbedding.length,
    chunkEmbeddingCount: chunkEmbeddings.length,
  });

  // OpenAIEmbeddings doesn't surface token usage through LangChain.js —
  // log a call-count row (no token fields) rather than a real count.
  void logAiUsage({
    userId: state.userId,
    requestType: "embedding:document",
    provider: "openai",
    model: "text-embedding-3-small",
    memoryId: state.memoryId,
    metadata: { calls: 1 + (chunkTexts.length > 0 ? 1 : 0), chunkCount: chunkTexts.length },
  });

  return { documentEmbedding, chunkEmbeddings };
}
