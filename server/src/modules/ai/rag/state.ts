import { StateSchema, MessagesValue } from "@langchain/langgraph";
import { z } from "zod";

// Message-array state (not the ingestion pipeline's named-field StateSchema
// style, see ingestion/state.ts) — deliberate: a tool-calling conversational
// loop's state IS a growing message list, the standard shape LangGraph's
// prebuilt ToolNode expects. MessagesValue supplies the add_messages reducer.
export const RAGState = new StateSchema({
  messages: MessagesValue,
  // Caps the checkGrounding -> Agent retry loop at one retry (see graph.ts).
  retryCount: z.number().default(0),
  // Set by checkGrounding, read by routeAfterGrounding. Defaults true so a
  // run that never reaches checkGrounding (shouldn't happen, but) doesn't
  // spuriously loop.
  grounded: z.boolean().default(true),
  // Set by frontDesk, read by routeAfterFrontDesk. frontDesk runs
  // unconditionally at the start of every turn and always overwrites this,
  // so — unlike retryCount — it never needs an explicit per-turn reset in
  // ai.service.ts.
  inScope: z.boolean().default(true),
});

export type RAGStateType = typeof RAGState.State;
export type RAGUpdate = typeof RAGState.Update;
