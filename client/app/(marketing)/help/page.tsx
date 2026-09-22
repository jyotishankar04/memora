"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { ScreenshotPlaceholder } from "@/components/help/screenshot-placeholder";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Search01Icon as Search,
  Rocket01Icon as Rocket,
  CloudUploadIcon as CloudUpload,
  FolderOpenIcon as FolderOpen,
  SparklesIcon as Sparkles,
  Key01Icon as Key,
  Share02Icon as Share,
  LockPasswordIcon as Lock,
  Calendar03Icon as CalendarIcon,
  Upload01Icon as Upload,
  Settings01Icon as Settings,
} from "@hugeicons/core-free-icons";

interface Step {
  title: string;
  body: string;
}

interface Guide {
  id: string;
  icon: IconSvgElement;
  title: string;
  intro: string;
  steps: Step[];
}

const GUIDES: Guide[] = [
  {
    id: "getting-started",
    icon: Rocket,
    title: "Getting started",
    intro: "The shortest path from a new account to your first saved memory.",
    steps: [
      {
        title: "Create your account",
        body: "Sign up with Google or GitHub — no password to remember, and no card required at any point.",
      },
      {
        title: "Connect an AI key",
        body: "Head to Settings → AI and add a key from OpenAI, Anthropic, Groq, Google, or any OpenAI-compatible endpoint. This unlocks summaries, tags, and Ask. Saving, keyword search, and organizing manually all work immediately without this step.",
      },
      {
        title: "Save your first memory",
        body: "Paste a link, drop a file, or just type a note from the capture bar on your dashboard.",
      },
    ],
  },
  {
    id: "capture",
    icon: CloudUpload,
    title: "Saving memories",
    intro: "Links, notes, images, documents, and voice all go through the same capture bar.",
    steps: [
      {
        title: "Save a link",
        body: "Paste a URL. The page is fetched, read, summarized, and tagged automatically once AI is configured.",
      },
      {
        title: "Save a note",
        body: "Type plain text — an idea, a quote, a reminder. Notes are yours as typed; nothing is rewritten, only lightly spelling-corrected if it's a caption alongside a link.",
      },
      {
        title: "Upload a file",
        body: "Images get OCR text extraction plus a visual description; PDFs get their text extracted (large ones are summarized from page one). Voice memos save today — automatic transcription is on the way.",
      },
    ],
  },
  {
    id: "organize",
    icon: FolderOpen,
    title: "Organizing",
    intro: "Collections group memories into folders; tags cut across them however you like.",
    steps: [
      {
        title: "Let it organize itself",
        body: "With AI configured, an incoming memory can be auto-tagged and, if it fits a clear recurring theme, auto-filed into a matching collection.",
      },
      {
        title: "Create your own collection",
        body: "From the Collections page, give it a name, an icon, and an optional description.",
      },
      {
        title: "Tag anything, anytime",
        body: "Add or edit tags on any memory to group things your own way — tags aren't tied to a single collection.",
      },
    ],
  },
  {
    id: "search",
    icon: Search,
    title: "Search",
    intro: "Two search legs run together and get merged into one ranked list.",
    steps: [
      {
        title: "Keyword search",
        body: "Works immediately for every account, no setup — matches the actual words in what you saved.",
      },
      {
        title: "Semantic search",
        body: "Matches by meaning, not just words — \"that pricing page\" can find it even without the word \"pricing\" anywhere on it. This is powered by embeddings, which SaveForLatter covers by default at no cost to you, so it works out of the box.",
      },
      {
        title: "Filter your results",
        body: "Narrow by type, collection, tag, or a date range from the search page's filter bar.",
      },
    ],
  },
  {
    id: "ask",
    icon: Sparkles,
    title: "Ask SaveForLatter",
    intro: "A chat assistant over your saved content — and, now, over your account itself.",
    steps: [
      {
        title: "Connect a reasoning model",
        body: "Settings → AI → assign a key to the \"Reasoning\" role. This is the one role Ask actually needs to produce a real reply.",
      },
      {
        title: "Ask a question",
        body: "Open the full Ask page, or use the floating button available from every page except Ask itself.",
      },
      {
        title: "Let it act, not just answer",
        body: "Ask it to save a note, edit a memory's title or tags, file something into a collection, or delete something — it can carry these out directly now, not just search and report back.",
      },
      {
        title: "Popup or sidebar, your choice",
        body: "The floating widget can float near the corner or dock as a full-height sidebar — toggle it from the widget's own header, and both position and size are remembered next time.",
      },
    ],
  },
  {
    id: "ai-setup",
    icon: Key,
    title: "Setting up AI (bring your own key)",
    intro: "This product doesn't pay for AI on your behalf — every account brings its own key, used only for that account.",
    steps: [
      {
        title: "Add a provider key",
        body: "Settings → AI → Add key. Pick OpenAI, Anthropic, Groq, Google, or a custom OpenAI-compatible endpoint (OpenRouter, Together, a local Ollama instance, etc.), give it a label, and paste the API key. It's encrypted at rest.",
      },
      {
        title: "Assign it to a role",
        body: "Fast (tagging/classification), Reasoning (Ask), Vision (image analysis), and Embeddings (search) are each configured separately — the same key can power more than one role, or you can mix providers across roles.",
      },
      {
        title: "Save — it's tested live",
        body: "Every role assignment is verified against the real provider before it's saved, so a bad key or a mistyped model name is caught immediately, not the next time you try to use it.",
      },
    ],
  },
  {
    id: "share",
    icon: Share,
    title: "Sharing",
    intro: "Share a single memory or a whole collection, with as much or as little control as you want.",
    steps: [
      {
        title: "Turn on a link",
        body: "From a memory or collection's share menu, choose a mode: public, password-protected, or invite-only with access requests.",
      },
      {
        title: "Invite someone directly",
        body: "Add their email. If they don't have an account yet, access is granted automatically the moment they sign up with that address.",
      },
      {
        title: "Manage access anytime",
        body: "Revoke one person's access, or turn the link off entirely, from the same share panel — nothing is permanent.",
      },
    ],
  },
  {
    id: "vault",
    icon: Lock,
    title: "Vault",
    intro: "A PIN-gated space for memories you'd rather keep out of your regular views.",
    steps: [
      {
        title: "Set a PIN",
        body: "The first time you open the Vault, you'll be asked to set a PIN for it.",
      },
      {
        title: "Move something in",
        body: "From any memory or collection's menu, choose \"Move to Vault\" — it disappears from your normal views immediately.",
      },
      {
        title: "Unlock to view",
        body: "Enter your PIN to see Vault contents; it locks again automatically the moment the tab loses focus. Worth knowing: this is PIN-gated access control, not end-to-end encryption of the content itself.",
      },
    ],
  },
  {
    id: "calendar",
    icon: CalendarIcon,
    title: "Calendar",
    intro: "Connect a calendar so date-bound memories can become real events.",
    steps: [
      {
        title: "Connect a calendar",
        body: "Settings → Integrations → connect Google Calendar or Outlook.",
      },
      {
        title: "Let AI catch events",
        body: "With AI configured, a saved memory that reads like an appointment or deadline gets flagged, with a one-click option to push it to your connected calendar.",
      },
      {
        title: "Or just ask",
        body: "Tell Ask SaveForLatter directly — \"add a meeting with Alex tomorrow at 3pm\" — and it's created and synced without opening a separate form.",
      },
    ],
  },
  {
    id: "import",
    icon: Upload,
    title: "Importing",
    intro: "Bring in what you've already bookmarked elsewhere, all at once.",
    steps: [
      {
        title: "Export your bookmarks",
        body: "From your browser's bookmark manager, export them as an HTML file — every major browser supports this.",
      },
      {
        title: "Upload it",
        body: "From the Import page, upload that file — or skip it and paste in a plain list of URLs instead.",
      },
      {
        title: "Let it process",
        body: "Each link is saved and queued for the same enrichment as anything saved directly, one by one.",
      },
    ],
  },
  {
    id: "account",
    icon: Settings,
    title: "Account & settings",
    intro: "Where your profile, your data, and the honest truth about pricing all live.",
    steps: [
      {
        title: "Update your profile & appearance",
        body: "Settings → Account for your profile, Settings → Appearance for theme and accent color.",
      },
      {
        title: "Export or delete your data",
        body: "Settings → Privacy & Data → download a full export of everything you've saved, or permanently delete your account.",
      },
      {
        title: "Check what's free",
        body: "Settings → Billing is a reminder, not a paywall — this product has no paid tier, and every feature is unlimited on every account.",
      },
    ],
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const filteredGuides = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GUIDES;
    return GUIDES.filter(
      (guide) =>
        guide.title.toLowerCase().includes(q) ||
        guide.intro.toLowerCase().includes(q) ||
        guide.steps.some((step) => step.title.toLowerCase().includes(q) || step.body.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">

        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6 mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Help Center
          </span>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.15]">
            How can we help?
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Step-by-step guides for every feature — how it works and how to use it.
          </p>

          <div className="max-w-md mx-auto relative flex items-center pt-2">
            <HugeiconsIcon icon={Search} strokeWidth={2.25} className="absolute left-4 h-5 w-5 text-muted-foreground stroke-[2.5]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides — search, ask, vault, import..."
              className="w-full bg-muted/40 border border-border text-foreground rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10">
          {/* TOC — always shows every guide, independent of the search filter, so navigation never disappears out from under you. */}
          <aside className="md:w-48 shrink-0">
            <nav className="md:sticky md:top-32 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
              {GUIDES.map((guide) => (
                <a
                  key={guide.id}
                  href={`#${guide.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-nowrap"
                >
                  <HugeiconsIcon icon={guide.icon} strokeWidth={2.25} className="h-3.5 w-3.5 shrink-0" />
                  {guide.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Guides */}
          <div className="flex-1 min-w-0">
            {filteredGuides.length === 0 ? (
              <p className="text-sm text-muted-foreground py-16 text-center">
                Nothing matched &ldquo;{query}&rdquo;. Try a different word, or{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  ask us directly
                </Link>
                .
              </p>
            ) : (
              <div className="space-y-16">
                {filteredGuides.map((guide) => (
                  <section key={guide.id} id={guide.id} className="scroll-mt-32 space-y-8 pb-16 border-b border-border/20 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={guide.icon} strokeWidth={2.25} className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">{guide.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{guide.intro}</p>
                      </div>
                    </div>

                    <ol className="space-y-10">
                      {guide.steps.map((step, i) => (
                        <li key={step.title} className="space-y-3">
                          <div className="flex gap-3">
                            <span className="h-6 w-6 rounded-full bg-muted text-foreground text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <div className="space-y-1.5">
                              <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">{step.body}</p>
                            </div>
                          </div>
                          <div className="pl-9">
                            <ScreenshotPlaceholder label={step.title} />
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>

      <MainFooter />
    </div>
  );
}
