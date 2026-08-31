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

  if (request.action === "START_SELECTION") {
    startRegionSelection();
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
// gets out of the way. Ignored entirely if a selection is already active,
// so re-triggering the shortcut/button mid-drag is a no-op, not a second
// overlay stacked on top.

let selectionActive = false;

function startRegionSelection(): void {
  if (selectionActive) return;
  selectionActive = true;

  const overlay = document.createElement("div");
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
    selectionActive = false;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") cleanup();
  };

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

  overlay.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;

    const rect = {
      x: Math.min(startX, e.clientX),
      y: Math.min(startY, e.clientY),
      width: Math.abs(e.clientX - startX),
      height: Math.abs(e.clientY - startY),
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
    });
  });

  document.addEventListener("keydown", onKeyDown, true);

  function updateBox(x1: number, y1: number, x2: number, y2: number) {
    box.style.left = `${Math.min(x1, x2)}px`;
    box.style.top = `${Math.min(y1, y2)}px`;
    box.style.width = `${Math.abs(x2 - x1)}px`;
    box.style.height = `${Math.abs(y2 - y1)}px`;
  }
}

const MAX_EXTRACTED_TEXT_LENGTH = 5000;

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
