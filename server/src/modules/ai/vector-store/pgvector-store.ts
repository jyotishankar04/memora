import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { memories, memoryChunks } from "../../../db/schema";
import type { VectorStore, VectorUpsertInput } from "./types";

export const pgVectorStore: VectorStore = {
  async upsertMemoryVectors({ memoryId, userId, documentEmbedding, chunks }: VectorUpsertInput) {
    await db.transaction(async (tx) => {
      await tx.update(memories).set({ documentEmbedding }).where(eq(memories.id, memoryId));

      // Re-ingestion is delete-all + reinsert, same pattern as tags/collections/attachments.
      await tx.delete(memoryChunks).where(eq(memoryChunks.memoryId, memoryId));
      if (chunks.length > 0) {
        await tx.insert(memoryChunks).values(
          chunks.map((chunk) => ({
            memoryId,
            userId,
            chunkIndex: chunk.index,
            chunkContent: chunk.content,
            tokenCount: chunk.tokenCount,
            embedding: chunk.embedding,
          })),
        );
      }
    });
  },

  async deleteMemoryVectors() {
    // No-op — memory_chunks.memoryId FK cascades on delete, and
    // memories.document_embedding is a column on the row being deleted.
  },
};
