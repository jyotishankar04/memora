const VIDEO_HOSTS = ["youtube.com", "youtu.be", "vimeo.com", "tiktok.com", "twitch.tv"];
const URL_PATTERN = /https?:\/\/\S+/i;

/**
 * Deterministic backstop for the client's own detectMemoryType/extractUrl
 * (client/lib/detect-memory-type.ts) — regex-based, not LLM-based, so it's
 * cheap and reliable for something that doesn't need judgment. Finds the
 * first URL anywhere in a block of text, mirroring the client's logic
 * exactly so a "note" that actually contains a link gets reclassified the
 * same way it would have been if the client had caught it.
 */
export function extractUrl(text: string): URL | null {
  const match = text.match(URL_PATTERN);
  if (!match) return null;
  const raw = match[0].replace(/[)\].,!?;:'"]+$/, "");
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

export function isVideoUrl(url: URL): boolean {
  return VIDEO_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
}
