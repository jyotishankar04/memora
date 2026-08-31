export interface VectorChunkInput {
  index: number;
  content: string;
  embedding: number[];
  tokenCount?: number;
}

export interface VectorUpsertInput {
  memoryId: string;
  userId: string;
  documentEmbedding: number[];
  chunks: VectorChunkInput[];
}

export interface VectorSearchResult {
  memoryId: string;
  score: number;
}

/**
 * Where a memory's embeddings actually live — pgvector columns on the
 * primary DB for local/dev, Upstash Vector for production (see
 * VECTOR_STORE_PROVIDER in src/config/env.ts). RAG passage retrieval over
 * memory_chunks is still out of scope until the "Ask Memora" pass —
 * searchByEmbedding below is document-level only, for the Search feature.
 */
export interface VectorStore {
  upsertMemoryVectors(input: VectorUpsertInput): Promise<void>;
  deleteMemoryVectors(memoryId: string): Promise<void>;
  /**
   * Nearest-neighbor search against each memory's document-level embedding,
   * scoped to userId and in_trash=false. Returns up to `limit` results
   * ordered best-first by cosine similarity (higher = more similar). Does
   * NOT know about isFavorite/isArchived/collectionId/tag/type facets —
   * callers needing those must post-filter (see ../search/).
   */
  searchByEmbedding(userId: string, embedding: number[], limit: number): Promise<VectorSearchResult[]>;
}
