import type { MemoryType } from "@/types/memory";

const VIDEO_HOSTS = ["youtube.com", "youtu.be", "vimeo.com", "tiktok.com", "twitch.tv"];

export function parseUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  try {
    return new URL(trimmed);
  } catch {
    return null;
  }
}

export interface DetectMemoryTypeInput {
  text: string;
  attachmentMimeType?: string | null;
}

/**
 * Guesses the memory type from whatever the user pasted/typed/dropped into
 * the single capture surface. Rule-based for now (attachment mime > URL >
 * plain-text note) — kept as one pure function of {text, attachmentMimeType}
 * so it can be swapped for a real AI classifier call later without touching
 * the capture UI around it.
 */
export function detectMemoryType({ text, attachmentMimeType }: DetectMemoryTypeInput): MemoryType {
  if (attachmentMimeType) {
    return attachmentMimeType.startsWith("image/") ? "image" : "document";
  }

  const trimmed = text.trim();
  if (!trimmed) return "note";

  const url = parseUrl(trimmed);
  if (url) {
    return VIDEO_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)) ? "video" : "web";
  }

  return "note";
}

/** Best-effort title when the user hasn't typed one — always non-empty. */
export function deriveTitle(type: MemoryType, text: string, attachmentName?: string | null): string {
  if (attachmentName) {
    const withoutExtension = attachmentName.replace(/\.[^/.]+$/, "");
    return withoutExtension || attachmentName;
  }

  const trimmed = text.trim();
  if (!trimmed) return "Untitled";

  if (type === "web" || type === "video") {
    const url = parseUrl(trimmed);
    return url ? url.hostname.replace(/^www\./, "") : trimmed.slice(0, 60);
  }

  return trimmed.split("\n")[0].slice(0, 60) || "Untitled note";
}
