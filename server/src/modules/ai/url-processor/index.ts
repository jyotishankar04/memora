export { detectPlatform, getPlatformCredential, KNOWN_PLATFORMS } from "./platform-detector";
export { fetchUrl } from "./server-fetcher";
export { extractServerMetadata, defaultFaviconUrl } from "./metadata-extractor";
export { buildPreview, type BuiltPreview } from "./preview-builder";
export type {
  BrowserCapturePayload,
  FetchStatus,
  PlatformInfo,
  PreviewFields,
  PreviewSource,
  PreviewStatus,
  UrlFetchResult,
} from "./types";
