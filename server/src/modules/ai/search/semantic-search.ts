import { getEmbeddings } from "../ai.providers";
import { getVectorStore } from "../vector-store";
import { logAiUsage } from "../../ai-usage/usage-logger";
import { logger } from "../../../shared/utils/logger";
import type { SearchLegResult } from "./types";

// Below this, embedding the query is wasted cost for a near-meaningless
// vector — the lexical leg handles short queries fine on its own.
export const MIN_SEMANTIC_QUERY_LENGTH = 3;

/**
 * Never throws — an OpenAI outage or vector-store failure degrades to an
 * empty leg (hybridSearch proceeds lexical-only) rather than failing the
 * whole search, matching this codebase's ingestion-wide "degrade, don't fail"
 * convention.
 */
export async function semanticSearch(userId: string, queryText: string, limit: number): Promise<SearchLegResult[]> {
  if (queryText.length < MIN_SEMANTIC_QUERY_LENGTH) return [];

  try {
    const embedding = await getEmbeddings().embedQuery(queryText);
    void logAiUsage({ userId, requestType: "embedding:query", provider: "openai", model: "text-embedding-3-small" });
    return await getVectorStore().searchByEmbedding(userId, embedding, limit);
  } catch (err) {
    logger.error({ err, userId }, "semanticSearch: leg failed, degrading to lexical-only");
    return [];
  }
}
