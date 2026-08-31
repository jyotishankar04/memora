import type { SearchLegResult } from "./types";

// Standard RRF constant, matches docs/AI_REQUIREMENTS.md's hybrid search spec.
export const RRF_K = 60;

// Cosine-similarity floor for the semantic leg, applied before RRF ranking
// so a small corpus's "least-bad" noise never earns a rank position when
// the lexical leg found nothing real. text-embedding-3-small cosine scores
// for genuinely related short-query/summary pairs commonly land ~0.25-0.45;
// unrelated pairs commonly sit ~0.05-0.15. 0.2 is a conservative cut — tune
// empirically once real search traffic exists.
export const SEMANTIC_SIMILARITY_FLOOR = 0.2;

export interface RankedResult {
  memoryId: string;
  rrfScore: number;
}

/**
 * Both inputs must already be sorted best-first (by leg-specific score) and
 * pre-filtered (the similarity floor already applied to `semantic`) — rank
 * is 1-based position within each already-sorted, already-filtered list. A
 * memory found on both legs naturally outranks one found on only one, with
 * no hand-tuned weighting between the two.
 */
export function rrfMerge(semantic: SearchLegResult[], lexical: SearchLegResult[]): RankedResult[] {
  const scores = new Map<string, number>();

  const addLeg = (leg: SearchLegResult[]) => {
    leg.forEach((item, index) => {
      const rank = index + 1;
      scores.set(item.memoryId, (scores.get(item.memoryId) ?? 0) + 1 / (RRF_K + rank));
    });
  };

  addLeg(semantic);
  addLeg(lexical);

  return [...scores.entries()]
    .map(([memoryId, rrfScore]) => ({ memoryId, rrfScore }))
    .sort((a, b) => b.rrfScore - a.rrfScore);
}
