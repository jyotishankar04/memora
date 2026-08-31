import { env } from "../../../config/env";
import { pgVectorStore } from "./pgvector-store";
import { createUpstashVectorStore } from "./upstash-store";
import type { VectorStore } from "./types";

export type { VectorStore, VectorUpsertInput, VectorChunkInput } from "./types";

let store: VectorStore | undefined;

/** Local/dev: pgvector columns on this Postgres. Production: Upstash Vector — see VECTOR_STORE_PROVIDER. */
export function getVectorStore(): VectorStore {
  if (!store) {
    store = env.VECTOR_STORE_PROVIDER === "upstash" ? createUpstashVectorStore() : pgVectorStore;
  }
  return store;
}
