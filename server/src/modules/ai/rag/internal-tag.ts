/** Tag for graph-internal chat-model calls whose raw output must never
 *  reach the client stream (structured-output calls that aren't themselves
 *  the user-facing answer). ai.service.ts filters streamEvents() on this —
 *  see nodes/check-grounding.ts and nodes/front-desk.ts for the two calls
 *  that use it today. */
export const INTERNAL_EVENT_TAG = "internal:rag-graph";
