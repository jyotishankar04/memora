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

/**
 * Where a memory's embeddings actually live — pgvector columns on the
 * primary DB for local/dev, Upstash Vector for production (see
 * VECTOR_STORE_PROVIDER in src/config/env.ts). Ingestion only ever needs to
 * write and delete; retrieval is out of scope until the "Ask Memora" pass.
 */
export interface VectorStore {
  upsertMemoryVectors(input: VectorUpsertInput): Promise<void>;
  deleteMemoryVectors(memoryId: string): Promise<void>;
}
