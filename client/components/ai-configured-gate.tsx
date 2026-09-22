"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { Key01Icon as Key, ArrowRight01Icon as ArrowRight } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { listRoleAssignments } from "@/lib/ai-settings";
import { cn } from "@/lib/utils";

/**
 * Gates an AI feature (Ask chat, the floating widget, and anywhere else
 * this gets used) behind having a "reasoning" model configured — the one
 * role every one of these surfaces actually needs to produce a real reply.
 * Everything else (fast/vision/embeddings) can be configured or not without
 * blocking here; those enrichment steps just quietly skip themselves
 * elsewhere (see server's ai.providers.ts) rather than needing a gate.
 *
 * Blurs and disables `children` rather than hiding them — the shape of the
 * real UI stays visible underneath so it's obvious what's being unlocked,
 * same idea as a paywall preview, just for "add your own key" instead of
 * "pay us."
 */
export function AiConfiguredGate({ children, className }: { children: React.ReactNode; className?: string }) {
  const { data: roles, isLoading } = useQuery({ queryKey: ["ai-settings", "roles"], queryFn: listRoleAssignments });

  // Avoid a flash of blurred content while this resolves — render normally
  // until we actually know, since the check is a fast local API call.
  const isConfigured = isLoading || (roles ?? []).some((r) => r.role === "reasoning");

  if (isConfigured) return <>{children}</>;

  return (
    <div className={cn("relative h-full min-h-0", className)}>
      <div className="h-full blur-sm pointer-events-none select-none opacity-60" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-6 bg-background/40">
        <div className="max-w-xs w-full rounded-2xl border border-border bg-card shadow-xl p-6 text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={Key} strokeWidth={2.25} className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Connect an AI key to use Ask</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              This is free and open source — you bring your own AI key (OpenAI, Anthropic, Groq, Google, or any OpenAI-compatible endpoint), and it's used only for your account.
            </p>
          </div>
          <Button render={<Link href="/app/settings/ai" />} nativeButton={false} className="w-full rounded-full gap-1.5">
            Configure AI
            <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
