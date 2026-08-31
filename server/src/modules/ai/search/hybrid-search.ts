import { and, inArray, type SQL } from "drizzle-orm";
import { db } from "../../../db";
import { memories } from "../../../db/schema";
import { lexicalSearch } from "./lexical-search";
import { semanticSearch } from "./semantic-search";
import { rrfMerge, SEMANTIC_SIMILARITY_FLOOR, type RankedResult } from "./rrf";

export interface HybridSearchParams {
  userId: string;
  /** Already trimmed, already known non-empty. */
  query: string;
  /** The same SQL[] the non-search list path builds (userId/inTrash/
   *  isArchived/type/isFavorite/collectionId/tag) — reused as-is for the
   *  lexical leg's WHERE, and re-checked against the semantic leg's
   *  candidates (see below). */
  filterConditions: SQL[];
  candidateLimit: number;
}

/**
 * Runs both legs in parallel and RRF-merges (k=60) into one ranked memoryId
 * list. Does NOT fetch full memory rows — the caller (memory.service.ts)
 * owns that, reusing its existing toListItem/attachTags/attachCollections
 * helpers.
 *
 * The semantic leg gets a facet post-filter that the lexical leg doesn't
 * need: lexicalSearch runs directly against the same Postgres table as
 * every filter, so passing filterConditions straight into its WHERE is free
 * and exact. The vector leg might be Upstash in production, and Upstash's
 * metadata (memoryId/userId/kind) deliberately doesn't mirror mutable,
 * multi-valued facets like isFavorite or many-to-many collectionId/tag —
 * keeping those in sync on every updateMemory() call would be a much
 * bigger, staleness-prone feature on its own. So instead this re-checks
 * filterConditions with one small bounded query against just the semantic
 * leg's own candidate IDs.
 *
 * Known tradeoff: under VECTOR_STORE_PROVIDER=upstash with a narrow facet
 * filter (e.g. searching inside one small collection), the semantic leg's
 * global top-K candidates are filtered after retrieval rather than during —
 * a true match inside a narrow collection could theoretically miss the
 * top-K cut. Doesn't affect pgvector (dev/local) at all. Not solved here;
 * see the plan doc for the follow-up (mirror `type` into Upstash metadata)
 * if this proves real in practice.
 */
export async function hybridSearch({
  userId,
  query,
  filterConditions,
  candidateLimit,
}: HybridSearchParams): Promise<RankedResult[]> {
  const [lexicalResults, semanticResultsRaw] = await Promise.all([
    lexicalSearch(query, filterConditions, candidateLimit),
    semanticSearch(userId, query, candidateLimit),
  ]);

  const semanticAboveFloor = semanticResultsRaw.filter((r) => r.score >= SEMANTIC_SIMILARITY_FLOOR);

  let semanticFiltered = semanticAboveFloor;
  if (semanticAboveFloor.length > 0) {
    const candidateIds = semanticAboveFloor.map((r) => r.memoryId);
    const allowedRows = await db
      .select({ id: memories.id })
      .from(memories)
      .where(and(...filterConditions, inArray(memories.id, candidateIds)));
    const allowed = new Set(allowedRows.map((r) => r.id));
    semanticFiltered = semanticAboveFloor.filter((r) => allowed.has(r.memoryId));
  }

  return rrfMerge(semanticFiltered, lexicalResults);
}
