"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SHOWCASE_MODE } from "@/lib/showcase";
import { useAuthCta } from "@/hooks/use-auth-cta";

// Adapted from a pasted CTA reference. Real fixes needed before any of the
// content mattered:
// - react-icons (FiArrowRight/FaStar/FaCircle) isn't installed here —
//   lucide's ArrowRight/Check instead, both already used elsewhere on this
//   page.
// - @/components/base-ui/{badge,button} don't exist in this repo — swapped
//   for @/components/ui/{badge,button}.
// - Button's `asChild` isn't this project's API (components.json's style
//   is base-ui-flavoured, not Radix Slot) — the render/nativeButton pattern
//   already used everywhere else on this page instead.
//
// The bigger change: the reference's social proof ("Trusted by 12,000+
// teams", 4 invented avatar initials, a 5-star rating, "Loved by 12k+
// engineers & designers") is fabricated — this product is pre-launch, no
// customer base exists to cite, matching every other place on this page a
// reference has assumed social proof that isn't real (the hero's own
// avatar-stack decision, the changelog's launch claims, etc.). Replaced
// with three things that are actually true instead of an invented crowd.
const REASSURANCES = ["No card required", "Free and open source", "Every feature, no limits"];

export function FinalCtaSection() {
  const cta = useAuthCta();

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden px-6 py-20 sm:py-28 md:px-12">
      {/* Dot-grid texture, faded to nothing toward the top — decorative
          only, not theme-token-dependent (a fixed low-opacity dot on
          either background reads fine in both modes without needing a
          --border-style fix like the borders elsewhere on this page). */}
      <div className="absolute inset-0 z-0 h-full w-full bg-transparent [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,transparent,black_40%)] dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)]" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mb-7 flex justify-center">
          <Badge variant="secondary" className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {SHOWCASE_MODE ? "Early access — join the waitlist" : "Free & open source · no limits"}
          </Badge>
        </div>

        <h2 className="mb-5 text-4xl leading-[1.08] font-normal tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Save anything.
          <br />
          Ask it <span className="text-primary italic">anything.</span>
        </h2>

        <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-muted-foreground">
          Articles, PDFs, screenshots, voice notes — read, tagged, and searchable
          the moment you save them.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button size="lg" render={<Link href={cta.href} />} nativeButton={false} className="group w-full gap-2 sm:w-auto">
            {cta.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/features" />} nativeButton={false} className="w-full sm:w-auto">
            See how it works
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          {REASSURANCES.map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FinalCtaSection;
