import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { eq } from "drizzle-orm";
import { db } from "../../../../db";
import { collections } from "../../../../db/schema";
import { getChatModel } from "../../ai.providers";
import { logNode } from "../log";
import type { IngestionStateType, IngestionUpdate } from "../state";

interface CollectionDecision {
  action: "existing" | "new" | "none";
  collectionName?: string;
  icon?: string;
  description?: string;
}

const prompt = ChatPromptTemplate.fromTemplate(
  `You are organizing a personal knowledge base into collections (folders).
A new memory was just saved:
Title: {title}
Summary: {summary}
Category: {resourceCategory}

The user's existing collections:
{existingCollections}

Decide how to organize this memory:
- If one of the existing collections is clearly a good fit, respond with action "existing" and its exact name (must match one of the names above exactly).
- If none fit well but this memory represents a distinct, likely-recurring theme worth its own collection, respond with action "new" and propose a short name (2-4 words), a single emoji as the icon, and a one-sentence description.
- If this is too generic or one-off to deserve categorization (e.g. a passing reminder, a single unrelated link), respond with action "none".

Be conservative about proposing a new collection — only do it for a genuinely distinct, likely-recurring topic, not every memory.

Respond as strict JSON: {{"action": "existing"|"new"|"none", "collectionName": "...", "icon": "...", "description": "..."}}`,
);

/** Conservative by design — most memories should come back "none" rather than spawning a new collection per save. */
export async function organizeCollection(state: IngestionStateType): Promise<IngestionUpdate> {
  const existing = await db
    .select({ name: collections.name, description: collections.description })
    .from(collections)
    .where(eq(collections.userId, state.userId));

  const existingCollectionsText =
    existing.length > 0
      ? existing.map((c) => `- ${c.name}${c.description ? `: ${c.description}` : ""}`).join("\n")
      : "(none yet)";

  const chain = prompt.pipe(getChatModel("fast")).pipe(new JsonOutputParser<CollectionDecision>());
  const decision = await chain.invoke({
    title: state.aiTitle ?? state.existingTitle,
    summary: state.aiSummary ?? "",
    resourceCategory: state.resourceCategory ?? "",
    existingCollections: existingCollectionsText,
  });

  logNode(state.memoryId, "organizeCollection", decision as unknown as Record<string, unknown>);

  return {
    collectionAction: decision.action,
    collectionName: decision.collectionName ?? null,
    collectionIcon: decision.icon ?? null,
    collectionDescription: decision.description ?? null,
  };
}
