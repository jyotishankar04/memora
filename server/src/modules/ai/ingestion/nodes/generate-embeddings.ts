import { getEmbeddings } from "../../ai.providers";
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

  return { documentEmbedding, chunkEmbeddings };
}
