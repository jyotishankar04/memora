// Background service worker for Memora Chrome Extension V1
import { ACCESS_TOKEN_COOKIE, SERVER_ORIGIN, TOKEN_STORAGE_KEY } from "../lib/config";

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
    chrome.notifications?.create({
      type: "basic",
      iconUrl: "src/popup/icon-128.png",
      title: "Sign in to Memora",
      message: "Open the Memora extension popup and sign in before saving.",
      priority: 1
    });
    return;
  }

  if (info.menuItemId === "save-page" && tab?.url) {
    saveMemory({
      type: "link",
      url: tab.url,
      title: tab.title || "Saved Page",
      source: "context_menu_page"
    }, token);
  }

  else if (info.menuItemId === "save-selection" && info.selectionText && tab?.url) {
    saveMemory({
      type: "note",
      url: tab.url,
      title: `Quote from ${tab.title || "Webpage"}`,
      content: info.selectionText,
      source: "context_menu_selection"
    }, token);
  }

  else if (info.menuItemId === "save-image" && info.srcUrl && tab?.url) {
    saveMemory({
      type: "image",
      url: tab.url,
      imageUrl: info.srcUrl,
      title: `Saved image from ${tab.title || "Webpage"}`,
      source: "context_menu_image"
    }, token);
  }
});

// Keyboard Commands listener
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "quick-save-page") {
    const token = await getStoredToken();
    if (!token) {
      chrome.notifications?.create({
        type: "basic",
        iconUrl: "src/popup/icon-128.png",
        title: "Sign in to Memora",
        message: "Open the Memora extension popup and sign in before saving.",
        priority: 1
      });
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url) {
        saveMemory({
          type: "link",
          url: activeTab.url,
          title: activeTab.title || "Quick Saved Page",
          source: "keyboard_shortcut"
        }, token);
      }
    });
  }
});

// Core API Save function
function saveMemory(payload: any, token: string) {
  console.log("Initiating background save to Memora:", payload);
  
  // Simulated POST to Memora Web API backend
  // In production:
  // fetch("http://localhost:3000/api/memories", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  //   body: JSON.stringify(payload)
  // })
  // .then(res => res.json())
  // .then(data => console.log("Memory saved successfully:", data))
  // .catch(err => console.error("Error saving memory:", err));

  // Trigger browser desktop notification to confirm the save!
  chrome.notifications?.create({
    type: "basic",
    iconUrl: "src/popup/icon-128.png", // fallback local icon
    title: "Saved to Memora",
    message: payload.title,
    priority: 1
  }, () => {
    if (chrome.runtime.lastError) {
      console.log("Notifications API not fully loaded, skipping alert window.");
    }
  });
}
