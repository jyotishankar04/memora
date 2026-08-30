import { logNode } from "../log";
import type { IngestionStateType } from "../state";

const ROUTES: Record<string, string> = {
  web: "parseWebContent",
  voice: "transcribeAudio",
  image: "processImageVision",
  document: "extractDocText",
  note: "normalizeNote",
  video: "normalizeNote",
};

export function routeMediaType(state: IngestionStateType): string {
  const route = ROUTES[state.mediaType] ?? "normalizeNote";
  logNode(state.memoryId, "routeMediaType", { mediaType: state.mediaType, route });
  return route;
}
