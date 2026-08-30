// Dev-only, hardcoded (the extension has no build-time env wiring yet,
// unlike client/server's .env-based config) — matches the server's
// documented default (server/.env.example: PORT=4000, FRONTEND_URL=3000).
export const SERVER_ORIGIN = "http://localhost:4000";
export const API_BASE = `${SERVER_ORIGIN}/api/v1`;
export const WEB_APP_URL = "http://localhost:3000";

// Must match server/src/shared/utils/cookies.ts's ACCESS_TOKEN_COOKIE.
export const ACCESS_TOKEN_COOKIE = "memora_access_token";

// chrome.storage.local key the background worker mirrors the cookie into —
// storage (not the cookie itself) is what the popup/content script read,
// since only the background service worker has the "cookies" permission.
export const TOKEN_STORAGE_KEY = "memora_token";
