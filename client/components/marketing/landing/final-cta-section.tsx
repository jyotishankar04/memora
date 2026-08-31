"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FinalCtaSection() {
  return (
    <section className="relative w-full py-32 md:py-44 bg-background overflow-hidden border-t border-border/20">
      
      {/* Background soft blue glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] dark:opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.06) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

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
          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold flex items-center gap-1 shadow-sm transition-all duration-200"
            )}
          >
            Start Saving Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          
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
