import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CompassIcon as Compass } from "@hugeicons/core-free-icons";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="relative w-14 h-14 flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        <div className="w-12 h-12 rounded-2xl border border-primary/30 flex items-center justify-center bg-card shadow-md">
          <HugeiconsIcon icon={Compass} strokeWidth={2.25} className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Page not found</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 h-10 px-6 rounded-full border border-border/60 hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors text-foreground"
      >
        Back to home
      </Link>
    </div>
  );
}
