// Content script to scrape webpage metadata for Memora Capture extension.
// Auth token sync lives in background/service-worker.ts via chrome.cookies —
// the web app's auth cookie is httpOnly, so page-context JS (this file)
// can never read it directly; a prior version tried a localStorage read here
// and could never have worked.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_METADATA") {
    const description = getMetaTag("description") || getMetaTag("og:description") || "";
    const previewImage = getMetaTag("og:image") || "";
    const keywords = getMetaTag("keywords") || "";

    sendResponse({
      description,
      previewImage,
      keywords
    });
  }

  // START_SELECTION and CAPTURE_FULL_PAGE both kick off multi-second work
  // (a drag interaction, or the whole scroll-and-shoot loop) and report
  // their real result later via a completely separate message
  // (SCREENSHOT_REGION_SELECTED / FULL_PAGE_CAPTURED /
  // FULL_PAGE_CAPTURE_FAILED) — they must acknowledge THIS message right
  // away rather than leaving its channel open for all of that. Chrome
  // eventually times out a channel nothing ever responds on and reports it
  // to the sender as chrome.runtime.lastError, which dispatchCaptureToActiveTab
  // (service-worker.ts) was reading as "capture failed" — even after the
  // real capture had already succeeded independently. That's what caused
  // "Can't capture this page" to fire alongside an actually-successful save.
  if (request.action === "START_SELECTION") {
    startRegionSelection({ note: request.note, tags: request.tags, collectionIds: request.collectionIds });
    sendResponse({ received: true });
  }

  if (request.action === "CAPTURE_FULL_PAGE") {
    // Belt-and-suspenders on top of captureFullPage's own try/catch — an
    // async function called without awaiting or catching turns any escaped
    // exception into an invisible unhandled rejection, so this makes sure
    // nothing from here can fail completely silently.
    captureFullPage({ note: request.note, tags: request.tags, collectionIds: request.collectionIds }).catch((err) => {
      console.error("Memora: captureFullPage rejected", err);
      chrome.runtime.sendMessage({
        action: "FULL_PAGE_CAPTURE_FAILED",
        message: err instanceof Error ? err.message : "Full page capture failed.",
      });
    });
    sendResponse({ received: true });
  }

  return true;
});

function getMetaTag(nameOrProperty: string): string | null {
  const meta = document.querySelector(
    `meta[name="${nameOrProperty}"], meta[property="${nameOrProperty}"]`
  );
  return meta ? meta.getAttribute("content") : null;
}

// --- Screenshot region selection ---------------------------------------
//
// Drag-to-select overlay (like the OS-level "capture area" tools). This
// file only figures out WHAT region was picked and WHAT text lives inside
// it — the actual pixel capture has to happen in the background service
// worker (chrome.tabs.captureVisibleTab isn't available to content
// scripts), so on mouseup this just hands the rect off via a message and
// gets out of the way.

const OVERLAY_ID = "memora-screenshot-selection-overlay";
const MAX_EXTRACTED_TEXT_LENGTH = 5000;

interface SelectionMeta {
  note?: string;
  tags?: string[];
  collectionIds?: string[];
}

function startRegionSelection(meta: SelectionMeta): void {
  // Self-heals from a selection that didn't clean up properly (see the
  // window-level mouseup/blur listeners below for why that could happen) —
  // checking the DOM directly instead of a separate boolean flag means
  // there's nothing that can drift out of sync with reality and silently
  // block every future screenshot attempt on this page until it's reloaded.
  document.getElementById(OVERLAY_ID)?.remove();

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:2147483647;cursor:crosshair;background:rgba(15,17,21,0.25);";

  const box = document.createElement("div");
  box.style.cssText =
    "position:fixed;border:1.5px solid #1447E6;background:rgba(20,71,230,0.15);display:none;pointer-events:none;";
  overlay.appendChild(box);

  const hint = document.createElement("div");
  hint.textContent = "Drag to select an area · Esc to cancel";
  hint.style.cssText =
    "position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#1c1c1e;color:#fff;" +
    "font:12px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;padding:6px 12px;border-radius:8px;pointer-events:none;";
  overlay.appendChild(hint);

  document.documentElement.appendChild(overlay);

  let startX = 0;
  let startY = 0;
  let dragging = false;

  const cleanup = () => {
    overlay.remove();
    document.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("mouseup", onWindowMouseUp, true);
    window.removeEventListener("blur", cleanup);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") cleanup();
  };

  const finalize = (endX: number, endY: number) => {
    if (!dragging) return;
    dragging = false;

    const rect = {
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };

    cleanup();

    // A click rather than a drag — nothing meaningful was selected.
    if (rect.width < 10 || rect.height < 10) return;

    chrome.runtime.sendMessage({
      action: "SCREENSHOT_REGION_SELECTED",
      rect,
      dpr: window.devicePixelRatio || 1,
      extractedText: extractTextInRect(rect),
      pageTitle: document.title,
      pageUrl: location.href,
      note: meta.note,
      tags: meta.tags,
      collectionIds: meta.collectionIds,
    });
  };

  // The overlay's own mouseup handles the normal case. This window-level
  // one (capture phase, so it runs first and is never blocked by a page
  // script stopping propagation) is what actually fixes the "sometimes
  // just doesn't work" bug: dragging past the edge of the viewport and
  // releasing the mouse there never fires mouseup ON the overlay at all,
  // which used to leave it (and every future screenshot attempt) stuck
  // until the page was reloaded. finalize()'s `dragging` guard makes it
  // safe to also fire from the overlay's own listener for a normal
  // in-viewport release — the second call is just a no-op.
  const onWindowMouseUp = (e: MouseEvent) => finalize(e.clientX, e.clientY);

  overlay.addEventListener("mousedown", (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    box.style.display = "block";
    updateBox(startX, startY, startX, startY);
  });

  overlay.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    updateBox(startX, startY, e.clientX, e.clientY);
  });

  overlay.addEventListener("mouseup", (e) => finalize(e.clientX, e.clientY));

  document.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("mouseup", onWindowMouseUp, true);
  // Alt-tabbing or clicking into another app mid-drag: cancel cleanly
  // rather than leaving the overlay stranded on top of the page.
  window.addEventListener("blur", cleanup);

  function updateBox(x1: number, y1: number, x2: number, y2: number) {
    box.style.left = `${Math.min(x1, x2)}px`;
    box.style.top = `${Math.min(y1, y2)}px`;
    box.style.width = `${Math.abs(x2 - x1)}px`;
    box.style.height = `${Math.abs(y2 - y1)}px`;
  }
}

// --- Full-page screenshot ------------------------------------------------
//
// chrome.tabs.captureVisibleTab only ever sees what's currently on screen,
// so a genuinely full-page shot means scrolling through the page in
// viewport-height steps, asking the background worker to capture each
// step (only it can call captureVisibleTab), and stitching the results
// into one tall image there. This file drives the scroll loop (only it
// can); the background worker does the pixel work and the final save.

const FULL_PAGE_STATUS_ID = "memora-fullpage-status";
// captureVisibleTab is rate-limited (Chrome throttles rapid calls), and
// this delay also gives the page a moment to repaint/settle after each
// scroll (lazy-loaded images, sticky headers re-positioning, etc.) before
// it's captured — too short and shots come out mid-scroll or half-loaded.
const FULL_PAGE_STEP_DELAY_MS = 400;
// Bounds how many shots a very tall (or infinite-scroll) page gets stitched
// from — 15 steps covers most real pages; beyond that we stop rather than
// hammering captureVisibleTab dozens of times for one capture.
const MAX_FULL_PAGE_SHOTS = 15;

function showFullPageStatus(text: string): void {
  let el = document.getElementById(FULL_PAGE_STATUS_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = FULL_PAGE_STATUS_ID;
    el.style.cssText =
      "position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#1c1c1e;" +
      "color:#fff;font:12px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;padding:6px 12px;border-radius:8px;pointer-events:none;";
    document.documentElement.appendChild(el);
  }
  el.textContent = text;
}

function removeFullPageStatus(): void {
  document.getElementById(FULL_PAGE_STATUS_ID)?.remove();
}

async function captureFullPage(meta: SelectionMeta): Promise<void> {
  // Visible the instant this starts, before any computation below runs —
  // if something after this throws, at least this much proves the click
  // was received and the capture actually started, rather than the whole
  // thing failing invisibly with nothing on screen to show for it.
  showFullPageStatus("Capturing full page…");

  const originalScrollX = window.scrollX;
  const originalScrollY = window.scrollY;

  try {
    const dpr = window.devicePixelRatio || 1;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
    );
    const stepCount = Math.min(MAX_FULL_PAGE_SHOTS, Math.max(1, Math.ceil(pageHeight / viewportHeight)));

    const shots: { dataUrl: string; y: number }[] = [];

    for (let i = 0; i < stepCount; i++) {
      showFullPageStatus(stepCount > 1 ? `Capturing full page… (${i + 1}/${stepCount})` : "Capturing full page…");

      // Clamped so the final step aligns to the true bottom of the page
      // instead of overshooting past it.
      const targetY = Math.min(i * viewportHeight, Math.max(0, pageHeight - viewportHeight));
      window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, FULL_PAGE_STEP_DELAY_MS));

      const response = await chrome.runtime.sendMessage({ action: "CAPTURE_VIEWPORT_FRAME" });
      if (!response?.dataUrl) {
        throw new Error(response?.error || "Capturing a section of the page failed.");
      }
      shots.push({ dataUrl: response.dataUrl, y: window.scrollY });
    }

    chrome.runtime.sendMessage({
      action: "FULL_PAGE_CAPTURED",
      shots,
      dpr,
      viewportWidth,
      viewportHeight,
      totalHeight: shots[shots.length - 1].y + viewportHeight,
      extractedText: extractFullPageText(),
      pageTitle: document.title,
      pageUrl: location.href,
      note: meta.note,
      tags: meta.tags,
      collectionIds: meta.collectionIds,
    });
  } catch (err) {
    // Everything above is now inside this try — including the page-height
    // computation that used to run before it, unprotected. A throw there
    // used to become a silent unhandled promise rejection (visible only in
    // the page's own DevTools console, never as a toast or notification),
    // which is exactly the "nothing happens at all" failure mode this is
    // fixing: any failure from here on is now guaranteed to reach the
    // background worker and surface as a real notification.
    console.error("Memora: full page capture failed", err);
    chrome.runtime.sendMessage({
      action: "FULL_PAGE_CAPTURE_FAILED",
      message: err instanceof Error ? err.message : "Full page capture failed.",
    });
  } finally {
    removeFullPageStatus();
    window.scrollTo({ top: originalScrollY, left: originalScrollX, behavior: "instant" });
  }
}

/** The whole page's rendered text, not just what's on screen right now — extractTextInRect (below) is viewport-relative and can't answer "what does the whole page say" since getClientRects() is meaningless for scrolled-away content. */
function extractFullPageText(): string {
  return (document.body.innerText || "").replace(/\s+/g, " ").trim().slice(0, MAX_EXTRACTED_TEXT_LENGTH);
}

/** Collects the rendered text of every text node whose on-screen position intersects `rect` — the same "what's actually visible here" signal a human eye would read off the selected area, not a DOM-structural guess. */
function extractTextInRect(rect: { x: number; y: number; width: number; height: number }): string {
  const bounds = { left: rect.x, top: rect.y, right: rect.x + rect.width, bottom: rect.y + rect.height };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const style = getComputedStyle(parent);
      if (style.visibility === "hidden" || style.display === "none") return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const range = document.createRange();
  const pieces: string[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    range.selectNodeContents(node);
    const rects = range.getClientRects();
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (r.right >= bounds.left && r.left <= bounds.right && r.bottom >= bounds.top && r.top <= bounds.bottom) {
        pieces.push(node.nodeValue!.trim());
        break;
      }
    }
    if (pieces.join(" ").length > MAX_EXTRACTED_TEXT_LENGTH) break;
  }

  return pieces.join(" ").replace(/\s+/g, " ").trim().slice(0, MAX_EXTRACTED_TEXT_LENGTH);
}
