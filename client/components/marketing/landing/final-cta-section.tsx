"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon as ArrowRight } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ParallaxGlow } from "@/components/ui/parallax-glow";
import { cn } from "@/lib/utils";
import { ctaHref } from "@/lib/showcase";

export default function FinalCtaSection() {
  return (
    <section className="relative w-full py-32 md:py-44 bg-background overflow-hidden border-t border-border/20">
      
      {/* Background soft blue glow */}
      <ParallaxGlow className="w-[700px] h-[500px] opacity-20 blur-[130px] dark:opacity-5" />

      <div className="mx-auto max-w-4xl px-6 relative text-center space-y-8">
        
        {/* Section copy */}
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            START YOUR MEMORY
          </span>
          <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.15] pt-2">
            Save it now. <br className="hidden sm:block" /> Find it whenever.
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            The internet is full of things worth remembering. SaveForLatter makes sure they don't get lost.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <MagneticButton strength={0.4}>
            <Link
              href={ctaHref("/auth/signup")}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold flex items-center gap-1 shadow-sm transition-all duration-200"
              )}
            >
              Start Saving Free
              <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-4 w-4" />
            </Link>
          </MagneticButton>

          <Link
            href="/how-it-works"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "h-12 px-6 rounded-full text-foreground/80 hover:text-foreground text-sm font-medium border border-border/50 hover:bg-muted/50 transition-colors"
            )}
          >
            Explore SaveForLatter
          </Link>
        </div>

      </div>
    </section>
  );
}
