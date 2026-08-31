import { and, sql, type SQL } from "drizzle-orm";
import { db } from "../../../db";
import { memories } from "../../../db/schema";
import type { SearchLegResult } from "./types";

/**
 * Always Postgres, regardless of VECTOR_STORE_PROVIDER — tsvector/GIN has no
 * Upstash equivalent and doesn't need one, it's already local. `filterConditions`
 * must already include userId/inTrash/isArchived/type/isFavorite/collectionId/tag
 * scoping (the same conditions the non-search list path builds) — this
 * function only adds the full-text-search predicate on top.
 */
export async function lexicalSearch(
  queryText: string,
  filterConditions: SQL[],
  limit: number,
): Promise<SearchLegResult[]> {
  const tsQuery = sql`plainto_tsquery('english', ${queryText})`;
  const rows = await db
    .select({
      id: memories.id,
      score: sql<number>`ts_rank_cd(${memories.ftsTokens}, ${tsQuery})`.as("score"),
    })
    .from(memories)
    .where(and(...filterConditions, sql`${memories.ftsTokens} @@ ${tsQuery}`))
    .orderBy(sql`ts_rank_cd(${memories.ftsTokens}, ${tsQuery}) DESC`)
    .limit(limit);

  return rows.map((row) => ({ memoryId: row.id, score: row.score }));
}
