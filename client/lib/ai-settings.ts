import { apiFetch } from "@/lib/auth";

export type AiProvider = "openai" | "anthropic" | "groq" | "google" | "custom";
export type AiRole = "fast" | "reasoning" | "vision" | "embeddings";

export interface AiCredential {
  id: string;
  provider: AiProvider;
  label: string;
  baseUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiRoleAssignment {
  role: AiRole;
  credentialId: string;
  credentialLabel: string;
  provider: AiProvider;
  model: string;
  verifiedAt: string | null;
}

export interface TestConnectionResult {
  ok: boolean;
  error?: string;
  dimensions?: number;
}

export async function listCredentials(): Promise<AiCredential[]> {
  return apiFetch<AiCredential[]>("/ai-settings/credentials");
}

export async function createCredential(input: { provider: AiProvider; label: string; apiKey: string; baseUrl?: string }): Promise<AiCredential> {
  return apiFetch<AiCredential>("/ai-settings/credentials", { method: "POST", body: input });
}

export async function updateCredential(id: string, input: { label?: string; apiKey?: string; baseUrl?: string }): Promise<AiCredential> {
  return apiFetch<AiCredential>(`/ai-settings/credentials/${id}`, { method: "PATCH", body: input });
}

export async function deleteCredential(id: string): Promise<void> {
  await apiFetch(`/ai-settings/credentials/${id}`, { method: "DELETE" });
}

export async function listRoleAssignments(): Promise<AiRoleAssignment[]> {
  return apiFetch<AiRoleAssignment[]>("/ai-settings/roles");
}

export async function assignRole(role: AiRole, input: { credentialId: string; model: string }): Promise<AiRoleAssignment> {
  return apiFetch<AiRoleAssignment>(`/ai-settings/roles/${role}`, { method: "PUT", body: input });
}

export async function unassignRole(role: AiRole): Promise<void> {
  await apiFetch(`/ai-settings/roles/${role}`, { method: "DELETE" });
}

export async function testConnection(input: { provider: AiProvider; apiKey: string; baseUrl?: string; model: string; role: AiRole }): Promise<TestConnectionResult> {
  return apiFetch<TestConnectionResult>("/ai-settings/test", { method: "POST", body: input });
}

/** Which roles the platform covers without any configured key — right now just embeddings, when the server has EMBEDDINGS_API_KEY set. */
export async function getPlatformDefaults(): Promise<Record<AiRole, boolean>> {
  return apiFetch<Record<AiRole, boolean>>("/ai-settings/platform-defaults");
}

export const PROVIDER_LABEL: Record<AiProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  groq: "Groq",
  google: "Google Gemini",
  custom: "Custom (OpenAI-compatible)",
};

export const ROLE_LABEL: Record<AiRole, string> = {
  fast: "Fast",
  reasoning: "Reasoning",
  vision: "Vision",
  embeddings: "Embeddings",
};

export const ROLE_DESCRIPTION: Record<AiRole, string> = {
  fast: "Quick extraction, tagging, and classification — runs on every memory you save.",
  reasoning: "The Ask SaveForLatter chat assistant and anything needing real judgment.",
  vision: "Reading and describing images you save (OCR + visual description).",
  embeddings: "Powers semantic search and the Ask assistant's memory lookup. Must be exactly 1536-dimensional — see the note below.",
};

/**
 * Pure UI guidance, not enforced server-side (the server validates a real
 * model by calling it, not by name-matching a list) — a starting point so
 * picking a model isn't a blank-text-field guessing game. Kept here rather
 * than fetched from the server since it's just copy, not behavior.
 */
export const RECOMMENDED_MODELS: Record<AiProvider, Partial<Record<AiRole, string[]>>> = {
  openai: {
    fast: ["gpt-4o-mini", "gpt-5-nano"],
    reasoning: ["gpt-4o", "gpt-5-mini"],
    vision: ["gpt-4o", "gpt-4o-mini"],
    embeddings: ["text-embedding-3-small"],
  },
  anthropic: {
    fast: ["claude-3-5-haiku-20241022"],
    reasoning: ["claude-3-5-sonnet-20241022", "claude-sonnet-4-5"],
    vision: ["claude-3-5-sonnet-20241022"],
  },
  groq: {
    fast: ["llama-3.1-8b-instant", "openai/gpt-oss-120b"],
    reasoning: ["llama-3.3-70b-versatile"],
  },
  google: {
    fast: ["gemini-2.0-flash", "gemini-1.5-flash"],
    reasoning: ["gemini-1.5-pro", "gemini-2.0-flash"],
    vision: ["gemini-1.5-flash", "gemini-1.5-pro"],
    // Not listed: Gemini's embedding models default to 768 dimensions, not
    // the required 1536 — reachable only via a request param this simple
    // model-string setup can't express. Use OpenAI or a custom endpoint's
    // 1536-dim model for embeddings instead.
  },
  custom: {},
};

export const EMBEDDINGS_INCOMPATIBLE_PROVIDERS: AiProvider[] = ["groq", "anthropic"];
