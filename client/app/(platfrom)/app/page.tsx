"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { 
  Sparkles, Globe, Video, Image as ImageIcon, Code, FileText, StickyNote, Plus, Search, 
  Settings, HelpCircle, Bell, ArrowRight, X, Moon, Sun, Trash2, FolderOpen, 
  Compass, Check, Link as LinkIcon, Upload, ArrowUpRight, ChevronRight, ChevronDown, 
  MoreHorizontal, Star, MessageSquare, Grid, List, Copy, Archive, Edit, ExternalLink, ArrowLeft, FolderPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Interface Definitions
interface Memory {
  id: string;
  type: "web" | "video" | "image" | "note" | "document";
  title: string;
  description: string;
  source: string;
  timeAgo: string;
  tags: string[];
  duration?: string;
  platform?: string;
  favicon?: string;
  fileType?: string;
  group: "Today" | "Yesterday" | "Earlier this week" | "August 2026";
  starred?: boolean;
}

// Pre-populated Mock Saves (248 Saves concept represented cleanly)
const initialMemories: Memory[] = [
  {
    id: "mem-1",
    type: "web",
    title: "Linear Dashboard",
    description: "A SaaS analytics dashboard focused on minimal navigation and clean information hierarchy.",
    source: "linear.app/features",
    timeAgo: "12 min ago",
    tags: ["Design", "SaaS"],
    favicon: "L",
    group: "Today",
    starred: true
  },
  {
    id: "mem-2",
    type: "video",
    title: "Building a SaaS in 2026",
    description: "Detailed video breakdown of vector indexers, pgvector retrieval, and React 19 server actions.",
    source: "youtube.com/watch?v=saas2026",
    timeAgo: "2 hours ago",
    tags: ["Development", "SaaS"],
    duration: "12:42",
    platform: "YouTube",
    group: "Today"
  },
  {
    id: "mem-3",
    type: "note",
    title: "Memora duplicate saves idea",
    description: "What if Memora could automatically detect duplicate saves and merge summaries together?",
    source: "Personal Note",
    timeAgo: "Saved yesterday",
    tags: ["Product idea", "AI"],
    group: "Yesterday"
  },
  {
    id: "mem-4",
    type: "image",
    title: "SaaS Pricing UI Reference",
    description: "Screenshot showing clean card grids, pricing models in local currency, and subtle border dividers.",
    source: "screenshot_pricing.png",
    timeAgo: "Saved 2 days ago",
    tags: ["Design", "SaaS"],
    group: "Earlier this week"
  },
  {
    id: "mem-5",
    type: "document",
    title: "Vector DB Performance Comparison",
    description: "Research summary logging latency checks of pgvector vs Pinecone vs Qdrant.",
    source: "vector_db_sheet.pdf",
    timeAgo: "Saved 4 days ago",
    tags: ["AI", "Research"],
    fileType: "PDF",
    group: "Earlier this week"
  },
  {
    id: "mem-6",
    type: "web",
    title: "Raycast Store",
    description: "Clean layout of extension grid, detailed sidebar specifications, and keyboard navigation.",
    source: "raycast.com/store",
    timeAgo: "Saved 2 weeks ago",
    tags: ["Design", "Productivity"],
    favicon: "R",
    group: "August 2026"
  }
];

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "all-saves" | "settings" | "help">("home");

  // Filtering & Customizing All Saves Tab
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCardMenu, setActiveCardMenu] = useState<string | null>(null);

  // Bulk Selection States
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Detail Drawer State
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // "Ask Memora" AI Chat State
  const [askMemoraOpen, setAskMemoraOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hi Subham! Ask me anything about the memories you've saved (e.g. 'Show me SaaS landing pages' or 'What design notes did I take?')." }
  ]);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  
  // Save modal steps: 1 = input, 2 = preview & save, 3 = success moment
  const [saveStep, setSaveStep] = useState<1 | 2 | 3>(1);
  const [inputUrl, setInputUrl] = useState("");
  const [savingType, setSavingType] = useState<"web" | "note" | "video" | "idea">("web");
  const [detectedTitle, setDetectedTitle] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>(["Design", "SaaS", "Inspiration"]);
  const [isSaving, setIsSaving] = useState(false);

  // Close menus on click outside
  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenSaveModal = (type: "web" | "note" | "video" | "idea") => {
    setSavingType(type);
    setSaveStep(1);
    setSaveModalOpen(true);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsSaving(true);
    setTimeout(() => {
      if (inputUrl.includes("example.com") || inputUrl.startsWith("http")) {
        setDetectedTitle("Beautiful SaaS Landing Page");
      } else {
        setDetectedTitle(inputUrl);
      }
      setIsSaving(false);
      setSaveStep(2);
    }, 1000);
  };

  const handleConfirmSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const newMem: Memory = {
        id: `mem-${Date.now()}`,
        type: savingType === "idea" ? "note" : (savingType === "web" ? "web" : (savingType === "video" ? "video" : "note")),
        title: detectedTitle || "New Captured Memory",
        description: "Auto-analyzed memory context. Extracted conceptual tags and layout data.",
        source: inputUrl || "Quick Captured",
        timeAgo: "Saved just now",
        tags: suggestedTags,
        group: "Today"
      };

      setMemories(prev => [newMem, ...prev]);
      setIsSaving(false);
      setSaveStep(3);
    }, 800);
  };

  const handleDelete = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    if (selectedMemory?.id === id) setSelectedMemory(null);
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const triggerSearchSample = (query: string) => {
    setSearchQuery(query);
    setActiveTab("all-saves");
  };

  // Bulk Selection Handlers
  const handleSelectCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    setMemories(prev => prev.filter(m => !selectedIds.has(m.id)));
    setSelectedIds(new Set());
    setBulkMode(false);
  };

  const handleBulkArchive = () => {
    alert(`Archived ${selectedIds.size} saved items conceptually.`);
    setSelectedIds(new Set());
    setBulkMode(false);
  };

  // Ask Memora conversational prompt submission
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let aiResponse = "I analyzed your archives. ";
      if (userMsg.toLowerCase().includes("landing") || userMsg.toLowerCase().includes("design")) {
        aiResponse += "I found 18 design references. The most notable ones are 'Linear Dashboard' (saved today) and 'Raycast Store' (saved in August 2026). They both use clean card structures and keyboard navigability.";
      } else if (userMsg.toLowerCase().includes("saas")) {
        aiResponse += "You have 3 core SaaS saves: 'Linear', 'Building a SaaS in 2026' (video), and 'SaaS Pricing UI Reference'. They focus heavily on layout design and monetizations.";
      } else {
        aiResponse += "Based on your saved memories, I suggest looking into your AI/vector databases research or design collections. Would you like me to extract summaries?";
      }
      setChatMessages(prev => [...prev, { sender: "ai", text: aiResponse }]);
    }, 1000);
  };

  // Filter memories list
  const filteredMemories = memories.filter((mem) => {
    // Current category tab filter
    if (currentFilter !== "all") {
      if (currentFilter === "links" && mem.type !== "web") return false;
      if (currentFilter === "notes" && mem.type !== "note") return false;
      if (currentFilter === "videos" && mem.type !== "video") return false;
      if (currentFilter === "images" && mem.type !== "image") return false;
      if (currentFilter === "files" && mem.type !== "document") return false;
      if (currentFilter === "ideas" && !mem.tags.includes("Idea") && !mem.tags.includes("Product idea")) return false;
    }

    // Search filter
    if (searchQuery) {
      const matchText = 
        mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mem.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchText) return false;
    }

    return true;
  });

  // Grouped memories
  const groups: Array<"Today" | "Yesterday" | "Earlier this week" | "August 2026"> = [
    "Today", "Yesterday", "Earlier this week", "August 2026"
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-border/60 bg-muted/15 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-7">
          
          {/* Logo wordmark */}
          <Link href="/" className="flex items-center gap-2 px-1 hover:opacity-85 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white font-semibold">
              <Sparkles className="h-4 w-4 fill-current" />
            </div>
            <span className="text-sm font-semibold tracking-[-0.03em]">memora</span>
          </Link>

          {/* Main Navigation */}
          <div className="space-y-1">
            <button
              onClick={() => { setActiveTab("home"); setSearchQuery(""); }}
              className={cn(
                "w-full px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition-colors text-left",
                activeTab === "home" ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass className="h-4 w-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => { setActiveTab("all-saves"); }}
              className={cn(
                "w-full px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition-colors text-left",
                activeTab === "all-saves" ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <FolderOpen className="h-4 w-4" />
              <span>All Saves</span>
              <span className="text-[10px] font-mono opacity-70 ml-auto">{memories.length}</span>
            </button>

            <button
              onClick={() => handleOpenSaveModal("web")}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition-colors text-left hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Collections (AI Generated) */}
          <div className="space-y-1.5 pt-4 border-t border-border/30">
            <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">
              Collections
            </h4>
            {[
              { label: "🎨 Design", tag: "Design" },
              { label: "💻 Development", tag: "Development" },
              { label: "🤖 AI", tag: "AI" },
              { label: "💡 Ideas", tag: "Idea" },
              { label: "📚 Learning", tag: "Research" },
              { label: "🚀 SaaS", tag: "SaaS" },
            ].map((col) => (
              <button
                key={col.label}
                onClick={() => triggerSearchSample(col.tag)}
                className="w-full px-3 py-1.5 text-xs font-medium rounded-lg flex items-center justify-between text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
              >
                <span>{col.label}</span>
                <ChevronRight className="h-3 w-3 opacity-30" />
              </button>
            ))}
          </div>

          {/* Smart Sections */}
          <div className="space-y-1.5 pt-4 border-t border-border/30">
            <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">
              Smart
            </h4>
            {[
              { label: "✦ For You", query: "SaaS" },
              { label: "◈ Discover", query: "Design" },
              { label: "◌ Recently Viewed", query: "" },
            ].map((sm) => (
              <button
                key={sm.label}
                onClick={() => triggerSearchSample(sm.query)}
                className="w-full px-3 py-1.5 text-xs font-medium rounded-lg flex items-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
              >
                {sm.label}
              </button>
            ))}
          </div>

        </div>

        {/* Sidebar Bottom Profile */}
        <div className="space-y-1.5 p-4 border-t border-border/40">
          <button 
            onClick={() => setActiveTab("settings")}
            className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("help")}
            className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </button>

          {/* Profile box */}
          <div className="pt-3 flex items-center gap-2.5 px-3 border-t border-border/20 mt-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs select-none">
              JD
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Subham Jyoti</p>
              <p className="text-[9px] text-muted-foreground font-mono">PRO MEMBERSHIP</p>
            </div>
          </div>
        </div>

      </aside>

      {/* HEADER / BODY CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 border-b border-border/40 px-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {activeTab === "all-saves" ? "All Saves" : "Good morning, Subham"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* ⌘K Search trigger */}
            <button 
              onClick={() => setSearchModalOpen(true)}
              className="h-9 px-3 rounded-full border border-border/60 bg-muted/20 text-xs text-muted-foreground flex items-center gap-2 hover:bg-muted transition-all select-none"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search memory...</span>
              <kbd className="px-1.5 py-0.5 border border-border bg-muted rounded text-[9px] font-mono">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button className="h-9 w-9 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4 w-4" />
            </button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-full border border-border/60"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
          
          {/* TAB 1: HOME VIEW */}
          {activeTab === "home" && (
            <div className="space-y-12 animate-fade-in">
              
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Good morning, Subham
                </h1>
                <p className="text-xs text-muted-foreground">
                  Here's what's happening in your memory.
                </p>
              </div>

              {/* MAIN SEARCH BOX */}
              <div className="space-y-4 max-w-xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4.5 h-5 w-5 text-primary stroke-[2.5]" />
                  <input
                    type="text"
                    placeholder="Search anything you remember..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-muted/30 border border-border text-foreground rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/80 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 shadow-xs"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4.5 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-muted-foreground space-y-1.5 px-1 font-medium font-sans">
                  <span className="font-semibold">Try searching conceptually:</span>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                    {[
                      { text: "“websites I saved for dashboard inspiration”", query: "Dashboard" },
                      { text: "“React authentication resources”", query: "React" },
                      { text: "“videos about building SaaS”", query: "SaaS" },
                      { text: "“that article about vector databases”", query: "AI" }
                    ].map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => triggerSearchSample(item.query)}
                        className="text-primary hover:underline bg-primary/5 px-2 py-0.5 rounded border border-primary/10 text-left"
                      >
                        {item.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* QUICK CAPTURE PANEL */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Save something</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
                  <button onClick={() => handleOpenSaveModal("web")} className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs hover:border-primary/20 transition-all duration-300 text-left group">
                    <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[110px]">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors"><LinkIcon className="h-4 w-4" /></div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Save Link</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Paste a URL</p>
                      </div>
                    </div>
                  </button>

                  <button onClick={() => handleOpenSaveModal("note")} className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs hover:border-primary/20 transition-all duration-300 text-left group">
                    <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[110px]">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors"><StickyNote className="h-4 w-4" /></div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Quick Note</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Capture a thought</p>
                      </div>
                    </div>
                  </button>

                  <button onClick={() => handleOpenSaveModal("idea")} className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs hover:border-primary/20 transition-all duration-300 text-left group">
                    <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[110px]">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors"><Upload className="h-4 w-4" /></div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Upload</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Image or file</p>
                      </div>
                    </div>
                  </button>

                  <button onClick={() => handleOpenSaveModal("web")} className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs hover:border-primary/20 transition-all duration-300 text-left group">
                    <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[110px]">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors"><ArrowUpRight className="h-4 w-4" /></div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Save Anything</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">From extension</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* RECENTLY SAVED */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Recently saved</h3>
                  <button onClick={() => setActiveTab("all-saves")} className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memories.slice(0, 3).map((item) => (
                    <div key={item.id} className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 group">
                      <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[170px] space-y-4">
                        <div className="relative aspect-video w-full rounded-lg bg-muted border border-border/30 overflow-hidden flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                          {item.type === "video" ? <div className="flex flex-col items-center gap-1"><Video className="h-5 w-5 text-red-500" /><span>YouTube Video</span></div> : <div className="flex flex-col items-center gap-1"><Globe className="h-5 w-5 text-primary" /><span>Web Preview</span></div>}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{item.title}</h4>
                          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border/20">
                          <div className="flex gap-1">{item.tags.map(t => <span key={t} className="text-[7.5px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{t}</span>)}</div>
                          <span className="text-[9px] text-muted-foreground font-mono">{item.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ALL SAVES SPECIFICATION VIEW */}
          {activeTab === "all-saves" && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Header and Stats */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">All saves</h1>
                  <p className="text-xs text-muted-foreground mt-1">Everything you've captured, in one place.</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Ask Memora & Stats */}
                  <button 
                    onClick={() => setAskMemoraOpen(true)}
                    className="h-10 px-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-1.5 hover:bg-primary/15 transition-all"
                  >
                    <Sparkles className="h-4 w-4" /> Ask Memora
                  </button>

                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">248</span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block leading-none">Memories</span>
                  </div>
                </div>
              </div>

              {/* 3. SEARCH & CONTROLS ROW */}
              <div className="space-y-4">
                
                {/* Search Bar */}
                <div className="relative flex items-center max-w-xl">
                  <Search className="absolute left-4 h-4.5 w-4.5 text-primary stroke-[2.5]" />
                  <input
                    type="text"
                    placeholder="Search your memories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-muted/20 border border-border text-foreground rounded-xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-primary/80 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* 4. CONTENT FILTERS & MULTI-SELECTION TOGGLE */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  
                  {/* Horizontal Tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {[
                      { id: "all", label: "All" },
                      { id: "links", label: "Links" },
                      { id: "notes", label: "Notes" },
                      { id: "videos", label: "Videos" },
                      { id: "images", label: "Images" },
                      { id: "files", label: "Files" },
                      { id: "ideas", label: "Ideas" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setCurrentFilter(tab.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all text-nowrap select-none",
                          currentFilter === tab.id
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Controls: Bulk Select, Sort, Grid/List */}
                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 text-xs">
                    
                    {/* Bulk Selection Toggle */}
                    <button 
                      onClick={() => { setBulkMode(!bulkMode); setSelectedIds(new Set()); }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border font-semibold transition-all",
                        bulkMode ? "border-primary text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {bulkMode ? "Cancel Select" : "Select"}
                    </button>

                    {/* 5. Sort selection dropdown mock */}
                    <div className="relative flex items-center border border-border/60 rounded-lg px-2.5 py-1.5 bg-card text-muted-foreground font-semibold">
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent focus:outline-none pr-1 cursor-pointer"
                      >
                        <option value="recent">Recently saved</option>
                        <option value="viewed">Recently viewed</option>
                        <option value="oldest">Oldest first</option>
                        <option value="relevant">Most relevant</option>
                        <option value="alpha">Alphabetical</option>
                      </select>
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    </div>

                    {/* 6. Grid/List Toggle */}
                    <div className="flex items-center border border-border/60 rounded-lg bg-card overflow-hidden">
                      <button 
                        onClick={() => setViewMode("grid")}
                        className={cn("p-1.5 hover:bg-muted transition-colors", viewMode === "grid" ? "text-primary bg-primary/5" : "text-muted-foreground")}
                      >
                        <Grid className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => setViewMode("list")}
                        className={cn("p-1.5 hover:bg-muted transition-colors", viewMode === "list" ? "text-primary bg-primary/5" : "text-muted-foreground")}
                      >
                        <List className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* TIMELINE ARCHIVE GRID */}
              {filteredMemories.length > 0 ? (
                <div className="space-y-10 pt-4">
                  {groups.map((groupName) => {
                    const groupItems = filteredMemories.filter(m => m.group === groupName);
                    if (groupItems.length === 0) return null;

                    return (
                      <div key={groupName} className="space-y-4">
                        
                        {/* Time divider heading */}
                        <div className="flex items-center gap-3">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
                            {groupName}
                          </h3>
                          <div className="flex-1 h-px bg-border/40" />
                        </div>

                        {/* Grid / List Cards mapping */}
                        <div className={cn(
                          viewMode === "grid" 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "flex flex-col gap-3"
                        )}>
                          {groupItems.map((item) => {
                            
                            // Visual properties based on type
                            let TypeIcon = Globe;
                            let cardColor = "border-primary/10 bg-primary/5";
                            if (item.type === "video") { TypeIcon = Video; cardColor = "border-red-500/10 bg-red-500/5"; }
                            if (item.type === "note") { TypeIcon = StickyNote; cardColor = "border-amber-500/10 bg-amber-500/5"; }
                            if (item.type === "image") { TypeIcon = ImageIcon; cardColor = "border-purple-500/10 bg-purple-500/5"; }
                            if (item.type === "document") { TypeIcon = FileText; cardColor = "border-teal-500/10 bg-teal-500/5"; }

                            const isSelected = selectedIds.has(item.id);

                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  if (bulkMode) {
                                    const newSelected = new Set(selectedIds);
                                    if (newSelected.has(item.id)) newSelected.delete(item.id);
                                    else newSelected.add(item.id);
                                    setSelectedIds(newSelected);
                                  } else {
                                    setSelectedMemory(item);
                                  }
                                }}
                                className={cn(
                                  "rounded-xl border shadow-xs transition-all duration-300 relative group cursor-pointer",
                                  isSelected 
                                    ? "border-primary bg-primary/5" 
                                    : "border-border/45 bg-muted/75 hover:border-primary/20",
                                  viewMode === "grid" ? "p-1" : "p-0.5"
                                )}
                              >
                                {/* Checkbox for bulk select */}
                                {bulkMode && (
                                  <div className="absolute top-3 left-3 z-20">
                                    <div className={cn(
                                      "h-4 w-4 rounded border flex items-center justify-center transition-all",
                                      isSelected ? "bg-primary border-primary text-white" : "border-border/80 bg-card"
                                    )}>
                                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                    </div>
                                  </div>
                                )}

                                {/* Card inner container */}
                                <div className={cn(
                                  "rounded-lg border border-border/75 bg-card flex flex-col justify-between transition-colors",
                                  viewMode === "grid" ? "p-5 min-h-[190px] space-y-4" : "p-3.5 flex-row items-center gap-4"
                                )}>
                                  
                                  {/* Grid Layout Cards */}
                                  {viewMode === "grid" && (
                                    <>
                                      {/* Header action menu toggle */}
                                      <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground relative">
                                        <span className="bg-primary/5 border border-primary/15 px-2 py-0.5 rounded text-primary uppercase font-bold flex items-center gap-1">
                                          <TypeIcon className="h-2.5 w-2.5" /> {item.type}
                                        </span>
                                        
                                        <div className="flex items-center gap-1">
                                          {/* Star favorite toggle */}
                                          <button 
                                            onClick={(e) => toggleStar(item.id, e)}
                                            className="text-muted-foreground hover:text-amber-500 transition-colors"
                                          >
                                            <Star className={cn("h-3.5 w-3.5", item.starred ? "fill-amber-500 text-amber-500" : "")} />
                                          </button>

                                          {/* More options dots */}
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); setActiveCardMenu(activeCardMenu === item.id ? null : item.id); }}
                                            className="text-muted-foreground hover:text-foreground hover:bg-muted h-6 w-6 rounded-full flex items-center justify-center"
                                          >
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                          </button>
                                        </div>

                                        {/* Card dropdown popover menu */}
                                        {activeCardMenu === item.id && (
                                          <div className="absolute right-0 top-7 w-36 bg-card border border-border rounded-lg shadow-lg py-1 z-30 text-[10px] font-bold text-foreground">
                                            {[
                                              { label: "Open", icon: ExternalLink, action: () => window.open(item.source.startsWith("http") ? item.source : `https://${item.source}`) },
                                              { label: "Edit", icon: Edit, action: () => alert("Edit item...") },
                                              { label: "Add to collection", icon: FolderPlus, action: () => alert("Add to collection...") },
                                              { label: "Copy link", icon: Copy, action: () => navigator.clipboard.writeText(item.source) },
                                              { label: "Ask Memora", icon: Sparkles, action: () => setAskMemoraOpen(true) },
                                              { label: "Archive", icon: Archive, action: () => alert("Item archived conceptually.") },
                                              { label: "Delete", icon: Trash2, action: () => handleDelete(item.id) }
                                            ].map((menuItem) => (
                                              <button
                                                key={menuItem.label}
                                                onClick={(e) => { e.stopPropagation(); menuItem.action(); setActiveCardMenu(null); }}
                                                className="w-full px-3 py-1.5 hover:bg-muted text-left flex items-center gap-2"
                                              >
                                                <menuItem.icon className="h-3 w-3 opacity-60" />
                                                <span>{menuItem.label}</span>
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                      {/* Thumbnail Placeholder */}
                                      {item.type !== "note" && (
                                        <div className="aspect-video w-full rounded-lg bg-muted border border-border/30 overflow-hidden flex items-center justify-center text-[10px] text-muted-foreground font-semibold select-none">
                                          {item.type === "video" ? (
                                            <div className="flex flex-col items-center gap-1.5">
                                              <Video className="h-6 w-6 text-red-500" />
                                              <span>YouTube Video ({item.duration})</span>
                                            </div>
                                          ) : item.type === "image" ? (
                                            <div className="flex flex-col items-center gap-1.5">
                                              <ImageIcon className="h-6 w-6 text-purple-500" />
                                              <span>Image Mockup</span>
                                            </div>
                                          ) : (
                                            <div className="flex flex-col items-center gap-1.5">
                                              <Globe className="h-6 w-6 text-primary" />
                                              <span>Website Preview</span>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Note Body Text preview */}
                                      {item.type === "note" && (
                                        <div className="p-3 border border-border/60 bg-muted/20 rounded-lg text-[10px] text-muted-foreground leading-relaxed font-mono">
                                          {item.description}
                                        </div>
                                      )}

                                      {/* Card description text */}
                                      <div className="space-y-1">
                                        <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
                                          {item.title}
                                        </h4>
                                        <span className="text-[9px] text-muted-foreground truncate block font-mono">
                                          {item.source}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between pt-3 border-t border-border/20">
                                        <div className="flex flex-wrap gap-1">
                                          {item.tags.map(t => (
                                            <span key={t} className="text-[7.5px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                        <span className="text-[9px] text-muted-foreground font-mono">{item.timeAgo}</span>
                                      </div>
                                    </>
                                  )}

                                  {/* List Layout Cards */}
                                  {viewMode === "list" && (
                                    <div className="flex-1 flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                          <TypeIcon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                            {item.title}
                                          </h4>
                                          <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">{item.source} &middot; {item.description}</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-4 shrink-0 font-mono text-[9px] text-muted-foreground">
                                        <div className="flex gap-1">
                                          {item.tags.map(t => (
                                            <span key={t} className="text-[7.5px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                        <span>{item.timeAgo}</span>
                                        
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                          className="h-8 w-8 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                /* 14. EMPTY STATE */
                <div className="text-center py-20 max-w-sm mx-auto space-y-6">
                  <div className="h-14 w-14 bg-primary/5 text-primary border border-primary/15 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">Your memory is empty</h3>
                    <p className="text-xs text-muted-foreground">
                      Save something and it'll appear here automatically.
                    </p>
                  </div>

                  <button 
                    onClick={() => handleOpenSaveModal("web")}
                    className="h-10 px-6 rounded-full bg-primary text-white text-xs font-bold flex items-center gap-1.5 mx-auto"
                  >
                    <Plus className="h-4 w-4" /> Save something
                  </button>

                  <p className="text-[10px] text-muted-foreground leading-relaxed pt-4 border-t border-border/20">
                    <span className="font-bold">Tip:</span> Install the browser extension to save anything with one click.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: SETTINGS VIEW */}
          {activeTab === "settings" && (
            <div className="max-w-md space-y-6 animate-fade-in">
              <h1 className="text-xl font-bold uppercase tracking-tight border-b border-border/20 pb-4">Settings</h1>
              <div className="space-y-4 text-xs font-semibold text-foreground/80">
                <div className="p-4 border border-border/60 bg-muted/20 rounded-xl space-y-2">
                  <h3 className="text-xs font-bold text-foreground">Theme Settings</h3>
                  <p className="text-[10px] text-muted-foreground">Switch between light and dark visual interfaces.</p>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => setTheme("light")} className="h-8 rounded-full text-[10px]">Light Mode</Button>
                    <Button onClick={() => setTheme("dark")} className="h-8 rounded-full text-[10px]">Dark Mode</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HELP VIEW */}
          {activeTab === "help" && (
            <div className="max-w-md space-y-6 animate-fade-in">
              <h1 className="text-xl font-bold uppercase tracking-tight border-b border-border/20 pb-4">Help Center</h1>
              <p className="text-xs text-muted-foreground">
                Need assistance with integration plugins or vector query adjustments? Get in touch with our tech support team.
              </p>
              <Link href="/contact" className="text-xs font-bold text-primary hover:underline block">
                Go to support form &rarr;
              </Link>
            </div>
          )}

        </div>

      </div>

      {/* 10. DETAIL DRAWER (RIGHT-SIDE PANEL) */}
      {selectedMemory && (
        <div className="w-80 border-l border-border bg-card flex flex-col shrink-0 z-40 relative animate-slide-left">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-border/20 flex items-center justify-between shrink-0">
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-foreground truncate">{selectedMemory.title}</h3>
              <span className="text-[9px] font-mono text-muted-foreground truncate block">{selectedMemory.source}</span>
            </div>
            <button 
              onClick={() => setSelectedMemory(null)}
              className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs leading-relaxed">
            
            {/* Website preview placeholder */}
            <div className="aspect-video w-full rounded-lg bg-muted border border-border/45 flex items-center justify-center text-[10px] text-muted-foreground font-bold font-mono">
              Website Preview
            </div>

            {/* Title notes */}
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-muted-foreground">DESCRIPTION</span>
              <p className="text-[10px] text-foreground/90 font-medium">{selectedMemory.description}</p>
            </div>

            {/* Tags row */}
            <div className="space-y-2">
              <span className="text-[8px] font-mono text-muted-foreground">SUGGESTED TOPICS</span>
              <div className="flex flex-wrap gap-1">
                {selectedMemory.tags.map((tag) => (
                  <span key={tag} className="text-[8px] font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1 border-t border-border/20 pt-3">
              <span className="text-[8px] font-mono text-muted-foreground block">DATE CAPTURED</span>
              <span className="text-[9px] font-mono font-medium text-foreground">{selectedMemory.timeAgo} (Aug 24, 2026)</span>
            </div>

            {/* 11. AI Summary Block */}
            <div className="space-y-3 border-t border-border/20 pt-4">
              <div className="flex items-center gap-1.5 text-primary">
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Summary</span>
              </div>

              <div className="space-y-2 text-[10px] leading-relaxed text-muted-foreground">
                <div>
                  <span className="font-semibold text-foreground block mb-0.5">What this is:</span>
                  A minimal SaaS design workspace with low-noise navigation items, dynamic collections grid, and keyboard shortcuts helpers.
                </div>
                <div>
                  <span className="font-semibold text-foreground block mb-0.5">Why you saved it:</span>
                  Similar to other clean layout references you've curated recently for project setups.
                </div>
              </div>
            </div>

            {/* 12. Related Memories */}
            <div className="space-y-3 border-t border-border/20 pt-4">
              <span className="text-[8px] font-mono text-muted-foreground block">RELATED MEMORIES</span>
              
              <div className="grid grid-cols-1 gap-2 pt-1 font-sans">
                {[
                  { title: "Dashboard reference", desc: "Design inspiration layout", similarity: "94%" },
                  { title: "SaaS UI inspiration", desc: "Clean layout styles", similarity: "88%" },
                  { title: "Sidebar inspiration", desc: "Navigation components", similarity: "81%" }
                ].map((rel, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-border/60 bg-muted/15 flex items-center justify-between text-[10px] hover:border-primary/30 transition-all select-none">
                    <div>
                      <h5 className="font-bold text-foreground">{rel.title}</h5>
                      <span className="text-[8.5px] text-muted-foreground">{rel.desc}</span>
                    </div>
                    <span className="text-[8px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {rel.similarity} match
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Open website target button */}
          <div className="p-5 border-t border-border/20 shrink-0">
            <a 
              href={selectedMemory.source.startsWith("http") ? selectedMemory.source : `https://${selectedMemory.source}`}
              target="_blank"
              rel="noreferrer"
              className="w-full h-10 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/95 transition-all shadow-xs"
            >
              Open website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>
      )}

      {/* 13. FLOATING BULK ACTIONS BAR */}
      {bulkMode && selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded-full px-6 py-3.5 shadow-2xl z-50 flex items-center gap-6 animate-slide-up text-xs font-semibold">
          <span className="text-primary font-bold">{selectedIds.size} selected</span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBulkArchive}
              className="h-8 px-3 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all"
            >
              <Archive className="h-3.5 w-3.5" /> Add to collection
            </button>
            <button 
              onClick={() => alert("Tag added conceptually.")}
              className="h-8 px-3 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> Tag
            </button>
            <button 
              onClick={handleBulkArchive}
              className="h-8 px-3 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all"
            >
              <Archive className="h-3.5 w-3.5" /> Archive
            </button>
            <button 
              onClick={handleBulkDelete}
              className="h-8 px-3 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* 15. ASK MEMORA AI CONVERSATION DRAWER */}
      {askMemoraOpen && (
        <div className="w-80 border-l border-border bg-card flex flex-col shrink-0 z-40 relative animate-slide-left">
          
          {/* Header */}
          <div className="p-5 border-b border-border/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-primary">
              <Sparkles className="h-4 w-4 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider">Ask Memora</span>
            </div>
            <button 
              onClick={() => setAskMemoraOpen(false)}
              className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-3 rounded-xl max-w-[85%] leading-relaxed space-y-1",
                  msg.sender === "user" 
                    ? "bg-primary text-white ml-auto" 
                    : "bg-muted border border-border/60 text-foreground mr-auto"
                )}
              >
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChat} className="p-4 border-t border-border/20 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask Memora about your saves..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-full pl-4 pr-10 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/80"
              />
              <button 
                type="submit" 
                className="absolute right-2 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

        </div>
      )}

      {/* SAVE MODAL */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-border/20 pb-2">
              <span className="text-xs font-bold text-foreground">Save to Memora</span>
              <button onClick={() => setSaveModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {saveStep === 1 && (
              <form onSubmit={handleInputSubmit} className="space-y-4">
                <div className="relative flex items-center">
                  <LinkIcon className="absolute left-4 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Paste a link or write something..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full bg-background border border-input rounded-xl pl-11 pr-4 py-3.5 text-xs text-foreground focus:outline-none focus:border-primary/80"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">What are you saving?</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {["Website", "Note", "Video", "Idea"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSavingType(t.toLowerCase() as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase border transition-all",
                          savingType === t.toLowerCase()
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-muted/40 border-border/60 text-muted-foreground"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" disabled={isSaving} className="w-full h-11 rounded-full font-bold text-xs bg-primary text-white">
                  {isSaving ? "Analyzing..." : "Continue"}
                </Button>
              </form>
            )}

            {saveStep === 2 && (
              <div className="space-y-4">
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">✓ Preview found</span>
                <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
                  <h4 className="text-xs font-bold text-foreground">{detectedTitle}</h4>
                  <span className="text-[9px] text-muted-foreground font-mono truncate block">{inputUrl}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Suggested topics</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {suggestedTags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-[8.5px] font-bold uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Button onClick={handleConfirmSave} disabled={isSaving} className="w-full h-11 rounded-full font-bold text-xs bg-primary text-white">
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}

            {saveStep === 3 && (
              <div className="text-center py-6 space-y-4">
                <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest block">Saved to Memora</span>
                  <h4 className="text-xs font-bold text-foreground">{detectedTitle}</h4>
                  <div className="flex justify-center gap-1.5 flex-wrap pt-2">
                    {suggestedTags.map((tag) => (
                      <span key={tag} className="text-[7.5px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button onClick={() => { setSaveModalOpen(false); setActiveTab("all-saves"); }} className="flex-1 h-10 rounded-full text-xs font-bold bg-primary text-white">
                    View memory &rarr;
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* SEARCH MODAL (⌘K) */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl space-y-6 animate-scale-up">
            
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-primary stroke-[2.5]" />
              <input
                type="text"
                autoFocus
                placeholder="Search your memory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-input rounded-xl pl-12 pr-4 py-3.5 text-xs text-foreground focus:outline-none focus:border-primary/80"
              />
              <button onClick={() => setSearchModalOpen(false)} className="absolute right-4 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {!searchQuery ? (
              <div className="space-y-3.5 text-xs">
                <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Recent searches</h4>
                <div className="space-y-2 text-muted-foreground">
                  {[
                    { text: "React resources", query: "React" },
                    { text: "SaaS landing pages", query: "SaaS" },
                    { text: "AI tools", query: "AI" }
                  ].map((s, idx) => (
                    <button key={idx} onClick={() => { triggerSearchSample(s.query); setSearchModalOpen(false); }} className="w-full text-left py-1 hover:text-foreground flex items-center gap-2 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-border" />
                      <span>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/20 pb-2">
                  <span className="text-[9px] font-bold text-primary uppercase">Search results</span>
                  <span className="text-[9px] text-muted-foreground font-semibold">{filteredMemories.length} memories found</span>
                </div>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {filteredMemories.map((m) => (
                    <button key={m.id} onClick={() => { triggerSearchSample(m.title); setSearchModalOpen(false); }} className="w-full text-left p-2.5 hover:bg-muted/60 border border-border/40 rounded-lg flex items-center justify-between text-xs font-semibold text-foreground group transition-all">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[8px] font-mono uppercase bg-primary/10 text-primary px-1.5 rounded shrink-0">{m.type}</span>
                        <span className="truncate group-hover:text-primary transition-colors">{m.title}</span>
                      </div>
                      <ChevronRight className="h-3 w-3 opacity-30" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Local animation tags */}
      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-left {
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
