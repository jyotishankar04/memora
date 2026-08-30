import { StateGraph, START, END } from "@langchain/langgraph";
import { IngestionState } from "./state";
import { routeMediaType } from "./nodes/route-media-type";
import { parseWebContent } from "./nodes/parse-web-content";
import { transcribeAudio } from "./nodes/transcribe-audio";
import { processImageVision } from "./nodes/process-image-vision";
import { extractDocText } from "./nodes/extract-doc-text";
import { normalizeNote } from "./nodes/normalize-note";
import { correctCaption } from "./nodes/correct-caption";
import { detectContentType } from "./nodes/detect-content-type";
import { classifyIntent } from "./nodes/classify-intent";
import { generateAiInsights } from "./nodes/generate-ai-insights";
import { organizeCollection } from "./nodes/organize-collection";
import { semanticChunker } from "./nodes/semantic-chunker";
import { generateEmbeddings } from "./nodes/generate-embeddings";
import { upsertVectors } from "./nodes/upsert-vectors";

// Mirrors docs/AI_REQUIREMENTS.md's ingestion state machine, with three
// additions beyond the spec: CorrectCaption right after the per-media
// parser — spelling/grammar fixes for a caption typed alongside a link or
// attachment, never touching a "note"'s own body — then DetectContentType —
// open-vocabulary type + structured field extraction from whatever raw text
// the user entered — and OrganizeCollection between GenerateAIInsights and
// SemanticChunker, deciding whether this memory belongs in an existing
// collection, warrants a new one, or neither.
// RouteMediaType -> (per-media-type parser) -> CorrectCaption ->
// DetectContentType -> ClassifyIntent -> GenerateAIInsights ->
// OrganizeCollection -> SemanticChunker -> GenerateEmbeddings ->
// UpsertVectors.
const PARSER_NODES = ["parseWebContent", "transcribeAudio", "processImageVision", "extractDocText", "normalizeNote"] as const;

const builder = new StateGraph(IngestionState)
  .addNode("parseWebContent", parseWebContent)
  .addNode("transcribeAudio", transcribeAudio)
  .addNode("processImageVision", processImageVision)
  .addNode("extractDocText", extractDocText)
  .addNode("normalizeNote", normalizeNote)
  .addNode("correctCaption", correctCaption)
  .addNode("detectContentType", detectContentType)
  .addNode("classifyIntent", classifyIntent)
  .addNode("generateAiInsights", generateAiInsights)
  .addNode("organizeCollection", organizeCollection)
  .addNode("semanticChunker", semanticChunker)
  .addNode("generateEmbeddings", generateEmbeddings)
  .addNode("upsertVectors", upsertVectors)
  .addConditionalEdges(START, routeMediaType, {
    parseWebContent: "parseWebContent",
    transcribeAudio: "transcribeAudio",
    processImageVision: "processImageVision",
    extractDocText: "extractDocText",
    normalizeNote: "normalizeNote",
  });

for (const parserNode of PARSER_NODES) {
  builder.addEdge(parserNode, "correctCaption");
}

builder
  .addEdge("correctCaption", "detectContentType")
  .addEdge("detectContentType", "classifyIntent")
  .addEdge("classifyIntent", "generateAiInsights")
  .addEdge("generateAiInsights", "organizeCollection")
  .addEdge("organizeCollection", "semanticChunker")
  .addEdge("semanticChunker", "generateEmbeddings")
  .addEdge("generateEmbeddings", "upsertVectors")
  .addEdge("upsertVectors", END);

export const ingestionGraph = builder.compile();
