// Content script to scrape webpage metadata details and sync auth tokens for Memora Capture extension

// 1. Sync auth token if browsing the Memora web app dashboard
if (window.location.hostname === "localhost" || window.location.hostname.includes("memora.io")) {
  // Read token from web client's local storage
  const webToken = localStorage.getItem("memora_token") || localStorage.getItem("token");
  if (webToken) {
    chrome.storage.local.set({ memora_token: webToken }, () => {
      console.log("Memora authentication token synced to extension storage.");
    });
  }
}

// 2. Fetch active page metadata
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
