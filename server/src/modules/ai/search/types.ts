/** One leg's ranked candidate — score is leg-specific (cosine similarity for
 *  the semantic leg, ts_rank_cd for the lexical leg) and only ever used for
 *  within-leg ordering before RRF fusion collapses both legs to rank-only. */
export interface SearchLegResult {
  memoryId: string;
  score: number;
}
