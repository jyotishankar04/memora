import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { getChatModel } from "../../ai.providers";
import { logNode } from "../log";
import type { IngestionStateType, IngestionUpdate } from "../state";

interface Insights {
  title: string;
  summary: string;
  suggestedTags: string[];
}

// Adapted from docs/AI_REQUIREMENTS.md's GenerateAIInsights node — extended
// with DetectContentType's output so a recipe's title reflects its
// ingredients, a task's summary reflects its due date, etc.
const prompt = ChatPromptTemplate.fromTemplate(
  `Analyze the following captured memory content and its inferred intent, and generate a structured JSON object.
Content:
{content}

Inferred intent: {inferredIntent} (category: {resourceCategory})
Content type: {contentType}
Extracted fields: {extractedFields}

Respond with valid JSON matching this schema:
{{
  "title": "Clear concise title (max 8 words)",
  "summary": "2-3 sentence overview highlighting core concepts and significance",
  "suggestedTags": ["Tag1", "Tag2", "Tag3"]
}}`,
);

export async function generateAiInsights(state: IngestionStateType): Promise<IngestionUpdate> {
  const chain = prompt.pipe(getChatModel("fast")).pipe(new JsonOutputParser<Insights>());
  const insights = await chain.invoke({
    content: (state.rawContent || "(no content available — summarize from the title/context alone)").slice(0, 4000),
    inferredIntent: state.inferredIntent ?? "",
    resourceCategory: state.resourceCategory ?? "",
    contentType: state.contentType ?? "",
    extractedFields: Object.keys(state.extractedFields).length > 0 ? JSON.stringify(state.extractedFields) : "",
  });

  logNode(state.memoryId, "generateAiInsights", {
    title: insights.title,
    summary: insights.summary,
    suggestedTags: insights.suggestedTags,
  });

  return {
    aiTitle: insights.title,
    aiSummary: insights.summary,
    suggestedTags: insights.suggestedTags,
  };
}
