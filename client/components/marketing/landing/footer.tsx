"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border/20 py-12">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background font-semibold text-xs">
            M
          </div>
          <span className="text-sm font-semibold tracking-[-0.03em] text-foreground">
            memora
          </span>
        </Link>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
          <Link href="/how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-muted-foreground">
          &copy; {new Date().getFullYear()} Memora Inc. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
