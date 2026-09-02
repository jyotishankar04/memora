import { AIMessage, ToolMessage } from "@langchain/core/messages";
import type { GraphNode } from "@langchain/langgraph";
import { z } from "zod";
import { getChatModel } from "../../ai.providers";
import { GROUNDING_CHECK_PROMPT } from "../prompts";
import { RAGState, type RAGStateType } from "../state";
import { INTERNAL_EVENT_TAG } from "../internal-tag";

const groundingSchema = z.object({ grounded: z.boolean() });

// Zod-validated structured output (model.withStructuredOutput), not a bare
// JsonOutputParser<T> cast — matches this graph's convention (see
// tools/search-memories.ts's result schema) of validating every LLM-produced
// structured value at runtime, not just trusting a TS type annotation.
const groundingModel = getChatModel("fast").withStructuredOutput(groundingSchema);

/** Every ToolMessage since the last human turn — what the final answer had available. */
function collectToolResultsText(messages: RAGStateType["messages"]): string {
  const results: string[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.getType() === "human") break;
    if (ToolMessage.isInstance(message)) {
      results.push(typeof message.content === "string" ? message.content : JSON.stringify(message.content));
    }
  }
  return results.reverse().join("\n\n") || "(no tool results this turn)";
}

export const checkGroundingNode: GraphNode<typeof RAGState> = async (state) => {
  const lastMessage = state.messages.at(-1);
  const answer =
    lastMessage && AIMessage.isInstance(lastMessage) && typeof lastMessage.content === "string" ? lastMessage.content : "";

  // Nothing to ground (e.g. the model produced only tool calls, no final
  // text yet) — treat as grounded so routing doesn't stall on an empty check.
  if (!answer) return { grounded: true };

  const toolResults = collectToolResultsText(state.messages);
  const prompt = GROUNDING_CHECK_PROMPT.replace("{toolResults}", toolResults).replace("{answer}", answer);
  // Tagged so the streaming layer (ai.service.ts) can filter this internal
  // structured-output call out of the client-visible stream — without this,
  // streamEvents() surfaces every chat-model call in the graph, including
  // this one, and its raw `{"grounded":...}` JSON leaks into the UI as a
  // second fake assistant message (confirmed live before this fix).
  const { grounded } = await groundingModel.invoke(prompt, { tags: [INTERNAL_EVENT_TAG] });

  return { grounded, retryCount: grounded ? state.retryCount : state.retryCount + 1 };
};

export function routeAfterGrounding(state: RAGStateType): "agent" | "__end__" {
  if (state.grounded) return "__end__";
  if (state.retryCount >= 1) return "__end__"; // capped at one retry
  return "agent";
}
