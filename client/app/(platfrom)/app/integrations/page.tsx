"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Plug01Icon as Plug, ArrowLeft01Icon as ArrowLeft } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function IntegrationsPage() {
  return (
    <div className="h-full w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-6">

      <div className="relative w-16 h-16 flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="w-14 h-14 rounded-2xl border border-primary/30 flex items-center justify-center bg-card shadow-md">
          <HugeiconsIcon icon={Plug} strokeWidth={2.25} className="h-7 w-7 text-primary" />
        </div>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
          Integrations
        </span>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.15] pt-2">
          Adding soon.
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
          We&apos;re building connectors for the apps and browsers you already capture from.
        </p>
      </div>

      <div className="pt-8">
        <Button
          render={<Link href="/app" />}
          nativeButton={false}
          className="h-10 px-6 rounded-full font-medium shadow-xs flex items-center gap-1.5"
          variant="outline"
        >
          <HugeiconsIcon icon={ArrowLeft} strokeWidth={2.25} className="h-4 w-4" /> Back to home
        </Button>
      </div>

    </div>
  );
}
