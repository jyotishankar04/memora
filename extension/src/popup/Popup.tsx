import React, { useEffect, useState } from "react";
import { 
  Sparkles, Check, Bookmark, AlertCircle, RefreshCw, Settings, ExternalLink, ShieldAlert 
} from "lucide-react";

type ExtensionState = "checking" | "unauthorized" | "saving" | "saved" | "already_saved" | "error";

interface PageInfo {
  url: string;
  title: string;
  favIconUrl?: string;
  description?: string;
}

export default function Popup() {
  const [state, setState] = useState<ExtensionState>("checking");
  const [token, setToken] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [note, setNote] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("None");
  const [suggestedTags, setSuggestedTags] = useState<string[]>(["Design", "SaaS", "Inspiration"]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [timeAgo, setTimeAgo] = useState("3 months ago");

  useEffect(() => {
    // 1. Check authentication status
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["memora_token"], (result) => {
        const storedToken = result.memora_token || null;
        setToken(storedToken);

        if (!storedToken) {
          setState("unauthorized");
        } else {
          // 2. Fetch current tab metadata
          captureCurrentTab();
        }
      });
    } else {
      // Standalone browser trial mock
      setState("unauthorized");
    }
  }, []);

  const captureCurrentTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url && activeTab.id) {
        const info: PageInfo = {
          url: activeTab.url,
          title: activeTab.title || "Untitled Webpage",
          favIconUrl: activeTab.favIconUrl
        };

        // Ask the content script for page metadata (og:description etc.) it already scrapes.
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "GET_METADATA" },
          (response) => {
            // Content script may not be injected on this page (e.g. chrome:// URLs) — ignore silently.
            if (chrome.runtime.lastError) return;
            if (response?.description) {
              setPageInfo((prev) => (prev ? { ...prev, description: response.description } : prev));
            }
          }
        );

        setPageInfo(info);

        // Check duplicates mock/simulated check
        if (info.url.includes("already-saved") || info.url.includes("postgres")) {
          setState("already_saved");
        } else {
          initiateSave(info);
        }
      } else {
        setState("error");
      }
    });
  };

  const initiateSave = (info: PageInfo) => {
    setState("saving");

    // Simulated API call: POST /api/memories
    setTimeout(() => {
      // In a real app: fetch("https://api.memora.io/api/memories", { method: "POST", headers: { Authorization: token }, body: JSON.stringify(info) })
      // Auto tag extraction simulation based on title keyword
      const lowTitle = info.title.toLowerCase();
      if (lowTitle.includes("design") || lowTitle.includes("ui") || lowTitle.includes("landing")) {
        setSuggestedTags(["Design", "Inspo", "SaaS"]);
      } else if (lowTitle.includes("postgre") || lowTitle.includes("sql") || lowTitle.includes("code")) {
        setSuggestedTags(["Development", "Database", "Backend"]);
      }
      
      setState("saved");
    }, 1200);
  };

  const handleManualSave = () => {
    // Save updated context (note, tags, collections)
    setState("saving");
    setTimeout(() => {
      setState("saved");
      setTimeout(() => window.close(), 1000);
    }, 800);
  };

  const handleSignIn = () => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url: "http://localhost:3000/auth/login" });
    } else {
      alert("Opening authentication tab in Web Client...");
    }
  };

  const handleOpenMemora = () => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url: "http://localhost:3000/app" });
    } else {
      alert("Redirecting to http://localhost:3000/app");
    }
  };

  const toggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(prev => prev.filter(t => t !== tag));
    } else {
      setActiveTags(prev => [...prev, tag]);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Extension Header */}
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <Sparkles size={16} color="#1447E6" fill="#1447E6" />
          <span style={styles.logoText}>memora</span>
        </div>
        <button style={styles.iconButton} onClick={handleOpenMemora}>
          <Settings size={14} color="#8e8e93" />
        </button>
      </div>

      {/* State Renderers */}

      {state === "checking" && (
        <div style={styles.centerContainer}>
          <RefreshCw size={24} color="#1447E6" className="animate-spin" />
          <p style={styles.statusLabel}>Connecting to Memora...</p>
        </div>
      )}

      {state === "unauthorized" && (
        <div style={styles.centerContainer}>
          <ShieldAlert size={28} color="#ff3b30" />
          <p style={styles.unauthLabel}>Save anything you find.</p>
          <p style={styles.unauthSub}>Connect this extension to your main Memora dashboard account.</p>
          <button style={styles.primaryButton} onClick={handleSignIn}>
            Sign in
          </button>
          {/* import.meta.env.DEV is stripped to `false` by Vite in production builds,
              so this branch — and the mock-token bypass — never ships to users. */}
          {import.meta.env.DEV && (
            <button
              style={{ ...styles.linkButton, marginTop: 12, color: "#1447E6" }}
              onClick={() => {
                const mockToken = "mock-secret-session-token";
                if (typeof chrome !== "undefined" && chrome.storage) {
                  chrome.storage.local.set({ memora_token: mockToken }, () => {
                    setToken(mockToken);
                    captureCurrentTab();
                  });
                } else {
                  setToken(mockToken);
                  setPageInfo({
                    url: "https://linear.app",
                    title: "Linear — Issue Tracking for Teams",
                    favIconUrl: "https://linear.app/favicon.ico"
                  });
                  setState("saving");
                  setTimeout(() => setState("saved"), 1000);
                }
              }}
            >
              Use Mock Token (Dev Mode)
            </button>
          )}
        </div>
      )}

      {state === "saving" && (
        <div style={styles.centerContainer}>
          <p style={styles.savingLabel}>Saving to Memora...</p>
          <div style={styles.progressTrack}>
            <div style={styles.progressBar} />
          </div>
        </div>
      )}

      {state === "error" && (
        <div style={styles.centerContainer}>
          <AlertCircle size={28} color="#ff3b30" />
          <p style={styles.errorLabel}>Couldn't save page</p>
          <p style={styles.errorSub}>Make sure you are on a valid webpage context.</p>
          <button style={styles.secondaryButton} onClick={captureCurrentTab}>
            Try again
          </button>
        </div>
      )}

      {state === "already_saved" && (
        <div style={styles.cardContainer}>
          <div style={styles.statusHeader}>
            <RefreshCw size={16} color="#1447E6" />
            <span style={styles.statusText}>Already saved</span>
          </div>
          <p style={styles.alreadySavedSub}>
            You saved this {timeAgo}.
          </p>

          <div style={styles.previewBox}>
            <TextTruncate text={pageInfo?.title || "Untitled"} lines={2} style={styles.previewTitle} />
            <span style={styles.previewDomain}>{getDomain(pageInfo?.url)}</span>
          </div>

          <div style={styles.actionsColumn}>
            <button style={styles.primaryButton} onClick={handleOpenMemora}>
              View existing memory
            </button>
            <button style={styles.linkButton} onClick={() => pageInfo && initiateSave(pageInfo)}>
              Save anyway
            </button>
          </div>
        </div>
      )}

      {state === "saved" && (
        <div style={styles.savedForm}>
          
          <div style={styles.statusHeader}>
            <Check size={16} color="#1447E6" />
            <span style={styles.statusText}>Saved to Memora</span>
          </div>

          {/* Web preview panel */}
          <div style={styles.previewBox}>
            <TextTruncate text={pageInfo?.title || "Untitled"} lines={2} style={styles.previewTitle} />
            <span style={styles.previewDomain}>{getDomain(pageInfo?.url)}</span>
            {pageInfo?.description && (
              <TextTruncate text={pageInfo.description} lines={2} style={styles.previewDescription} />
            )}
          </div>

          {/* Context note input */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>ADD A NOTE</label>
            <textarea
              style={styles.textarea}
              placeholder="Why are you saving this? (Add context to search later)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Suggested Tags selection */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>SUGGESTED TAGS</label>
            <div style={styles.tagsContainer}>
              {suggestedTags.map((tag, idx) => {
                const isActive = activeTags.includes(tag);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleTag(tag)}
                    style={{
                      ...styles.tagBadge,
                      backgroundColor: isActive ? "rgba(20,71,230,0.15)" : "#f2f2f7",
                      borderColor: isActive ? "#1447E6" : "transparent",
                      color: isActive ? "#1447E6" : "#8e8e93"
                    }}
                  >
                    {isActive ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collection folder selection */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>COLLECTION</label>
            <select
              style={styles.select}
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              <option value="None">None</option>
              <option value="Design">Design Inspiration</option>
              <option value="Development">AI & Development</option>
              <option value="Learning">Learning & Notes</option>
            </select>
          </div>

          {/* Buttons footer */}
          <button style={styles.primaryButton} onClick={handleManualSave}>
            Save changes
          </button>
          
          <button style={styles.openDashboardLink} onClick={handleOpenMemora}>
            <span>Open Memora</span>
            <ExternalLink size={12} style={{ marginLeft: 4 }} />
          </button>

        </div>
      )}

      <style>{`
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}

// Helpers
function getDomain(url?: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "");
  } catch (e) {
    return "";
  }
}

const TextTruncate = ({ text, lines, style }: { text: string; lines: number; style: React.CSSProperties }) => {
  return (
    <div style={{ ...style, display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
      {text}
    </div>
  );
};

// inline Styles
const styles = {
  container: {
    width: "320px",
    backgroundColor: "#ffffff",
    padding: "16px",
    boxSizing: "border-box" as const,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  logoText: {
    fontSize: "15px",
    fontWeight: "bold",
    letterSpacing: "-0.5px",
  },
  iconButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "4px",
  },
  centerContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "36px 0",
    textAlign: "center" as const,
  },
  statusLabel: {
    fontSize: "12px",
    color: "#8e8e93",
    marginTop: "12px",
  },
  unauthLabel: {
    fontSize: "15px",
    fontWeight: "bold",
    marginTop: "16px",
    color: "#1c1c1e",
  },
  unauthSub: {
    fontSize: "11px",
    color: "#8e8e93",
    padding: "0 16px",
    lineHeight: "15px",
    margin: "8px 0 20px 0",
  },
  savingLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1c1c1e",
    marginBottom: "12px",
  },
  progressTrack: {
    width: "140px",
    height: "4px",
    backgroundColor: "#f2f2f7",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressBar: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1447E6",
    animation: "fillProgress 1s ease-out forwards",
  },
  errorLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#ff3b30",
    marginTop: "12px",
  },
  errorSub: {
    fontSize: "11px",
    color: "#8e8e93",
    margin: "6px 0 16px 0",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    padding: "4px 0",
  },
  statusHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "2px",
  },
  statusText: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#1447E6",
  },
  alreadySavedSub: {
    fontSize: "12px",
    color: "#8e8e93",
    marginTop: "-6px",
  },
  previewBox: {
    border: "1px solid #e5e5ea",
    borderRadius: "12px",
    padding: "12px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  previewTitle: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#1c1c1e",
    lineHeight: "16px",
  },
  previewDomain: {
    fontSize: "10px",
    color: "#8e8e93",
    fontFamily: "monospace",
  },
  previewDescription: {
    fontSize: "10px",
    color: "#8e8e93",
    lineHeight: "14px",
    marginTop: "2px",
  },
  actionsColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    marginTop: "12px",
  },
  savedForm: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  fieldLabel: {
    fontSize: "9px",
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: "0.5px",
  },
  textarea: {
    border: "1px solid #e5e5ea",
    borderRadius: "10px",
    padding: "8px 10px",
    fontSize: "11px",
    height: "48px",
    color: "#1c1c1e",
    backgroundColor: "#f9f9f9",
    resize: "none" as const,
    fontFamily: "inherit",
    outline: "none",
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "6px",
  },
  tagBadge: {
    border: "1px solid transparent",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "10px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  select: {
    border: "1px solid #e5e5ea",
    borderRadius: "8px",
    padding: "6px 8px",
    fontSize: "11px",
    color: "#1c1c1e",
    backgroundColor: "#f9f9f9",
    outline: "none",
    cursor: "pointer",
  },
  primaryButton: {
    backgroundColor: "#1447E6",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e5ea",
    borderRadius: "12px",
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#1c1c1e",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  linkButton: {
    background: "transparent",
    border: "none",
    fontSize: "11px",
    color: "#8e8e93",
    cursor: "pointer",
    textDecoration: "underline",
    textAlign: "center" as const,
  },
  openDashboardLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    fontSize: "11px",
    color: "#1447E6",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "4px",
  }
};
