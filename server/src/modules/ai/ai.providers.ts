import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseMessage } from "@langchain/core/messages";
import { env } from "../../config/env";
import { logger } from "../../shared/utils/logger";

// gpt-5-nano rejects any non-default temperature ("Unsupported value:
// 'temperature' does not support 0.2 with this model. Only the default (1)
// value is supported.", verified directly against the API) — omit the
// param entirely for it rather than passing 1 explicitly, in case that
// constraint tightens further later.
function getOpenAiFallbackModel(): ChatOpenAI {
  return new ChatOpenAI({ apiKey: env.OPENAI_API_KEY, model: "gpt-5-nano" });
}

// Fast tier: extraction/tagging/classification (doc's "GPT-4o-mini-class") —
// every currently-active ingestion node uses this tier for its small,
// normal-question-shaped calls (fill in this field, classify this into one
// of N buckets, write a 2-3 sentence summary). Groq's gpt-oss-120b — cheap
// and fast on Groq's hardware regardless of the "120b" size.
// Reasoning tier: summaries and anything needing real judgment (doc's
// "Claude/GPT-4-class") — OpenAI's gpt-5-nano (same client as
// getOpenAiFallbackModel above). Not called anywhere in the ingestion graph
// yet, reserved for a future user-facing "Ask Memora" synthesis step.
// Every ingestion node calls getChatModel(tier) instead of constructing a
// client directly, so swapping either tier's provider/model later is a
// change in this one file only.
// Groq's lineup shifted away from the Llama 3.x models — verified against
// GET https://api.groq.com/openai/v1/models for this account's current catalog.
const FAST_MODEL = "openai/gpt-oss-120b";

export function getChatModel(tier: "fast" | "reasoning"): BaseChatModel {
  if (tier === "reasoning") return getOpenAiFallbackModel();
  return new ChatGroq({ apiKey: env.GROQ_API_KEY, model: FAST_MODEL, temperature: 0.2 });
}

export function getEmbeddings(): OpenAIEmbeddings {
  return new OpenAIEmbeddings({ apiKey: env.OPENAI_API_KEY, model: "text-embedding-3-small" });
}

// Vision (image OCR/description) and the large-PDF page-1 summarizer both
// need a model that might genuinely fail (rate limit, a provider outage)
// without that ever failing the memory itself — invokeWithFallback tries
// each model in order and only gives up (empty string) once every one of
// them has failed.
//
// Vision-model note: this account's Groq catalog (checked against GET
// https://api.groq.com/openai/v1/models) currently has no vision-capable
// model at all — no Llama 4 Scout/Maverick, nothing multimodal, just the
// text-only gpt-oss tier, whisper, and a couple TTS/guard models. So this
// is a single-model list today; add a Groq entry ahead of gpt-5-nano here
// the day that catalog gains a real vision model (cheaper/faster than
// staying on OpenAI for every image). gpt-5-nano's vision support was
// verified directly against the Chat Completions API (image_url input).
export function getVisionModels(): BaseChatModel[] {
  return [getOpenAiFallbackModel()];
}

// Two different providers (not two Groq instances) so a Groq outage doesn't
// take down both the primary and the fallback attempt.
export function getTextFallbackModels(): BaseChatModel[] {
  return [getChatModel("fast"), getOpenAiFallbackModel()];
}

export async function invokeWithFallback(models: BaseChatModel[], messages: BaseMessage[], timeoutMs = 20000): Promise<string> {
  for (const model of models) {
    try {
      const response = await model.invoke(messages, { timeout: timeoutMs });
      const content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
      return content;
    } catch (err) {
      logger.warn({ err, model: model.constructor.name }, "invokeWithFallback: model attempt failed, trying next");
    }
  }
  logger.error("invokeWithFallback: every model in the fallback list failed");
  return "";
}
