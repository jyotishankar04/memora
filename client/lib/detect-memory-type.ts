import type { MemoryType } from "@/types/memory";

const VIDEO_HOSTS = ["youtube.com", "youtu.be", "vimeo.com", "tiktok.com", "twitch.tv"];
const URL_PATTERN = /https?:\/\/\S+/i;

export function parseUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  try {
    return new URL(trimmed);
  } catch {
    return null;
  }
}

/**
 * Finds the first http(s) URL anywhere in a block of text — unlike parseUrl,
 * the whole string doesn't have to be a URL. Lets "check this out
 * https://example.com, thoughts?" still be recognized as a link.
 */
export function extractUrl(text: string): URL | null {
  const match = text.match(URL_PATTERN);
  if (!match) return null;
  // Trailing punctuation ("...link." or "(link)") shouldn't be swallowed into the URL.
  const raw = match[0].replace(/[)\].,!?;:'"]+$/, "");
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

/** Splits "a link plus some commentary" into the link and whatever text is left over. */
export function splitLinkAndCaption(text: string): { url: URL | null; caption: string } {
  const trimmed = text.trim();
  const url = extractUrl(trimmed);
  if (!url) return { url: null, caption: trimmed };

  const index = trimmed.indexOf(url.href) >= 0 ? trimmed.indexOf(url.href) : trimmed.search(URL_PATTERN);
  const rawMatch = trimmed.match(URL_PATTERN)?.[0] ?? url.href;
  const caption = (trimmed.slice(0, index) + trimmed.slice(index + rawMatch.length)).trim();
  return { url, caption };
}

export interface DetectMemoryTypeInput {
  text: string;
  attachmentMimeType?: string | null;
}

/**
 * Guesses the memory type from whatever the user pasted/typed/dropped into
 * the single capture surface. Rule-based for now (attachment mime > URL
 * anywhere in the text > plain-text note) — kept as one pure function of
 * {text, attachmentMimeType} so it can be swapped for a real AI classifier
 * call later without touching the capture UI around it.
 */
export function detectMemoryType({ text, attachmentMimeType }: DetectMemoryTypeInput): MemoryType {
  if (attachmentMimeType) {
    return attachmentMimeType.startsWith("image/") ? "image" : "document";
  }

  const trimmed = text.trim();
  if (!trimmed) return "note";

  const url = extractUrl(trimmed);
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
    const url = extractUrl(trimmed);
    return url ? url.hostname.replace(/^www\./, "") : trimmed.slice(0, 60);
  }

  return trimmed.split("\n")[0].slice(0, 60) || "Untitled note";
}
