// Background service worker for Memora Chrome Extension V1
import { ACCESS_TOKEN_COOKIE, SERVER_ORIGIN, TOKEN_STORAGE_KEY } from "../lib/config";
import { apiFetch, ApiError } from "../lib/api";

// Only the background worker holds the "cookies" permission — it mirrors the
// httpOnly access-token cookie into chrome.storage.local, which is what the
// popup and this file's own saveMemory() actually read (see api.ts). This
// replaces a prior, broken attempt in content-script.ts to read the cookie
// via page-context localStorage, which can never see an httpOnly cookie.
function syncAuthToken(done: () => void = () => {}): void {
  chrome.cookies.get({ url: SERVER_ORIGIN, name: ACCESS_TOKEN_COOKIE }, (cookie) => {
    chrome.storage.local.set({ [TOKEN_STORAGE_KEY]: cookie?.value ?? null }, done);
  });
}

chrome.cookies.onChanged.addListener((changeInfo) => {
  if (changeInfo.cookie.name === ACCESS_TOKEN_COOKIE) {
    syncAuthToken();
  }
});

// The popup asks for a fresh sync on open, in case the cookie was set (login)
// or cleared (logout) since the last onChanged event, e.g. right after the
// extension itself was installed. Must return true + call sendResponse
// asynchronously (inside the cookies.get callback), or the message channel
// closes before the storage write actually lands.
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "SYNC_AUTH") {
    syncAuthToken(() => sendResponse({ ok: true }));
    return true;
  }
  return undefined;
});

chrome.runtime.onStartup.addListener(syncAuthToken);

chrome.runtime.onInstalled.addListener(() => {
  syncAuthToken();

  // Create Context Menus
  chrome.contextMenus.create({
    id: "save-page",
    title: "Save this page to Memora",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "save-selection",
    title: "Save selected text to Memora",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "save-image",
    title: "Save image to Memora",
    contexts: ["image"]
  });
  
  console.log("Memora Extension context menus initialized.");
});

// Reads the real session token synced into storage by the popup/content script,
// instead of ever hardcoding it — background saves must use the same auth as the rest of the extension.
function getStoredToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get([TOKEN_STORAGE_KEY], (result) => {
      resolve(result[TOKEN_STORAGE_KEY] || null);
    });
  });
}

// Context Menus Click Handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const token = await getStoredToken();
  if (!token) {
    notifySignInRequired();
    return;
  }

  try {
    if (info.menuItemId === "save-page" && tab?.url) {
      await createMemory({ type: "web", url: tab.url, title: tab.title || "Saved Page" });
    } else if (info.menuItemId === "save-selection" && info.selectionText && tab?.url) {
      await createMemory({
        type: "note",
        url: tab.url,
        title: `Quote from ${tab.title || "Webpage"}`,
        content: info.selectionText,
      });
    } else if (info.menuItemId === "save-image" && info.srcUrl && tab?.url) {
      await createMemory({
        type: "image",
        url: tab.url,
        title: `Saved image from ${tab.title || "Webpage"}`,
        attachments: [{ fileUrl: info.srcUrl }],
      });
    }
  } catch (err) {
    notifySaveError(err);
  }
});

// Keyboard Commands listener
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "quick-save-page") return;

  const token = await getStoredToken();
  if (!token) {
    notifySignInRequired();
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab?.url) return;
    try {
      await createMemory({ type: "web", url: activeTab.url, title: activeTab.title || "Quick Saved Page" });
    } catch (err) {
      notifySaveError(err);
    }
  });
});

// --- Screenshot capture --------------------------------------------------
//
// The popup's "Take Screenshot" button asks this file to start a region
// selection on the active tab (content-script.ts owns the drag-to-select
// overlay, since it needs the page's DOM); once the user finishes
// dragging, the content script sends back the picked rect plus whatever
// text it read out of that region, and this file does the actual pixel
// capture (chrome.tabs.captureVisibleTab isn't available to content
// scripts), crops it to just the selected area, uploads it, and creates
// the memory — same real save path as everything else in this file.

interface ScreenshotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Pages content scripts can never run on, regardless of manifest
// permissions — captureVisibleTab and tabs.sendMessage both fail here.
// file:// is deliberately excluded: it CAN work, but only if the user has
// flipped "Allow access to file URLs" for this extension, which we can't
// detect in advance — better to let that one fail with the real error.
const RESTRICTED_URL_PREFIXES = [
  "chrome://",
  "chrome-extension://",
  "edge://",
  "about:",
  "devtools://",
  "view-source:",
  "https://chrome.google.com/webstore",
  "https://chromewebstore.google.com",
];

function isRestrictedPage(url: string | undefined): boolean {
  return !url || RESTRICTED_URL_PREFIXES.some((prefix) => url.startsWith(prefix));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_SCREENSHOT_SELECTION") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id || isRestrictedPage(tab.url)) {
        notifyCannotCapture();
        sendResponse({ ok: false });
        return;
      }
      // No callback here previously meant a failure (most commonly: this
      // tab was open before the extension was installed/reloaded, so it
      // never got the content script) failed completely silently — the
      // button would just do nothing with no indication why. Checking
      // chrome.runtime.lastError is what surfaces that as a real message.
      chrome.tabs.sendMessage(
        tab.id,
        {
          action: "START_SELECTION",
          note: request.note,
          tags: request.tags,
          collectionIds: request.collectionIds,
        },
        () => {
          if (chrome.runtime.lastError) {
            notifyCannotCapture();
          }
          sendResponse({ ok: true });
        },
      );
    });
    return true;
  }

  if (request.action === "SCREENSHOT_REGION_SELECTED" && sender.tab?.windowId != null) {
    // Holding the message channel open (return true + an eventual
    // sendResponse) isn't just etiquette — it's what stops Chrome from
    // suspending this service worker mid-upload. Without it, nothing told
    // the browser this multi-second chain (tab capture -> crop -> upload
    // -> create memory) was still working, so a suspend here could
    // silently kill a screenshot save partway through, and/or leave the
    // worker in a state where the next message (e.g. the popup's own
    // SYNC_AUTH on open) is slow to get a response.
    handleScreenshotRegion(request, sender.tab.windowId)
      .catch(notifySaveError)
      .finally(() => sendResponse({ ok: true }));
    return true;
  }

  return undefined;
});

function notifyCannotCapture(): void {
  chrome.notifications?.create({
    type: "basic",
    iconUrl: "src/popup/icon-128.png",
    title: "Can't capture this page",
    message:
      "This page doesn't support screenshot capture — that's usually a browser system page (chrome://, the Web Store, PDF viewer), or a tab that was already open before Memora was installed or updated. Reloading the tab fixes the latter.",
    priority: 1,
  });
}

async function handleScreenshotRegion(
  msg: {
    rect: ScreenshotRect;
    dpr: number;
    extractedText: string;
    pageTitle: string;
    pageUrl: string;
    note?: string;
    tags?: string[];
    collectionIds?: string[];
  },
  windowId: number,
): Promise<void> {
  const token = await getStoredToken();
  if (!token) {
    notifySignInRequired();
    return;
  }

  const dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: "png" });
  const blob = await cropToRect(dataUrl, msg.rect, msg.dpr);
  const uploaded = await uploadScreenshot(blob);

  // The user's own note (if any) leads, with the region's extracted DOM
  // text right behind it as grounding for the AI ingestion pipeline.
  const content = [msg.note?.trim(), msg.extractedText].filter(Boolean).join("\n\n");

  await createMemory({
    type: "image",
    url: msg.pageUrl,
    title: (msg.pageTitle || "Screenshot").slice(0, 500),
    content: content || undefined,
    tags: msg.tags && msg.tags.length > 0 ? msg.tags : undefined,
    collectionIds: msg.collectionIds && msg.collectionIds.length > 0 ? msg.collectionIds : undefined,
    attachments: [{ fileUrl: uploaded.fileUrl, fileSize: uploaded.fileSize, mimeType: uploaded.mimeType }],
  });
}

/** Crops the full-viewport capture down to just the selected rect. `dpr` converts the content script's CSS-pixel rect into the device pixels captureVisibleTab actually returns. Service workers have no <canvas>/<img> DOM elements, hence OffscreenCanvas + createImageBitmap. */
async function cropToRect(dataUrl: string, rect: ScreenshotRect, dpr: number): Promise<Blob> {
  const bitmap = await createImageBitmap(await (await fetch(dataUrl)).blob());

  const sx = Math.max(0, Math.round(rect.x * dpr));
  const sy = Math.max(0, Math.round(rect.y * dpr));
  const sw = Math.min(Math.round(rect.width * dpr), bitmap.width - sx);
  const sh = Math.min(Math.round(rect.height * dpr), bitmap.height - sy);

  const canvas = new OffscreenCanvas(sw, sh);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't render the screenshot crop.");
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, sw, sh);

  return canvas.convertToBlob({ type: "image/png" });
}

async function uploadScreenshot(blob: Blob): Promise<{ fileUrl: string; mimeType: string; fileSize: number }> {
  const presigned = await apiFetch<{ uploadUrl: string; fileUrl: string; key: string }>("/uploads/presign", {
    method: "POST",
    body: JSON.stringify({ filename: `screenshot-${Date.now()}.png`, mimeType: "image/png", fileSize: blob.size }),
  });

  const putResponse = await fetch(presigned.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: blob,
  });
  if (!putResponse.ok) throw new Error("Uploading the screenshot to storage failed.");

  return { fileUrl: presigned.fileUrl, mimeType: "image/png", fileSize: blob.size };
}

// --- Shared save path ------------------------------------------------------

interface MemoryCreatePayload {
  type: "web" | "note" | "image";
  url?: string;
  title: string;
  content?: string;
  tags?: string[];
  collectionIds?: string[];
  attachments?: { fileUrl: string; fileSize?: number; mimeType?: string }[];
}

async function createMemory(payload: MemoryCreatePayload): Promise<void> {
  const memory = await apiFetch<{ id: string; title: string }>("/memories", {
    method: "POST",
    body: JSON.stringify({ ...payload, captureMethod: "extension" }),
  });

  chrome.notifications?.create(
    {
      type: "basic",
      iconUrl: "src/popup/icon-128.png",
      title: "Saved to Memora",
      message: memory.title || payload.title,
      priority: 1,
    },
    () => {
      if (chrome.runtime.lastError) {
        console.log("Notifications API not fully loaded, skipping alert window.");
      }
    },
  );
}

function notifySignInRequired(): void {
  chrome.notifications?.create({
    type: "basic",
    iconUrl: "src/popup/icon-128.png",
    title: "Sign in to Memora",
    message: "Open the Memora extension popup and sign in before saving.",
    priority: 1,
  });
}

function notifySaveError(err: unknown): void {
  console.error("Memora save failed:", err);
  const message = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Something went wrong.";
  chrome.notifications?.create({
    type: "basic",
    iconUrl: "src/popup/icon-128.png",
    title: "Couldn't save to Memora",
    message,
    priority: 1,
  });
}
