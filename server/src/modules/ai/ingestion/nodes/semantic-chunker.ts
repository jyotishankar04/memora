import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { logNode } from "../log";
import type { IngestionStateType, IngestionUpdate } from "../state";

// Verbatim from docs/AI_REQUIREMENTS.md's SemanticChunker node.
export async function semanticChunker(state: IngestionStateType): Promise<IngestionUpdate> {
  if (!state.rawContent) {
    logNode(state.memoryId, "semanticChunker", { chunkCount: 0 });
    return { chunks: [] };
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 120,
    separators: ["\n## ", "\n### ", "\n\n", "\n", ". ", " "],
  });
  const texts = await splitter.splitText(state.rawContent);
  const chunks = texts.map((content, index) => ({ index, content }));

  logNode(state.memoryId, "semanticChunker", { chunkCount: chunks.length, chunkSizes: chunks.map((c) => c.content.length) });

  return { chunks };
}
