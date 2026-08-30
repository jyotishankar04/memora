// Content script to scrape webpage metadata for Memora Capture extension.
// Auth token sync lives in background/service-worker.ts via chrome.cookies —
// the web app's auth cookie is httpOnly, so page-context JS (this file)
// can never read it directly; a prior version tried a localStorage read here
// and could never have worked.

// Fetch active page metadata
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
  return true;
});

function getMetaTag(nameOrProperty: string): string | null {
  const meta = document.querySelector(
    `meta[name="${nameOrProperty}"], meta[property="${nameOrProperty}"]`
  );
  return meta ? meta.getAttribute("content") : null;
}
