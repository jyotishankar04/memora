// Background service worker for Memora Chrome Extension V1

chrome.runtime.onInstalled.addListener(() => {
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

// Context Menus Click Handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const token = "mock-secret-session-token"; // Retrieve from storage in production

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
chrome.commands.onCommand.addListener((command) => {
  if (command === "quick-save-page") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url) {
        saveMemory({
          type: "link",
          url: activeTab.url,
          title: activeTab.title || "Quick Saved Page",
          source: "keyboard_shortcut"
        }, "mock-secret-session-token");
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
