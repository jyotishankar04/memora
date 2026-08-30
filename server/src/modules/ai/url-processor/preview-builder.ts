import type { BrowserCapturePayload, PlatformInfo, PreviewFields, PreviewSource, PreviewStatus } from "./types";

export interface BuiltPreview extends PreviewFields {
  previewStatus: PreviewStatus;
  previewSource: PreviewSource;
}

function firstNonEmpty(...values: (string | null | undefined)[]): string | null {
  for (const value of values) {
    if (value && value.trim()) return value.trim();
  }
  return null;
}

/**
 * Single merge-and-decide step: priority is browser capture > server-
 * extracted metadata (itself already og:* > twitter:* > plain HTML, from
 * MetadataExtractor) for every field, then falls through platform-branded
 * artwork and finally a generic "just the domain" card — the real image
 * REAL IMAGE -> BROWSER IMAGE -> PLATFORM FALLBACK -> GENERIC FALLBACK
 * hierarchy the UI renders. Never lets a lower-quality source overwrite a
 * higher-quality one that's already present.
 *
 * `previewSource` here specifically tracks where the *image* came from —
 * that's the field the fallback hierarchy is really about. "user" is not
 * assigned by this pipeline today (reserved for a future manually-edited
 * preview); it exists in the type for that reason.
 */
export function buildPreview(
  server: PreviewFields,
  browser: BrowserCapturePayload | null,
  platform: PlatformInfo,
): BuiltPreview {
  const merged: PreviewFields = {
    title: firstNonEmpty(browser?.title, server.title),
    description: firstNonEmpty(browser?.description, server.description),
    imageUrl: firstNonEmpty(browser?.imageUrl, server.imageUrl),
    canonicalUrl: firstNonEmpty(browser?.canonicalUrl, server.canonicalUrl),
    faviconUrl: firstNonEmpty(browser?.faviconUrl, server.faviconUrl),
  };

  if (merged.imageUrl) {
    const fromBrowser = !!browser?.imageUrl?.trim() && merged.imageUrl === browser.imageUrl.trim();
    return { ...merged, previewStatus: "available", previewSource: fromBrowser ? "browser" : "server" };
  }

  if (platform.platform) {
    return { ...merged, previewStatus: "partial", previewSource: "platform_fallback" };
  }

  const hasAnyMetadata = !!(merged.title || merged.description);
  return { ...merged, previewStatus: hasAnyMetadata ? "partial" : "unavailable", previewSource: "generic_fallback" };
}
