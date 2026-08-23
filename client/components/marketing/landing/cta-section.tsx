"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CtaSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background border-t border-border/20 overflow-hidden">
      
      {/* Background glow gradient */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none opacity-40 blur-[150px]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.1) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-4xl px-6 relative">
        <div className="bg-radial from-primary/10 via-card to-card border border-primary/25 rounded-[3rem] p-10 md:p-16 text-center shadow-[0_24px_60px_rgba(20,71,230,0.06)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
          <h2 className="text-3xl md:text-5xl font-medium text-foreground tracking-tight leading-tight">
            One place for everything <br className="hidden sm:block" /> you don't want to forget.
          </h2>
          <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            Stop losing links, screenshots, and notes. Build your unified digital memory with Memora today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold flex items-center gap-1 shadow-[0_4px_14px_rgba(20,71,230,0.3)] hover:shadow-[0_4px_20px_rgba(20,71,230,0.45)] transition-all duration-200"
              )}
            >
              Get started for free
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-it-works"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-12 px-6 rounded-full text-foreground/80 hover:text-foreground text-sm font-medium border border-border/50 hover:bg-muted/50"
              )}
            >
              See how it works
            </Link>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground">
            No credit card required. Free tier includes up to 150 saves / month.
          </p>
        </div>
      </div>
    </section>
  );
}
