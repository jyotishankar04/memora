"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Sparkles, Plus, Search,
  Settings, HelpCircle, Bell, X, Moon, Sun, FolderOpen,
  Compass, Check, Link as LinkIcon, ChevronRight, ChevronDown,
  FolderPlus, Heart, Clock, Compass as CompassIcon, BarChart2, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout, type AuthUser } from "@/lib/auth";
import { UserAvatar, UserProvider, useUser, formatPlan } from "@/context/UserContext";
import { useMemories } from "@/context/MemoryContext";
import { UpgradeCard } from "@/components/upgrade-card";
import type { MemoryType } from "@/types/memory";
import { uploadFile, type UploadedFile } from "@/lib/uploads";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

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

  if (!authChecked || !currentUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <UserProvider user={currentUser} setUser={setCurrentUser}>
      <AppShell>{children}</AppShell>
    </UserProvider>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user: currentUser } = useUser();
  const { collections, create } = useMemories();

  const handleLogout = () => {
    logout().finally(() => {
      setUserDropdownOpen(false);
      router.push("/");
    });
  };

  // Modals
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveStep, setSaveStep] = useState<1 | "done">(1);
  const [captureTitle, setCaptureTitle] = useState("");
  const [captureUrl, setCaptureUrl] = useState("");
  const [captureContent, setCaptureContent] = useState("");
  const [captureType, setCaptureType] = useState<MemoryType>("web");
  const [captureCollectionId, setCaptureCollectionId] = useState("");
  const [captureAttachment, setCaptureAttachment] = useState<UploadedFile | null>(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [savedTitle, setSavedTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const openCaptureModal = () => {
    setSaveStep(1);
    setCaptureTitle("");
    setCaptureUrl("");
    setCaptureContent("");
    setCaptureType("web");
    setCaptureCollectionId("");
    setCaptureAttachment(null);
    setAttachmentError(null);
    setSaveError(null);
    setSaveModalOpen(true);
  };

  const handleAttachmentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAttachment(true);
    setAttachmentError(null);
    try {
      const uploaded = await uploadFile(file);
      setCaptureAttachment(uploaded);
      if (!captureTitle.trim()) setCaptureTitle(file.name.replace(/\.[^/.]+$/, ""));
    } catch (err) {
      setAttachmentError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const handleCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureTitle.trim()) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const memory = await create({
        type: captureType,
        title: captureTitle.trim(),
        url: captureType === "web" || captureType === "video" ? captureUrl.trim() || undefined : undefined,
        content: captureType === "note" ? captureContent.trim() || undefined : undefined,
        collectionIds: captureCollectionId ? [captureCollectionId] : undefined,
        attachments: captureAttachment ? [captureAttachment] : undefined,
      });
      setSavedTitle(memory.title);
      setSaveStep("done");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save that memory.");
    } finally {
      setIsSaving(false);
    }
  };

  // Upgrade popup: dismissing it shrinks the card down into the user button,
  // which picks up a highlighted border + badge right as the card fades out.
  // Once dismissed, hovering that badge (or the reopened card) brings the
  // card back; moving off either closes it again after a short debounce so
  // crossing the gap between badge and card doesn't flicker it shut.
  const [showUpgradeCard, setShowUpgradeCard] = useState(true);
  const [isUpgradeCardClosing, setIsUpgradeCardClosing] = useState(false);
  const [upgradeCardDismissed, setUpgradeCardDismissed] = useState(false);
  const upgradeHoverCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissUpgradeCard = () => {
    setIsUpgradeCardClosing(true);
    setUpgradeCardDismissed(true);
    setTimeout(() => setShowUpgradeCard(false), 350);
  };

  const openUpgradeCardOnHover = () => {
    if (!upgradeCardDismissed) return;
    if (upgradeHoverCloseTimeout.current) {
      clearTimeout(upgradeHoverCloseTimeout.current);
      upgradeHoverCloseTimeout.current = null;
    }
    setIsUpgradeCardClosing(false);
    setShowUpgradeCard(true);
  };

  const scheduleUpgradeCardHoverClose = () => {
    if (!upgradeCardDismissed) return;
    upgradeHoverCloseTimeout.current = setTimeout(() => {
      setIsUpgradeCardClosing(true);
      setTimeout(() => setShowUpgradeCard(false), 350);
    }, 150);
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

  const isFreeUser = !currentUser.roles.includes("pro_user") && !currentUser.roles.includes("admin");

  return (
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
            onClick={openCaptureModal}
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
            {collections.map((col) => {
              const href = `/app/collections/${col.id}`;
              return (
                <Link
                  key={col.id}
                  href={href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg flex items-center justify-between transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",
                    pathname === href ? "text-primary bg-primary/5 font-semibold" : ""
                  )}
                >
                  <span className="truncate pr-2 flex items-center gap-1.5">
                    <span>{col.icon}</span>
                    {col.name}
                  </span>
                  <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              );
            })}

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

          {showUpgradeCard && isFreeUser && (
            <div
              onMouseEnter={openUpgradeCardOnHover}
              onMouseLeave={scheduleUpgradeCardHoverClose}
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
                upgradeCardDismissed && isFreeUser && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
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

            {upgradeCardDismissed && isFreeUser && (
              <Link
                href="/app/settings/billing"
                onMouseEnter={openUpgradeCardOnHover}
                onMouseLeave={scheduleUpgradeCardHoverClose}
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
            onClick={openCaptureModal}
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
              <form onSubmit={handleCaptureSubmit} className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">What are you saving?</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["web", "note", "video", "image", "document"] as MemoryType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setCaptureType(t); setCaptureAttachment(null); setAttachmentError(null); }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[9px] font-bold uppercase border transition-all",
                          captureType === t
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-muted/40 border-border/60 text-muted-foreground"
                        )}
                      >
                        {t === "web" ? "Website" : t}
                      </button>
                    ))}
                  </div>
                </div>

                {(captureType === "web" || captureType === "video") && (
                  <div className="relative flex items-center">
                    <LinkIcon className="absolute left-4 h-4.5 w-4.5 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="Paste a URL..."
                      value={captureUrl}
                      onChange={(e) => setCaptureUrl(e.target.value)}
                      className="w-full bg-background border border-input rounded-xl pl-11 pr-4 py-3.5 text-xs text-foreground focus:outline-none focus:border-primary/80"
                    />
                  </div>
                )}

                {(captureType === "image" || captureType === "document") && (
                  <div className="space-y-1.5">
                    <input
                      type="file"
                      accept={captureType === "image" ? "image/png,image/jpeg,image/webp,image/gif" : "application/pdf"}
                      onChange={handleAttachmentSelect}
                      className="w-full bg-background border border-input rounded-xl px-4 py-3 text-xs text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-[9px] file:font-bold file:uppercase file:text-primary"
                    />
                    {isUploadingAttachment && <p className="text-[10px] text-muted-foreground">Uploading&hellip;</p>}
                    {captureAttachment && !isUploadingAttachment && (
                      <div className="flex items-center gap-2.5 p-2 rounded-lg border border-border/60 bg-muted/20">
                        {captureType === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable-domain preview image
                          <img
                            src={captureAttachment.fileUrl}
                            alt=""
                            className="h-10 w-10 rounded-md object-cover border border-border/40 shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                        )}
                        <p className="text-[10px] text-emerald-600 font-semibold">
                          Uploaded &middot; {(captureAttachment.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    )}
                    {attachmentError && <p className="text-[10px] text-red-500">{attachmentError}</p>}
                  </div>
                )}

                <input
                  type="text"
                  required
                  placeholder="Give it a title"
                  value={captureTitle}
                  onChange={(e) => setCaptureTitle(e.target.value)}
                  className="w-full bg-background border border-input rounded-xl px-4 py-3.5 text-xs text-foreground focus:outline-none focus:border-primary/80"
                />

                {captureType === "note" && (
                  <textarea
                    placeholder="Write your note..."
                    value={captureContent}
                    onChange={(e) => setCaptureContent(e.target.value)}
                    rows={4}
                    className="w-full bg-background border border-input rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary/80 resize-none"
                  />
                )}

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Collection</span>
                  <select
                    value={captureCollectionId}
                    onChange={(e) => setCaptureCollectionId(e.target.value)}
                    className="w-full bg-background border border-input rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="">None</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>

                {saveError && <p className="text-[10px] text-red-500">{saveError}</p>}

                <Button type="submit" disabled={isSaving || isUploadingAttachment} className="w-full h-11 rounded-full font-bold text-xs bg-primary text-white">
                  {isSaving ? "Saving..." : "Save Memory"}
                </Button>
              </form>
            )}

            {saveStep === "done" && (
              <div className="text-center py-6 space-y-4">
                <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest block">Saved to Memora</span>
                  <h4 className="text-xs font-bold text-foreground">{savedTitle}</h4>
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
            <CommandItem onSelect={() => { setSearchModalOpen(false); openCaptureModal(); }}>
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
  );
}
