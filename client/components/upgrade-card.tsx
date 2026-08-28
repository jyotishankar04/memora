import Link from "next/link";
import { Sparkles } from "lucide-react";

export function UpgradeCard() {
  return (
    <Link
      href="/app/settings/billing"
      className="block rounded-2xl overflow-hidden border border-primary/20 shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        className="p-4 space-y-3"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, rgba(139,92,246,0.55) 0%, rgba(20,71,230,0.55) 45%, rgba(10,10,14,0.95) 100%)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-white fill-current" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">Memora Pro</span>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-white leading-tight">Unlock unlimited memory.</p>
          <p className="text-[9.5px] text-white/70 leading-relaxed font-medium">
            AI summaries, semantic search, and unlimited collections.
          </p>
        </div>

        <span className="flex items-center justify-center w-full h-8 rounded-full bg-white text-[10px] font-bold text-primary">
          Upgrade
        </span>
      </div>
    </Link>
  );
}
