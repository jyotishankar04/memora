"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles, Plus, Search,
  Settings, HelpCircle, Bell, X, Moon, Sun, FolderOpen,
  Compass, Check, ChevronRight, ChevronDown,
  FolderPlus, Heart, Clock, Compass as CompassIcon, BarChart2, FileText,
  Paperclip, UploadCloud, Layers, PanelLeftClose, PanelLeftOpen, Menu, Tag,
  Keyboard, Archive, Trash2, TrendingUp, Plug
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { UserAvatar, UserProvider, useUser, formatPlan, useCurrentUserQuery, useSetCurrentUser } from "@/context/UserContext";
import { useMemories } from "@/context/MemoryContext";
import { UpgradeCard } from "@/components/upgrade-card";
import { uploadFile, type UploadedFile } from "@/lib/uploads";
import { detectMemoryType, deriveTitle, splitLinkAndCaption } from "@/lib/detect-memory-type";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/toast";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/** Exact-matches Home ("/app"); prefix-matches everything else, so a nav
 * item for a list route (Tags, Collections, Memories) stays highlighted on
 * its own dynamic detail routes (/app/tags/foo, /app/collections/[id]). */
function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const KEYBOARD_SHORTCUTS: { keys: string; label: string }[] = [
  { keys: "⌘K / Ctrl+K", label: "Open search" },
  { keys: "⌘Q / Ctrl+Q", label: "Quick capture" },
  { keys: "⌘B / Ctrl+B", label: "Toggle sidebar" },
  { keys: "⌘M / Ctrl+M", label: "Open collapsed sidebar menu" },
  { keys: "⌘N / Ctrl+N", label: "Go to notifications" },
  { keys: "⌘P / Ctrl+P", label: "Go to settings" },
  { keys: "Esc", label: "Close open menu" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Auth gate: the access token lives in an httpOnly cookie the backend set,
  // so this client can't check for it locally — it asks /auth/me instead.
  // Redirects to login if that fails, or to /onboard if the signed-in user
  // hasn't finished the onboarding questionnaire yet (covers direct
  // navigation to /app, not just the post-OAuth-login redirect).
  const { data: currentUser, isLoading, isError } = useCurrentUserQuery();
  const setCurrentUser = useSetCurrentUser();
  const needsOnboarding = Boolean(currentUser && !currentUser.onboardingCompleted);

  useEffect(() => {
    if (isLoading) return;
    if (isError) {
      router.replace("/auth/login");
    } else if (needsOnboarding) {
      router.replace("/onboard");
    }
  }, [isLoading, isError, needsOnboarding, router]);

  if (isLoading || isError || !currentUser || needsOnboarding) {
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
  const [captureCollectionIds, setCaptureCollectionIds] = useState<string[]>([]);
  const [captureAttachment, setCaptureAttachment] = useState<UploadedFile | null>(null);
  const [captureAttachmentName, setCaptureAttachmentName] = useState<string | null>(null);
  const [captureAttachmentMimeType, setCaptureAttachmentMimeType] = useState<string | null>(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureFormRef = useRef<HTMLFormElement>(null);
  const [savedTitle, setSavedTitle] = useState("");
  const [savedCollections, setSavedCollections] = useState<{ id: string; name: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [collectionsShowAll, setCollectionsShowAll] = useState(false);
  const COLLECTIONS_PREVIEW_COUNT = 4;
  // Sidebar collapse is a 3-stage sequence rather than one simultaneous
  // toggle: the Quick Capture button morphs into a circle first (still
  // docked, sidebar unchanged), then the sidebar hides, then the circle
  // slides out to its floating dock below the menu button. Expanding runs
  // the same sequence in reverse. Each named phase drives both the aside's
  // width and which Quick Capture button variant is mounted; transitions
  // between phases are chained off animation-completion callbacks so the
  // stages never overlap.
  type SidebarPhase = "expanded" | "toCircle" | "hiding" | "collapsed" | "showing" | "toDock";
  const [sidebarPhase, setSidebarPhase] = useState<SidebarPhase>("expanded");
  const sidebarCollapsed = sidebarPhase === "hiding" || sidebarPhase === "collapsed";
  const sidebarFullyCollapsed = sidebarPhase === "collapsed";
  const [sidebarFlyoutOpen, setSidebarFlyoutOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const flyoutItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const toggleFlyout = useCallback(() => {
    setSidebarFlyoutOpen((open) => {
      if (!open && menuButtonRef.current) {
        const rect = menuButtonRef.current.getBoundingClientRect();
        setMenuAnchor({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
      return !open;
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarPhase((phase) => {
      if (phase === "expanded") return "toCircle";
      if (phase === "collapsed") return "showing";
      return phase;
    });
  };

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
    setCaptureCollectionIds([]);
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
      // A pasted link often comes with commentary ("check this out
      // https://... thoughts?") — split it so the URL lands in `url` and
      // whatever's left becomes the caption, instead of the whole blob
      // getting shoved into the url field.
      const { url: extractedUrl, caption } = splitLinkAndCaption(captureText);
      const isLink = detectedType === "web" || detectedType === "video";
      const payload = {
        type: detectedType,
        title,
        url: isLink ? extractedUrl?.href : undefined,
        // For a note, the whole field is the content. For an attachment
        // (image/document), the field is free for a caption instead — an
        // attachment never consumes captureText, so whatever's typed there
        // should still be saved alongside the file rather than dropped. For
        // a link, whatever text was left after pulling the URL out becomes
        // the caption.
        content: detectedType === "note" || captureAttachment ? captureText.trim() || undefined : isLink ? caption || undefined : undefined,
        collectionIds: captureCollectionIds.length > 0 ? captureCollectionIds : undefined,
        attachments: captureAttachment ? [captureAttachment] : undefined,
      };
      const memory = await create(payload);
      // AI ingestion runs async in the background from here — the modal
      // doesn't wait for it. Once it finishes, the enrichment (corrected
      // caption, real title, tags, collection) shows up wherever the memory
      // is viewed next: the memories list, its detail page's "Memora
      // Understood" panel, and the list's slide-in drawer.
      setSavedTitle(memory.title);
      setSavedCollections(memory.collections);
      setSaveStep("done");
      // Non-blocking duplicate hint (docs/URL_CAPTURE_AND_PREVIEW.md) — the
      // memory above was saved either way, this is just a heads-up.
      if (memory.duplicateOf) {
        toast.add({
          title: "You already saved a similar link",
          description: memory.duplicateOf.title,
          type: "info",
        });
      }
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

  // Global keyboard shortcuts. Note: Ctrl/Cmd+N and Ctrl/Cmd+P are reserved
  // by the browser itself (new window / print) in Chrome and Firefox — their
  // preventDefault() is a no-op there, so these two only actually fire in
  // browsers/contexts that don't intercept them first (still wired here on
  // the chance they do, and so the binding is correct if that ever changes).
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      switch (e.key.toLowerCase()) {
        case "k":
          e.preventDefault();
          setSearchModalOpen(true);
          break;
        case "q":
          e.preventDefault();
          openCaptureModal();
          break;
        case "enter":
          if (saveModalOpen && saveStep === 1) {
            e.preventDefault();
            captureFormRef.current?.requestSubmit();
          }
          break;
        case "b":
          e.preventDefault();
          toggleSidebar();
          break;
        case "n":
          e.preventDefault();
          router.push("/app/notifications");
          break;
        case "p":
          e.preventDefault();
          router.push("/app/settings");
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveModalOpen, saveStep, router, openCaptureModal, toggleSidebar]);

  // Collapsed-sidebar quick-nav menu keyboard control: Ctrl+M opens/closes
  // it, Tab / Shift+Tab cycle its items, Escape closes it (Enter navigates
  // via the focused link's own native behavior). Inert whenever the full
  // sidebar is open — the floating menu doesn't exist in that state.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sidebarFullyCollapsed) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleFlyout();
        return;
      }

      if (!sidebarFlyoutOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setSidebarFlyoutOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        const items = flyoutItemRefs.current.filter((el): el is HTMLAnchorElement => el !== null);
        if (items.length === 0) return;
        e.preventDefault();
        const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);
        const delta = e.shiftKey ? -1 : 1;
        const nextIndex = (currentIndex + delta + items.length) % items.length;
        items[nextIndex]?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarFullyCollapsed, sidebarFlyoutOpen, toggleFlyout]);

  // Focus the first item as soon as the menu opens, so Tab/Shift+Tab have
  // somewhere to start cycling from.
  useEffect(() => {
    if (sidebarFlyoutOpen && sidebarFullyCollapsed) {
      flyoutItemRefs.current[0]?.focus();
    }
  }, [sidebarFlyoutOpen, sidebarFullyCollapsed]);

  const isFreeUser = !currentUser.roles.includes("pro_user") && !currentUser.roles.includes("admin");

  const primaryNavItems = [
    { label: "Home", href: "/app", icon: Compass },
    { label: "Memories", href: "/app/memories", icon: FolderOpen },
    { label: "Collections", href: "/app/collections", icon: Layers },
    { label: "Tags", href: "/app/tags", icon: Tag },
    { label: "Search", href: "/app/search", icon: Search },
    { label: "Ask Memora", href: "/app/ask", icon: Sparkles },
  ];
  const secondaryNavItems = [
    { label: "Favorites", href: "/app/favorites", icon: Heart },
    { label: "Recent", href: "/app/recent", icon: Clock },
    { label: "Explore", href: "/app/explore", icon: CompassIcon },
    { label: "Archive", href: "/app/archive", icon: Archive },
    { label: "Trash", href: "/app/trash", icon: Trash2 },
    { label: "Notifications", href: "/app/notifications", icon: Bell },
    { label: "Insights", href: "/app/insights", icon: TrendingUp },
    { label: "Integrations", href: "/app/integrations", icon: Plug },
    { label: "Memory Graph", href: "/app/graph", icon: BarChart2 },
  ];

  return (
    <div className="flex h-screen w-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">

      {/* Ambient primary-color glow — decorative, sits behind everything else */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-[110px] animate-ambient-flash" />
        <div className="absolute -bottom-48 -right-24 h-[30rem] w-[30rem] rounded-full bg-primary/[0.07] blur-[130px] animate-ambient-flash [animation-delay:-9s]" />
      </div>

      {/* 1. DESKTOP SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 0 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onAnimationComplete={() => {
          setSidebarPhase((phase) => {
            if (phase === "hiding") return "collapsed";
            if (phase === "showing") return "toDock";
            return phase;
          });
        }}
        className={cn(
          "relative z-10 bg-muted/15 flex flex-col justify-between shrink-0 hidden md:flex overflow-hidden",
          sidebarCollapsed ? "border-r-0" : "border-r border-border/60"
        )}
      >
        <div className="flex flex-col min-h-0 flex-1 w-60">

          {/* Header + Quick Capture — fixed, never scrolls with the nav below */}
          <div className="p-5 pb-4 space-y-4 shrink-0">
            <Link href="/app" className="flex items-center gap-2 px-1 hover:opacity-85 transition-opacity">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-foreground text-background font-semibold text-xs shrink-0">
                M
              </div>
              <span className="text-sm font-semibold tracking-[-0.03em]">memora</span>
            </Link>

            {sidebarPhase === "expanded" && (
              <motion.button
                layoutId="quick-capture-fab"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={openCaptureModal}
                className="w-full h-10 rounded-full font-bold text-xs bg-primary text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="h-4 w-4" /> Quick Capture
              </motion.button>
            )}

            {/* Stage 1 (collapsing): morphs from the pill above into this
                docked circle before the sidebar starts hiding. Stage 3
                (expanding): this is where the floating circle slides back
                to before morphing into the pill again. */}
            {(sidebarPhase === "toCircle" || sidebarPhase === "hiding" || sidebarPhase === "toDock") && (
              <motion.button
                layoutId="quick-capture-fab"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={openCaptureModal}
                onLayoutAnimationComplete={() => {
                  setSidebarPhase((phase) => {
                    if (phase === "toCircle") return "hiding";
                    if (phase === "toDock") return "expanded";
                    return phase;
                  });
                }}
                className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm shrink-0"
                aria-label="Quick Capture (Ctrl+Q)"
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            )}
          </div>

        <ScrollArea className="flex-1 min-h-0">
        <div className="px-5 pb-5 space-y-6">

          {/* Primary Navigation */}
          <div className="space-y-0.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isNavItemActive(pathname, item.href);
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
                  {(collectionsShowAll ? collections : collections.slice(0, COLLECTIONS_PREVIEW_COUNT)).map((col) => {
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

                  {collections.length > COLLECTIONS_PREVIEW_COUNT && (
                    <button
                      type="button"
                      onClick={() => setCollectionsShowAll((show) => !show)}
                      className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", collectionsShowAll ? "rotate-180" : "")} />
                      {collectionsShowAll ? "Show less" : `Show ${collections.length - COLLECTIONS_PREVIEW_COUNT} more`}
                    </button>
                  )}

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
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isNavItemActive(pathname, item.href);
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
        </ScrollArea>

        </div>

        {/* Sidebar Bottom user profile */}
        <div className="p-4 border-t border-border/40 relative w-60">

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

              <button
                type="button"
                onClick={() => { setUserDropdownOpen(false); setShortcutsOpen(true); }}
                className="w-full px-3 py-2 hover:bg-muted text-left flex items-center gap-2"
              >
                <Keyboard className="h-3.5 w-3.5 opacity-60" />
                <span>Keyboard shortcuts</span>
              </button>

              <Link href="/help" target="_blank" rel="noreferrer" onClick={() => setUserDropdownOpen(false)} className="w-full px-3 py-2 hover:bg-muted text-left flex items-center gap-2">
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

      </motion.aside>

      {/* 2. TOPBAR AND MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Topbar Header */}
        <header className="h-16 border-b border-border/40 px-6 flex items-center justify-between shrink-0 hidden md:flex">

          <div className="flex items-center gap-3">
            {/* Sidebar collapse toggle */}
            <button
              onClick={toggleSidebar}
              className="h-8 w-8 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label={sidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>

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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/app/notifications" aria-label="Notifications (Ctrl+N)" className="h-8 w-8 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-primary rounded-full" />
            </Link>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link href="/app/settings" aria-label="Profile (Ctrl+P)">
              <UserAvatar user={currentUser} className="h-8 w-8 text-xs border border-primary/20" />
            </Link>
          </div>

        </header>

        {/* Main nested content render */}
        <main className="flex-1 min-h-0">
          <ScrollArea className="h-full" viewportClassName="pb-16 md:pb-0">
            {children}
          </ScrollArea>
        </main>

        {/* 3. MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="fixed bottom-0 left-0 right-0 h-14 bg-card border-t border-border flex items-center justify-around z-40 md:hidden px-4">
          <Link href="/app" className={cn("flex flex-col items-center gap-0.5 text-[9px] font-bold", isNavItemActive(pathname, "/app") ? "text-primary" : "text-muted-foreground")}>
            <Compass className="h-5 w-5" />
            <span>Home</span>
          </Link>

          <Link href="/app/search" className={cn("flex flex-col items-center gap-0.5 text-[9px] font-bold", isNavItemActive(pathname, "/app/search") ? "text-primary" : "text-muted-foreground")}>
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

          <Link href="/app/ask" className={cn("flex flex-col items-center gap-0.5 text-[9px] font-bold", isNavItemActive(pathname, "/app/ask") ? "text-primary" : "text-muted-foreground")}>
            <Sparkles className="h-5 w-5" />
            <span>Ask</span>
          </Link>

          <Link href="/app/settings" className={cn("flex flex-col items-center gap-0.5 text-[9px] font-bold", isNavItemActive(pathname, "/app/settings") ? "text-primary" : "text-muted-foreground")}>
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
              <form ref={captureFormRef} onSubmit={handleCaptureSubmit} className="space-y-4">

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
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block font-bold">Collections</span>
                  {collections.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {collections.map((col) => {
                        const isSelected = captureCollectionIds.includes(col.id);
                        return (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() =>
                              setCaptureCollectionIds((prev) =>
                                prev.includes(col.id)
                                  ? prev.filter((id) => id !== col.id)
                                  : [...prev, col.id],
                              )
                            }
                            className={cn(
                              "flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors",
                              isSelected
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-background border-input text-muted-foreground hover:border-primary/20",
                            )}
                          >
                            <span>{col.icon}</span>
                            {col.name}
                            {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">No collections yet.</p>
                  )}
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

                {savedCollections.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {savedCollections.map((c) => (
                      <Link
                        key={c.id}
                        href={`/app/collections/${c.id}`}
                        onClick={() => setSaveModalOpen(false)}
                        className="text-[8px] font-bold uppercase bg-primary/5 border border-primary/10 text-primary px-2 py-0.5 rounded hover:bg-primary/10 transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}

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

      {/* Floating dock — replaces the collapsed sidebar, docked at the
          left-center of the screen like a desktop app dock. */}
      {(sidebarFullyCollapsed || sidebarPhase === "showing") && (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-1.5 p-1.5 rounded-full bg-card/95 border border-border/60 shadow-lg backdrop-blur-sm">
          {sidebarFullyCollapsed && (
            <button
              ref={menuButtonRef}
              type="button"
              onClick={toggleFlyout}
              className="h-10 w-10 rounded-full border border-primary/30 bg-primary/10 text-primary shadow-sm flex items-center justify-center hover:bg-primary/15 transition-colors shrink-0"
              aria-label="Open sidebar menu (Ctrl+M)"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}

          {/* Shares layoutId with the sidebar's Quick Capture button so it
              smoothly morphs between the two on collapse/expand. Stays
              mounted through "showing" too so it's still there to slide
              back to dock. */}
          {(sidebarPhase === "collapsed" || sidebarPhase === "showing") && (
            <motion.button
              layoutId="quick-capture-fab"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              type="button"
              onClick={openCaptureModal}
              className="h-10 w-10 rounded-full bg-primary text-white shadow-sm flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
              aria-label="Quick Capture (Ctrl+Q)"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      )}

      {/* COLLAPSED SIDEBAR QUICK-NAV FLYOUT — pops off the menu button in a
          half-circle arc instead of a straight list. */}
      <AnimatePresence>
        {sidebarFullyCollapsed && sidebarFlyoutOpen && (
          <React.Fragment key="sidebar-flyout">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSidebarFlyoutOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm hidden md:block"
            />
            <div
              className="fixed z-50 hidden md:block"
              style={{ left: menuAnchor.x, top: menuAnchor.y }}
            >
              {[...primaryNavItems, ...secondaryNavItems].map((item, idx, all) => {
                const Icon = item.icon;
                const active = isNavItemActive(pathname, item.href);
                const itemSize = 48;
                const radius = 150;
                // Half-circle bulging to the right of the button (-90deg =
                // straight up, 0deg = right, +90deg = straight down), since
                // the dock is pinned to the left edge of the screen.
                const angleDeg = all.length === 1 ? 0 : -90 + (180 / (all.length - 1)) * idx;
                const angleRad = (angleDeg * Math.PI) / 180;
                const targetX = radius * Math.cos(angleRad) - itemSize / 2;
                const targetY = radius * Math.sin(angleRad) - itemSize / 2;
                const originOffset = -itemSize / 2;
                return (
                  <motion.div
                    key={item.href}
                    className="absolute top-0 left-0"
                    initial={{ x: originOffset, y: originOffset, opacity: 0, scale: 0.3 }}
                    animate={{ x: targetX, y: targetY, opacity: 1, scale: 1 }}
                    exit={{ x: originOffset, y: originOffset, opacity: 0, scale: 0.3 }}
                    transition={{ duration: 0.25, delay: idx * 0.02, ease: "easeOut" }}
                  >
                    <Link
                      ref={(el) => {
                        flyoutItemRefs.current[idx] = el;
                      }}
                      href={item.href}
                      onClick={() => setSidebarFlyoutOpen(false)}
                      title={item.label}
                      aria-label={item.label}
                      style={{ height: itemSize, width: itemSize }}
                      className={cn(
                        "rounded-full border flex items-center justify-center shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        active
                          ? "bg-primary/15 border-primary/30 text-primary"
                          : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </AnimatePresence>

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

      {/* KEYBOARD SHORTCUTS DIALOG */}
      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard shortcuts</DialogTitle>
            <DialogDescription>Available anywhere in the app.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 pt-1">
            {KEYBOARD_SHORTCUTS.map((s) => (
              <li key={s.label} className="flex items-center justify-between gap-4 text-xs">
                <span className="text-muted-foreground">{s.label}</span>
                <kbd className="px-1.5 py-0.5 border border-border bg-muted rounded text-[10px] font-mono text-foreground shrink-0">{s.keys}</kbd>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

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
