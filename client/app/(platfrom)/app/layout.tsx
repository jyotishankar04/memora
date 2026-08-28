"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Sparkles, Globe, Video, Image as ImageIcon, Code, FileText, StickyNote, Plus, Search, 
  Settings, HelpCircle, Bell, ArrowRight, X, Moon, Sun, Trash2, FolderOpen, 
  Compass, Check, Link as LinkIcon, Upload, ArrowUpRight, ChevronRight, ChevronDown, 
  MoreHorizontal, Star, MessageSquare, Grid, List, Copy, Archive, Edit, ExternalLink, ArrowLeft,
  FolderPlus, Heart, Clock, Compass as CompassIcon, BarChart2, ShieldAlert
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout, type AuthUser } from "@/lib/auth";
import { UserAvatar, UserProvider, formatPlan } from "@/context/UserContext";
import { UpgradeCard } from "@/components/upgrade-card";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

// Memory Data Type
export interface Memory {
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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Auth gate: the access token lives in an httpOnly cookie the backend set,
  // so this client can't check for it locally — it asks /auth/me instead.
  // Redirects to login if that fails, or to /onboard if the signed-in user
  // hasn't finished the onboarding questionnaire yet (covers direct
  // navigation to /app, not just the post-OAuth-login redirect).
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        if (!user.onboardingCompleted) {
          router.replace("/onboard");
          return;
        }
        setCurrentUser(user);
        setAuthChecked(true);
      } catch {
        router.replace("/auth/login");
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    logout().finally(() => {
      setUserDropdownOpen(false);
      router.push("/");
    });
  };

  // Modals
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveStep, setSaveStep] = useState<1 | 2 | 3>(1);
  const [inputUrl, setInputUrl] = useState("");
  const [savingType, setSavingType] = useState<"web" | "note" | "video" | "idea">("web");
  const [detectedTitle, setDetectedTitle] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>(["Design", "SaaS", "Inspiration"]);
  const [isSaving, setIsSaving] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Upgrade popup: dismissing it shrinks the card down into the user button,
  // which picks up a highlighted border right as the card fades out.
  const [showUpgradeCard, setShowUpgradeCard] = useState(true);
  const [isUpgradeCardClosing, setIsUpgradeCardClosing] = useState(false);
  const [showUpgradeHint, setShowUpgradeHint] = useState(false);

  const dismissUpgradeCard = () => {
    setIsUpgradeCardClosing(true);
    setShowUpgradeHint(true);
    setTimeout(() => setShowUpgradeCard(false), 350);
  };

  // Command palette search query
  const [commandQuery, setCommandQuery] = useState("");

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!authChecked || !currentUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
      </div>
    );
  }

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
      setIsSaving(false);
      setSaveStep(3);
    }, 800);
  };

  return (
    <UserProvider user={currentUser} setUser={setCurrentUser}>
    <div className="flex h-screen w-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">

      {/* 1. DESKTOP SIDEBAR */}
      <aside className="w-60 border-r border-border/60 bg-muted/15 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-5 space-y-6 overflow-y-auto flex-1 min-h-0">
          
          {/* Header */}
          <Link href="/app" className="flex items-center gap-2 px-1 hover:opacity-85 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-foreground text-background font-semibold text-xs shrink-0">
              M
            </div>
            <span className="text-sm font-semibold tracking-[-0.03em]">memora</span>
          </Link>

          {/* Quick Capture CTA */}
          <Button 
            onClick={() => { setSaveStep(1); setSaveModalOpen(true); }}
            className="w-full h-10 rounded-full font-bold text-xs bg-primary text-white flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Quick Capture
          </Button>

          {/* Primary Navigation */}
          <div className="space-y-0.5">
            {[
              { label: "Home", href: "/app", icon: Compass },
              { label: "Memories", href: "/app/memories", icon: FolderOpen },
              { label: "Search", href: "/app/search", icon: Search },
              { label: "Ask Memora", href: "/app/ask", icon: Sparkles }
            ].map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition-colors",
                    active ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Collections */}
          <div className="space-y-1.5 pt-4 border-t border-border/30">
            <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">
              Collections
            </h4>
            {[
              { label: "SaaS Inspiration", href: "/app/collections/saas" },
              { label: "AI Research", href: "/app/collections/ai" },
              { label: "Design", href: "/app/collections/design" },
              { label: "Learning", href: "/app/collections/learning" }
            ].map((col) => (
              <Link
                key={col.href}
                href={col.href}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg flex items-center justify-between transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",
                  pathname === col.href ? "text-primary bg-primary/5 font-semibold" : ""
                )}
              >
                <span className="truncate pr-2">{col.label}</span>
                <ChevronRight className="h-3 w-3 opacity-30" />
              </Link>
            ))}
            
            <Link 
              href="/app/collections"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 text-primary hover:underline"
            >
              <Plus className="h-3 w-3" /> New collection
            </Link>
          </div>

          {/* Secondary Navigation */}
          <div className="space-y-0.5 pt-4 border-t border-border/30">
            {[
              { label: "Favorites", href: "/app/favorites", icon: Heart },
              { label: "Recent", href: "/app/recent", icon: Clock },
              { label: "Explore", href: "/app/explore", icon: CompassIcon },
              { label: "Memory Graph", href: "/app/graph", icon: BarChart2 }
            ].map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2.5 transition-colors",
                    active ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

        </div>

        {/* Sidebar Bottom user profile */}
        <div className="p-4 border-t border-border/40 relative">

          {showUpgradeCard && !currentUser.roles.includes("pro_user") && !currentUser.roles.includes("admin") && (
            <div
              className={cn(
                "absolute inset-x-4 bottom-full mb-3 origin-bottom transition-all duration-[350ms] ease-in-out",
                isUpgradeCardClosing ? "opacity-0 scale-75 translate-y-3" : "opacity-100 scale-100 translate-y-0"
              )}
            >
              <UpgradeCard onDismiss={dismissUpgradeCard} />
            </div>
          )}

          {/* User initials block */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 -mx-1 rounded-xl text-left hover:opacity-85 transition-all duration-500",
                showUpgradeHint && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
              )}
            >
              <div className="flex items-center gap-2.5">
                <UserAvatar user={currentUser} className="h-8 w-8 text-xs" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{currentUser.name ?? currentUser.email}</p>
                  <p className="text-[9px] text-muted-foreground font-mono leading-none">{formatPlan(currentUser.roles)}</p>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
            </button>

            {showUpgradeHint && (
              <Link
                href="/app/settings/billing"
                className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-white text-[8px] font-bold uppercase tracking-wide shadow-sm z-10 animate-in fade-in slide-in-from-top-1 duration-500 hover:bg-primary/90"
              >
                Upgrade
              </Link>
            )}
          </div>

          {/* User profile popup menu */}
          {userDropdownOpen && (
            <div className="absolute left-4 right-4 bottom-16 bg-card border border-border rounded-xl shadow-xl py-1 z-50 text-[10px] font-bold text-foreground">
              <div className="px-3 py-2 border-b border-border/20">
                <p className="text-[10px] text-foreground">{currentUser.name ?? currentUser.email}</p>
                <p className="text-[9px] text-muted-foreground font-mono font-medium">{formatPlan(currentUser.roles)}</p>
              </div>
              
              <Link href="/app/settings" onClick={() => setUserDropdownOpen(false)} className="w-full px-3 py-2 hover:bg-muted text-left flex items-center gap-2">
                <Settings className="h-3.5 w-3.5 opacity-60" />
                <span>Settings</span>
              </Link>
              
              <Link href="/app/settings/billing" onClick={() => setUserDropdownOpen(false)} className="w-full px-3 py-2 hover:bg-muted text-left flex items-center gap-2">
                <BarChart2 className="h-3.5 w-3.5 opacity-60" />
                <span>Keyboard shortcuts</span>
              </Link>
              
              <Link href="/app/help" onClick={() => setUserDropdownOpen(false)} className="w-full px-3 py-2 hover:bg-muted text-left flex items-center gap-2">
                <HelpCircle className="h-3.5 w-3.5 opacity-60" />
                <span>Help & Docs</span>
              </Link>

              <hr className="border-border/20 my-1" />

              <button onClick={handleLogout} className="w-full px-3 py-2 hover:bg-red-500/10 text-red-500 text-left flex items-center gap-2">
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* 2. TOPBAR AND MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Topbar Header */}
        <header className="h-16 border-b border-border/40 px-6 flex items-center justify-between shrink-0 hidden md:flex">
          
          {/* Global search trigger */}
          <button 
            onClick={() => setSearchModalOpen(true)}
            className="w-80 h-9 px-3 rounded-full border border-border/60 bg-muted/20 text-xs text-muted-foreground flex items-center justify-between hover:bg-muted transition-all select-none"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-primary" />
              <span>Search your memory...</span>
            </div>
            <kbd className="px-1.5 py-0.5 border border-border bg-muted rounded text-[9px] font-mono">⌘K</kbd>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/app/notifications" className="h-8 w-8 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-primary rounded-full" />
            </Link>
            
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link href="/app/settings">
              <UserAvatar user={currentUser} className="h-8 w-8 text-xs border border-primary/20" />
            </Link>
          </div>

        </header>

        {/* Main nested content render */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>

        {/* 3. MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="fixed bottom-0 left-0 right-0 h-14 bg-card border-t border-border flex items-center justify-around z-40 md:hidden px-4">
          <Link href="/app" className={cn("flex flex-col items-center gap-0.5 text-[9px] font-bold", pathname === "/app" ? "text-primary" : "text-muted-foreground")}>
            <Compass className="h-5 w-5" />
            <span>Home</span>
          </Link>

          <Link href="/app/search" className={cn("flex flex-col items-center gap-0.5 text-[9px] font-bold", pathname === "/app/search" ? "text-primary" : "text-muted-foreground")}>
            <Search className="h-5 w-5" />
            <span>Search</span>
          </Link>

          {/* Quick Capture Button (Prominent!) */}
          <button 
            onClick={() => { setSaveStep(1); setSaveModalOpen(true); }}
            className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg -translate-y-2 select-none"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </button>

          <Link href="/app/ask" className={cn("flex flex-col items-center gap-0.5 text-[9px] font-bold", pathname === "/app/ask" ? "text-primary" : "text-muted-foreground")}>
            <Sparkles className="h-5 w-5" />
            <span>Ask</span>
          </Link>

          <Link href="/app/settings" className={cn("flex flex-col items-center gap-0.5 text-[9px] font-bold", pathname.startsWith("/app/settings") ? "text-primary" : "text-muted-foreground")}>
            <Settings className="h-5 w-5" />
            <span>You</span>
          </Link>
        </nav>

      </div>

      {/* GLOBAL QUICK CAPTURE MODAL */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-border/20 pb-2">
              <span className="text-xs font-bold text-foreground">Save something</span>
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
                    placeholder="Paste URL or write something..."
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

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Collection</span>
                  <select className="w-full bg-background border border-input rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none">
                    <option>None</option>
                    <option>SaaS Inspiration</option>
                    <option>AI Research</option>
                    <option>Design</option>
                    <option>Learning</option>
                  </select>
                </div>

                <Button type="submit" disabled={isSaving} className="w-full h-11 rounded-full font-bold text-xs bg-primary text-white">
                  {isSaving ? "Analyzing..." : "Save Memory"}
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
                </div>

                <div className="pt-4 flex gap-2">
                  <Button onClick={() => { setSaveModalOpen(false); router.push("/app/memories"); }} className="flex-1 h-10 rounded-full text-xs font-bold bg-primary text-white">
                    View memory &rarr;
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* GLOBAL SEARCH COMMAND PALETTE (⌘K) */}
      <CommandDialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
        <CommandInput 
          placeholder="Search or jump to..." 
          value={commandQuery}
          onValueChange={setCommandQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => { setSearchModalOpen(false); setSaveStep(1); setSaveModalOpen(true); }}>
              <Plus className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span>Save a memory</span>
            </CommandItem>
            <CommandItem onSelect={() => { setSearchModalOpen(false); router.push("/app/ask"); }}>
              <Sparkles className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span>Ask Memora</span>
            </CommandItem>
            <CommandItem onSelect={() => { setSearchModalOpen(false); router.push("/app/collections"); }}>
              <FolderPlus className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span>Create collection</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Go to">
            <CommandItem onSelect={() => { setSearchModalOpen(false); router.push("/app"); }}>
              <Compass className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span>Go to Home</span>
            </CommandItem>
            <CommandItem onSelect={() => { setSearchModalOpen(false); router.push("/app/memories"); }}>
              <FolderOpen className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span>Go to Memories</span>
            </CommandItem>
            <CommandItem onSelect={() => { setSearchModalOpen(false); router.push("/app/favorites"); }}>
              <Heart className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span>Go to Favorites</span>
            </CommandItem>
            <CommandItem onSelect={() => { setSearchModalOpen(false); router.push("/app/settings"); }}>
              <Settings className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span>Go to Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Global CSS animations styles */}
      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
    </UserProvider>
  );
}
