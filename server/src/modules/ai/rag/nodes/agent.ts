import { SystemMessage } from "@langchain/core/messages";
import type { GraphNode } from "@langchain/langgraph";
import { getChatModel } from "../../ai.providers";
import { tools } from "../tools";
import { AGENT_SYSTEM_PROMPT } from "../prompts";
import type { RAGState } from "../state";

// bindTools is typed optional on BaseChatModel (not every implementation
// supports tool calling) — both concrete models getChatModel can return
// (ChatOpenAI, ChatGroq) do, so this is a safe non-null assertion.
const modelWithTools = getChatModel("reasoning").bindTools!(tools);

export const agentNode: GraphNode<typeof RAGState> = async (state) => {
  // Computed per-invocation (not baked into the static prompt string) so
  // "today" is always the actual day the turn runs on — search_memories_by_date
  // needs this to resolve relative terms like "yesterday" or "last week"
  // into the absolute YYYY-MM-DD it requires.
  const today = new Date().toISOString().slice(0, 10);
  const systemPrompt = `${AGENT_SYSTEM_PROMPT}\n\nToday's date is ${today}.`;

  const response = await modelWithTools.invoke([new SystemMessage(systemPrompt), ...state.messages]);
  return { messages: [response] };
};
