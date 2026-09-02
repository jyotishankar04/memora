import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon as Sparkles, XIcon as X } from "@hugeicons/core-free-icons";

export function UpgradeCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-lg">
      <div
        className="p-4 space-y-3"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, rgba(139,92,246,1) 0%, rgba(20,71,230,1) 45%, rgba(10,10,14,1) 100%)",
        }}
      >
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <HugeiconsIcon icon={X} strokeWidth={2.25} className="h-3 w-3" />
        </button>

        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-3 w-3 text-white fill-current" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">SaveForLatter Pro</span>
        </div>

        <div className="space-y-1 pr-4">
          <p className="text-xs font-bold text-white leading-tight">Unlock unlimited memory.</p>
          <p className="text-[9.5px] text-white/70 leading-relaxed font-medium">
            AI summaries, semantic search, and unlimited collections.
          </p>
        </div>

        <Link
          href="/app/settings/billing"
          className="flex items-center justify-center w-full h-8 rounded-full bg-white text-[10px] font-bold text-primary hover:bg-white/90 transition-colors"
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
