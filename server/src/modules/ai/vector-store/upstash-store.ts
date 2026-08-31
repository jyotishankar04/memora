import { Index } from "@upstash/vector";
import { env } from "../../../config/env";
import type { VectorStore, VectorUpsertInput } from "./types";

// IDs are prefixed with the memory ID so a whole memory's vectors (document +
// every chunk) can be removed in one call via `delete({ prefix })` — Upstash
// doesn't know about our Postgres FK cascades, so this is the only way to
// avoid orphaned vectors when a memory is deleted.
function documentVectorId(memoryId: string): string {
  return `${memoryId}:document`;
}

function chunkVectorId(memoryId: string, chunkIndex: number): string {
  return `${memoryId}:chunk:${chunkIndex}`;
}

export function createUpstashVectorStore(): VectorStore {
  const index = new Index({
    url: env.UPSTASH_VECTOR_REST_URL,
    token: env.UPSTASH_VECTOR_REST_TOKEN,
  });

  return {
    async upsertMemoryVectors({ memoryId, userId, documentEmbedding, chunks }: VectorUpsertInput) {
      // Re-ingestion is delete-all + reinsert, same pattern as the pgvector store.
      await index.delete({ prefix: `${memoryId}:` });

      await index.upsert([
        {
          id: documentVectorId(memoryId),
          vector: documentEmbedding,
          metadata: { memoryId, userId, kind: "document" as const },
        },
        ...chunks.map((chunk) => ({
          id: chunkVectorId(memoryId, chunk.index),
          vector: chunk.embedding,
          metadata: {
            memoryId,
            userId,
            kind: "chunk" as const,
            chunkIndex: chunk.index,
            content: chunk.content,
          },
        })),
      ]);
    },

    async deleteMemoryVectors(memoryId: string) {
      await index.delete({ prefix: `${memoryId}:` });
    },

    async searchByEmbedding(userId, embedding, limit) {
      // kind='document' scopes this to the one summary-level vector per
      // memory (not the per-chunk vectors also stored under this same
      // index) — memoryId is read straight off metadata rather than parsed
      // out of the `${memoryId}:document` id string.
      const results = await index.query<{ memoryId: string; userId: string; kind: string }>({
        vector: embedding,
        topK: limit,
        filter: `kind = 'document' and userId = '${userId}'`,
        includeMetadata: true,
      });

      return results
        .filter((r) => r.metadata?.memoryId)
        .map((r) => ({ memoryId: r.metadata!.memoryId, score: r.score }));
    },
  };
}
