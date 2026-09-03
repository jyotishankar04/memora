import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { GraphNode } from "@langchain/langgraph";
import { z } from "zod";
import { getChatModel } from "../../ai.providers";
import { createUsageCallback } from "../../../ai-usage/usage-logger";
import { FRONT_DESK_CLASSIFY_PROMPT, FRONT_DESK_DECLINE_PROMPT } from "../prompts";
import { RAGState, type RAGStateType } from "../state";
import { INTERNAL_EVENT_TAG } from "../internal-tag";

const classifySchema = z.object({ inScope: z.boolean() });

// Fast tier for both calls — classification is a cheap yes/no, and the
// decline reply is a short canned-shaped message, neither needs the
// reasoning tier the main agent uses.
const classifyModel = getChatModel("fast").withStructuredOutput(classifySchema);
const declineModel = getChatModel("fast");

/**
 * Runs before the main agent on every turn — a cheap gate so an obviously
 * off-topic request ("write me a poem", "what's 12*7") gets a direct,
 * honest decline instead of reaching the reasoning-tier tool-calling agent,
 * which has no explicit rule against answering unrelated questions from its
 * own general knowledge (AGENT_SYSTEM_PROMPT only guards against fabricating
 * about *saved* content). Two calls, not one, so the decline message streams
 * to the client the same proven way agentNode's replies do (a plain
 * modelWithTools-shaped invoke producing a real AIMessage) rather than
 * hand-constructing an AIMessage from structured-output JSON, which
 * checkGrounding's leak bug (see nodes/check-grounding.ts) showed is easy to
 * get wrong around streamEvents().
 */
export const frontDeskNode: GraphNode<typeof RAGState> = async (state, config) => {
  const lastMessage = state.messages.at(-1);
  const query = lastMessage && HumanMessage.isInstance(lastMessage) && typeof lastMessage.content === "string" ? lastMessage.content : "";
  if (!query) return { inScope: true };

  const userId = (config.context as { userId?: string } | undefined)?.userId ?? null;
  const threadId = (config.configurable as { thread_id?: string } | undefined)?.thread_id ?? null;

  const prompt = FRONT_DESK_CLASSIFY_PROMPT.replace("{query}", query);
  // Tagged internal — this classifier call must never leak into the client
  // stream (same reasoning as checkGrounding's tagged call).
  const { inScope } = await classifyModel.invoke(prompt, {
    tags: [INTERNAL_EVENT_TAG],
    callbacks: [createUsageCallback({ userId, requestType: "rag:front_desk_classify", threadId })],
  });
  if (inScope) return { inScope: true };

  const decline = await declineModel.invoke([new SystemMessage(FRONT_DESK_DECLINE_PROMPT), ...state.messages], {
    callbacks: [createUsageCallback({ userId, requestType: "rag:front_desk_decline", threadId })],
  });
  return { inScope: false, messages: [decline as AIMessage] };
};

export function routeAfterFrontDesk(state: RAGStateType): "agent" | "__end__" {
  return state.inScope ? "agent" : "__end__";
}
