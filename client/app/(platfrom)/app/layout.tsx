"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles, Plus, Search,
  Settings, HelpCircle, Bell, X, Moon, Sun, FolderOpen,
  Compass, Check, ChevronRight, ChevronDown,
  FolderPlus, Heart, Clock, Compass as CompassIcon, BarChart2, FileText,
  Paperclip, UploadCloud, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiError, getCurrentUser, logout, type AuthUser } from "@/lib/auth";
import { UserAvatar, UserProvider, useUser, formatPlan } from "@/context/UserContext";
import { useMemories } from "@/context/MemoryContext";
import { UpgradeCard } from "@/components/upgrade-card";
import { uploadFile, type UploadedFile } from "@/lib/uploads";
import { detectMemoryType, deriveTitle } from "@/lib/detect-memory-type";
import { MEMORY_TYPE_ICONS } from "@/lib/memory-icons";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@/components/ui/attachment";

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
    let cancelled = false;

    // Transient failures (dev server mid-restart, a dropped connection) look
    // identical to "not logged in" from a single failed fetch — only a real
    // 401 from the server means the session is actually invalid. Anything
    // else gets a few retries before giving up, so a routine `tsx watch`
    // restart doesn't boot the user back to the login page.
    async function checkAuth(attempt = 0) {
      try {
        const user = await getCurrentUser();
        if (cancelled) return;
        if (!user.onboardingCompleted) {
          router.replace("/onboard");
          return;
        }
        setCurrentUser(user);
        setAuthChecked(true);
      } catch (err) {
        if (cancelled) return;
        const isUnauthorized = err instanceof ApiError && err.status === 401;
        if (!isUnauthorized && attempt < 3) {
          setTimeout(() => checkAuth(attempt + 1), 800);
          return;
        }
        router.replace("/auth/login");
      }
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
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
  const [captureText, setCaptureText] = useState("");
  const [captureCollectionId, setCaptureCollectionId] = useState("");
  const [captureAttachment, setCaptureAttachment] = useState<UploadedFile | null>(null);
  const [captureAttachmentName, setCaptureAttachmentName] = useState<string | null>(null);
  const [captureAttachmentMimeType, setCaptureAttachmentMimeType] = useState<string | null>(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedTitle, setSavedTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  // The single source of truth for "what kind of memory is this" — rule-based
  // for now, but isolated in lib/detect-memory-type.ts so it's a one-place
  // swap for a real AI classifier later.
  const detectedType = useMemo(
    () => detectMemoryType({ text: captureText, attachmentMimeType: captureAttachmentMimeType }),
    [captureText, captureAttachmentMimeType],
  );
  const DetectedTypeIcon = MEMORY_TYPE_ICONS[detectedType];
  const detectedTypeLabel = detectedType === "web" ? "Website" : detectedType;

  const openCaptureModal = () => {
    setSaveStep(1);
    setCaptureTitle("");
    setCaptureText("");
    setCaptureCollectionId("");
    setCaptureAttachment(null);
    setCaptureAttachmentName(null);
    setCaptureAttachmentMimeType(null);
    setAttachmentError(null);
    setSaveError(null);
    setIsDraggingOver(false);
    dragCounter.current = 0;
    setSaveModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    // Set the name/mime immediately so the Attachment preview (with its
    // shimmer) can show the real filename and the right icon while the
    // upload is still in flight, not just once it resolves.
    setCaptureAttachmentName(file.name);
    setCaptureAttachmentMimeType(file.type);
    setIsUploadingAttachment(true);
    setAttachmentError(null);
    try {
      const uploaded = await uploadFile(file);
      setCaptureAttachment(uploaded);
    } catch (err) {
      setAttachmentError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void handleFileUpload(file);
  };

  const clearAttachment = () => {
    setCaptureAttachment(null);
    setCaptureAttachmentName(null);
    setCaptureAttachmentMimeType(null);
    setAttachmentError(null);
  };

  const handleCapturePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) void handleFileUpload(file);
        return;
      }
    }
  };

  const handleCaptureDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDraggingOver(true);
  };

  const handleCaptureDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) setIsDraggingOver(false);
  };

  const handleCaptureDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFileUpload(file);
  };

  const handleCaptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureText.trim() && !captureAttachment) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const title = captureTitle.trim() || deriveTitle(detectedType, captureText, captureAttachmentName);
      const memory = await create({
        type: detectedType,
        title,
        url: detectedType === "web" || detectedType === "video" ? captureText.trim() || undefined : undefined,
        // For a note, the whole field is the content. For an attachment
        // (image/document), the field is free for a caption instead — an
        // attachment never consumes captureText, so whatever's typed there
        // should still be saved alongside the file rather than dropped.
        content: detectedType === "note" || captureAttachment ? captureText.trim() || undefined : undefined,
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

      {/* Ambient primary-color glow — decorative, sits behind everything else */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-[110px] animate-ambient-flash" />
        <div className="absolute -bottom-48 -right-24 h-[30rem] w-[30rem] rounded-full bg-primary/[0.07] blur-[130px] animate-ambient-flash [animation-delay:-9s]" />
      </div>

      {/* 1. DESKTOP SIDEBAR */}
      <aside className="relative z-10 w-60 border-r border-border/60 bg-muted/15 flex flex-col justify-between shrink-0 hidden md:flex">
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
              { label: "Collections", href: "/app/collections", icon: Layers },
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
            <button
              type="button"
              onClick={() => setCollectionsOpen((open) => !open)}
              className="w-full flex items-center justify-between px-3 mb-1 text-[9px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
            >
              <span>Collections</span>
              <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", collectionsOpen ? "" : "-rotate-90")} />
            </button>

            <AnimatePresence initial={false}>
              {collectionsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="space-y-1.5 overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
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
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

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
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-5 animate-scale-up">

            <div className="flex items-center justify-between border-b border-border/20 pb-2">
              <span className="text-xs font-bold text-foreground">Save to Memora</span>
              <button onClick={() => setSaveModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {saveStep === 1 && (
              <form onSubmit={handleCaptureSubmit} className="space-y-4">

                {/* Unified capture surface — paste a link, paste/drop a file, or just type */}
                <div className="relative">
                  {isDraggingOver && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-background/90 backdrop-blur-sm">
                      <UploadCloud className="h-5 w-5 text-primary" />
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wide">Drop to attach</p>
                    </div>
                  )}

                  <InputGroup
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={handleCaptureDragEnter}
                    onDragLeave={handleCaptureDragLeave}
                    onDrop={handleCaptureDrop}
                    className={cn(
                      "h-auto rounded-2xl border-2 bg-muted/10 transition-colors",
                      isDraggingOver ? "border-primary/70" : "border-border/60"
                    )}
                  >
                    <InputGroupTextarea
                      autoFocus
                      value={captureText}
                      onChange={(e) => setCaptureText(e.target.value)}
                      onPaste={handleCapturePaste}
                      placeholder="Paste a link, drop a file, or start typing a note..."
                      rows={captureAttachment || isUploadingAttachment ? 3 : 5}
                      className="px-4 py-3.5 text-sm placeholder:text-muted-foreground/70"
                    />

                    {(isUploadingAttachment || captureAttachment || attachmentError) && (
                      <InputGroupAddon align="block-start" className="w-full justify-start px-3 pb-1">
                        <Attachment
                          state={attachmentError ? "error" : isUploadingAttachment ? "uploading" : "done"}
                          size="sm"
                          className="w-full max-w-full border-border/60 bg-background/70"
                        >
                          <AttachmentMedia variant={captureAttachmentMimeType?.startsWith("image/") ? "image" : "icon"}>
                            {captureAttachmentMimeType?.startsWith("image/") && captureAttachment ? (
                              // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable-domain preview image
                              <img src={captureAttachment.fileUrl} alt="" />
                            ) : (
                              <FileText />
                            )}
                          </AttachmentMedia>
                          <AttachmentContent>
                            <AttachmentTitle>{captureAttachmentName ?? "Attachment"}</AttachmentTitle>
                            <AttachmentDescription>
                              {attachmentError ??
                                (isUploadingAttachment
                                  ? "Uploading…"
                                  : captureAttachment
                                    ? `${(captureAttachment.fileSize / 1024).toFixed(0)} KB`
                                    : "")}
                            </AttachmentDescription>
                          </AttachmentContent>
                          <AttachmentActions>
                            <AttachmentAction type="button" aria-label={`Remove ${captureAttachmentName ?? "attachment"}`} onClick={clearAttachment}>
                              <X />
                            </AttachmentAction>
                          </AttachmentActions>
                        </Attachment>
                      </InputGroupAddon>
                    )}

                    <InputGroupAddon align="block-end" className="w-full justify-between border-t border-border/40 bg-muted/20 px-3 py-2">
                      <InputGroupButton type="button" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="h-3.5 w-3.5" />
                        Attach
                      </InputGroupButton>

                      <InputGroupText className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-primary">
                        <DetectedTypeIcon className="h-3 w-3" />
                        {detectedTypeLabel}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  <input ref={fileInputRef} type="file" onChange={handleAttachmentSelect} className="hidden" />
                </div>

                <Input
                  type="text"
                  placeholder="Add a title (optional)"
                  value={captureTitle}
                  onChange={(e) => setCaptureTitle(e.target.value)}
                  className="h-auto w-full rounded-xl border-input bg-background px-4 py-3 text-xs text-foreground focus-visible:border-primary/80 focus-visible:ring-primary/20"
                />

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Collection</span>
                  <Select value={captureCollectionId} onValueChange={(value) => setCaptureCollectionId((value as string) ?? "")}>
                    <SelectTrigger className="w-full h-auto rounded-xl border-input bg-background px-3 py-2.5 text-xs text-foreground">
                      <SelectValue placeholder="None">
                        {() => {
                          const selected = collections.find((col) => col.id === captureCollectionId);
                          return selected ? (
                            <span className="flex items-center gap-1.5">
                              <span>{selected.icon}</span>
                              {selected.name}
                            </span>
                          ) : (
                            "None"
                          );
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {collections.map((col) => (
                        <SelectItem key={col.id} value={col.id}>
                          <span className="flex items-center gap-1.5">
                            <span>{col.icon}</span>
                            {col.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {saveError && <p className="text-[10px] text-red-500">{saveError}</p>}

                <Button
                  type="submit"
                  disabled={isSaving || isUploadingAttachment || (!captureText.trim() && !captureAttachment)}
                  className="w-full h-11 rounded-full font-bold text-xs bg-primary text-white"
                >
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
        @keyframes ambientFlash {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        .animate-ambient-flash {
          animation: ambientFlash 18s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-ambient-flash {
            animation: none;
          }
        }
      `}</style>

    </div>
  );
}
