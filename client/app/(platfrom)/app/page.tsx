"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { 
  Sparkles, Globe, Video, Image, Code, FileText, StickyNote, Plus, Search, 
  Settings, HelpCircle, Bell, ArrowRight, X, Moon, Sun, Trash2, FolderOpen, 
  FolderPlus, Compass, RotateCcw, Check, Sparkle, Link as LinkIcon, Upload, ArrowUpRight, ChevronRight 
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
}

// Initial Mock Data
const initialMemories: Memory[] = [
  {
    id: "mem-1",
    type: "web",
    title: "Linear",
    description: "Dashboard inspiration. You liked the clean side navigation, shortcuts helpers, and dark aesthetics.",
    source: "linear.app",
    timeAgo: "2 min ago",
    tags: ["Design", "SaaS"],
    favicon: "L"
  },
  {
    id: "mem-2",
    type: "video",
    title: "Building a SaaS in 2026",
    description: "Under the hood of monorepos, vector indexers, and local-first billing configurations.",
    source: "youtube.com/watch?v=saas2026",
    timeAgo: "Yesterday",
    tags: ["Development", "SaaS"],
    duration: "18:42",
    platform: "YouTube"
  },
  {
    id: "mem-3",
    type: "note",
    title: "Onboarding concepts",
    description: "What if bookmarks could understand why we save things? Ask the user what they save most during signup.",
    source: "Personal Note",
    timeAgo: "2 days ago",
    tags: ["Productivity", "Idea"]
  },
  {
    id: "mem-4",
    type: "image",
    title: "Dashboard mockup concept",
    description: "OCR Extracted: 'Settings', 'Profile'. Rounded cards layout with double-border aesthetic.",
    source: "screenshot_pricing.png",
    timeAgo: "4 days ago",
    tags: ["Design", "SaaS"]
  },
  {
    id: "mem-5",
    type: "document",
    title: "Vector DB Comparison",
    description: "A summary comparing indexing latencies and throughput of pgvector vs Pinecone vs Qdrant.",
    source: "vector_db_sheet.pdf",
    timeAgo: "1 week ago",
    tags: ["AI", "Research"],
    fileType: "PDF"
  }
];

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "all-saves" | "settings" | "help">("home");

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

  // Search shortcuts
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
      // Mock parsing URL to generate previews
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
        timeAgo: "Just now",
        tags: suggestedTags
      };

      setMemories(prev => [newMem, ...prev]);
      setIsSaving(false);
      setSaveStep(3);
    }, 800);
  };

  const handleDelete = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const triggerSearchSample = (query: string) => {
    setSearchQuery(query);
    setActiveTab("all-saves");
  };

  const filteredMemories = memories.filter((mem) => {
    if (!searchQuery) return true;
    return (
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
      
      {/* 2. LEFT SIDEBAR */}
      <aside className="w-64 border-r border-border/60 bg-muted/15 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-7">
          
          {/* Logo wordmark + icon */}
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

          {/* Collections (AI Generated Folders) */}
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
                onClick={() => { triggerSearchSample(col.tag); }}
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
                onClick={() => { triggerSearchSample(sm.query); }}
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

      {/* 3. TOP HEADER / APP BODY CONTAINER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-border/40 px-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Good morning, Subham</h2>
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

            {/* Mobile Sidebar Hamburger sheet mock */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-full border border-border/60 md:flex"
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
              
              {/* Headline */}
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Good morning, Subham
                </h1>
                <p className="text-xs text-muted-foreground">
                  Here's what's happening in your memory.
                </p>
              </div>

              {/* 4. MAIN SEARCH BOX */}
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

                {/* Try Concept Search Links */}
                <div className="text-[11px] text-muted-foreground space-y-1.5 px-1 font-medium">
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

              {/* 5. QUICK CAPTURE PANEL */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Save something</h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
                  
                  {/* Link */}
                  <button 
                    onClick={() => handleOpenSaveModal("web")}
                    className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs hover:border-primary/20 transition-all duration-300 text-left group"
                  >
                    <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[110px] select-none">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                        <LinkIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Save Link</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Paste a URL</p>
                      </div>
                    </div>
                  </button>

                  {/* Note */}
                  <button 
                    onClick={() => handleOpenSaveModal("note")}
                    className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs hover:border-primary/20 transition-all duration-300 text-left group"
                  >
                    <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[110px] select-none">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                        <StickyNote className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Quick Note</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Capture a thought</p>
                      </div>
                    </div>
                  </button>

                  {/* Upload */}
                  <button 
                    onClick={() => handleOpenSaveModal("idea")}
                    className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs hover:border-primary/20 transition-all duration-300 text-left group"
                  >
                    <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[110px] select-none">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                        <Upload className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Upload</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Image or file</p>
                      </div>
                    </div>
                  </button>

                  {/* Anything */}
                  <button 
                    onClick={() => handleOpenSaveModal("web")}
                    className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs hover:border-primary/20 transition-all duration-300 text-left group"
                  >
                    <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[110px] select-none">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Save Anything</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">From extension</p>
                      </div>
                    </div>
                  </button>

                </div>
              </div>

              {/* 6. RECENTLY SAVED */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Recently saved</h3>
                  <button 
                    onClick={() => setActiveTab("all-saves")}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                  >
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Cards row (Double Bordered Cards!) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memories.slice(0, 3).map((item) => {
                    let TypeIcon = Globe;
                    if (item.type === "video") TypeIcon = Video;
                    if (item.type === "note") TypeIcon = StickyNote;

                    return (
                      <div 
                        key={item.id}
                        className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:border-primary/20 transition-all duration-300 group"
                      >
                        <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[170px] space-y-4">
                          
                          {/* Visual thumbnail placeholder */}
                          <div className="relative aspect-video w-full rounded-lg bg-muted border border-border/30 overflow-hidden flex items-center justify-center text-[10px] text-muted-foreground font-bold select-none">
                            {item.type === "video" ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <Video className="h-6 w-6 text-red-500" />
                                <span>YouTube Thumbnail ({item.duration})</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1.5">
                                <Globe className="h-6 w-6 text-primary" />
                                <span>Website Preview</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 pt-2">
                            <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-border/20">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <span key={tag} className="text-[7.5px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-[9px] text-muted-foreground font-mono">{item.timeAgo}</span>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 8. YOUR MEMORY AI CONNECTIONS */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Your memory</h3>
                  <p className="text-[10px] text-muted-foreground">
                    Memora found some connections across your recent saves.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  
                  {/* Connection Card 1 */}
                  <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
                    <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[140px] space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">🎨 Design inspiration</h4>
                        <span className="text-[9px] text-primary font-bold block mt-1">18 saved items</span>
                        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                          Landing pages &middot; Dashboards &middot; SaaS UI concepts
                        </p>
                      </div>
                      <button 
                        onClick={() => triggerSearchSample("Design")}
                        className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline"
                      >
                        Explore <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Connection Card 2 */}
                  <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
                    <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[140px] space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">💻 React Resources</h4>
                        <span className="text-[9px] text-primary font-bold block mt-1">12 resources</span>
                        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                          Authentication &middot; Next.js components &middot; APIs setup
                        </p>
                      </div>
                      <button 
                        onClick={() => triggerSearchSample("React")}
                        className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline"
                      >
                        Explore <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* 9. AI WORTH REVISITING */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Worth revisiting</h3>
                  <p className="text-[10px] text-muted-foreground">
                    Memora surfaces things you've saved that may be useful now.
                  </p>
                </div>

                <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs max-w-xl">
                  <div className="p-5 rounded-lg border border-border/75 bg-card space-y-4">
                    <span className="text-[8px] font-mono text-primary font-bold bg-primary/10 border border-primary/10 px-2 py-0.5 rounded">
                      YOU SAVED THIS 3 MONTHS AGO
                    </span>
                    
                    <div className="space-y-1 pt-1">
                      <h4 className="text-xs font-bold text-foreground">"Designing better SaaS onboarding"</h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        You recently saved 4 onboarding reference layouts. This related resource might contain inspiration.
                      </p>
                    </div>

                    <button 
                      onClick={() => triggerSearchSample("Design")}
                      className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline"
                    >
                      Open memory <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 10. CONTINUE EXPLORING */}
              <div className="space-y-4 pt-4 border-t border-border/20">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Continue exploring
                </h4>

                <div className="flex flex-wrap gap-2 font-mono text-[9px]">
                  {["Design", "AI", "Development", "SaaS", "Inspiration", "Learning"].map((t) => (
                    <button
                      key={t}
                      onClick={() => triggerSearchSample(t)}
                      className="px-3 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ALL SAVES LIST VIEW */}
          {activeTab === "all-saves" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <div>
                  <h1 className="text-xl font-bold uppercase tracking-tight">All Saved Memories</h1>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Showing {filteredMemories.length} item{filteredMemories.length === 1 ? "" : "s"} matches.
                  </p>
                </div>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {filteredMemories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMemories.map((mem) => (
                    <div 
                      key={mem.id}
                      className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:border-primary/20 transition-all duration-300 group"
                    >
                      <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[160px] space-y-4">
                        <div className="space-y-2">
                          <span className="text-[8px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded uppercase">
                            {mem.type}
                          </span>
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                            {mem.title}
                          </h4>
                          <span className="text-[9px] text-muted-foreground block font-mono truncate">{mem.source}</span>
                          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                            {mem.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/20">
                          <div className="flex flex-wrap gap-1">
                            {mem.tags.map((tag) => (
                              <span key={tag} className="text-[7.5px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button 
                            onClick={() => handleDelete(mem.id)}
                            className="h-7 w-7 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xs text-muted-foreground">No matches found. Try searching for other topics.</p>
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

      {/* 11. SAVE MODAL (CENTRED COMMAND MODAL) */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-border/20 pb-2">
              <span className="text-xs font-bold text-foreground">Save to Memora</span>
              <button onClick={() => setSaveModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step 1: Input URL / Write something */}
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

                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full h-11 rounded-full font-bold text-xs bg-primary text-white"
                >
                  {isSaving ? "Analyzing..." : "Continue"}
                </Button>
              </form>
            )}

            {/* Step 2: Preview & Confirm Save */}
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

                <Button 
                  onClick={handleConfirmSave} 
                  disabled={isSaving}
                  className="w-full h-11 rounded-full font-bold text-xs bg-primary text-white"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}

            {/* Step 3: Success Moment */}
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
                  <Button 
                    onClick={() => { setSaveModalOpen(false); setActiveTab("all-saves"); }} 
                    className="flex-1 h-10 rounded-full text-xs font-bold bg-primary text-white"
                  >
                    View memory &rarr;
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 13. SEARCH EXPERIENCE (⌘K COMMAND CENTER MODAL) */}
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

            {/* List */}
            {!searchQuery ? (
              <div className="space-y-3.5 text-xs">
                <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Recent searches
                </h4>
                
                <div className="space-y-2 text-muted-foreground">
                  {[
                    { text: "React resources", query: "React" },
                    { text: "SaaS landing pages", query: "SaaS" },
                    { text: "AI tools", query: "AI" }
                  ].map((s, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { triggerSearchSample(s.query); setSearchModalOpen(false); }}
                      className="w-full text-left py-1 hover:text-foreground flex items-center gap-2 font-medium"
                    >
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
                  <span className="text-[9px] text-muted-foreground font-semibold">
                    {filteredMemories.length} memories found
                  </span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {filteredMemories.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { triggerSearchSample(m.title); setSearchModalOpen(false); }}
                      className="w-full text-left p-2.5 hover:bg-muted/60 border border-border/40 rounded-lg flex items-center justify-between text-xs font-semibold text-foreground group transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[8px] font-mono uppercase bg-primary/10 text-primary px-1.5 rounded shrink-0">
                          {m.type}
                        </span>
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
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
