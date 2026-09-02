import { StateGraph, START, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { RAGState } from "./state";
import { frontDeskNode, routeAfterFrontDesk } from "./nodes/front-desk";
import { agentNode } from "./nodes/agent";
import { checkGroundingNode, routeAfterGrounding } from "./nodes/check-grounding";
import { tools } from "./tools";
import { checkpointer } from "./checkpointer";

function shouldContinue(state: typeof RAGState.State): "tools" | "checkGrounding" {
  const lastMessage = state.messages.at(-1);
  if (lastMessage && AIMessage.isInstance(lastMessage) && lastMessage.tool_calls?.length) {
    return "tools";
  }
  return "checkGrounding";
}

// frontDesk gates every turn before the main loop — an irrelevant request
// (general knowledge, coding help, small talk) gets a direct decline and
// the graph ends there, without spending a reasoning-tier call or a
// search_memories invocation on it (see nodes/front-desk.ts).
//
// Agent <-> ToolNode is the extensible loop past that gate: a future tool
// is a new file in tools/ + one registry entry, no graph changes.
// checkGrounding is this graph's other addition beyond that loop —
// worthwhile specifically for "answer questions about my own saved data"
// honesty (see nodes/check-grounding.ts).
const builder = new StateGraph(RAGState)
  .addNode("frontDesk", frontDeskNode)
  .addNode("agent", agentNode)
  .addNode("tools", new ToolNode(tools))
  .addNode("checkGrounding", checkGroundingNode)
  .addEdge(START, "frontDesk")
  .addConditionalEdges("frontDesk", routeAfterFrontDesk, {
    agent: "agent",
    __end__: END,
  })
  .addConditionalEdges("agent", shouldContinue, {
    tools: "tools",
    checkGrounding: "checkGrounding",
  })
  .addEdge("tools", "agent")
  .addConditionalEdges("checkGrounding", routeAfterGrounding, {
    agent: "agent",
    __end__: END,
  });

export const compiledRagGraph = builder.compile({ checkpointer });
