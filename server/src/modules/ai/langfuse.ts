import { CallbackHandler } from "langfuse-langchain";
import { env } from "../../config/env";

/** One trace per ingestion run, grouping every node's LLM call under it. `null` when Langfuse isn't configured — tracing is optional, never required for ingestion to work. */
export function getLangfuseHandler(memoryId: string): CallbackHandler | null {
  if (!env.LANGFUSE_PUBLIC_KEY || !env.LANGFUSE_SECRET_KEY) return null;

  return new CallbackHandler({
    publicKey: env.LANGFUSE_PUBLIC_KEY,
    secretKey: env.LANGFUSE_SECRET_KEY,
    baseUrl: env.LANGFUSE_BASE_URL,
    sessionId: memoryId,
    tags: ["ingestion"],
  });
}
