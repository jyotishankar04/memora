"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

const sections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function MainFooter() {
  return (
    <footer className="w-full bg-background border-t border-border/20 pt-16 md:pt-24 pb-0 overflow-hidden relative">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 md:gap-4 pb-12 border-b border-border/20">
          
          {/* Brand block (Col span 2) */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Logo className="text-base text-foreground" />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Your personal memory for the internet. Save, organize, and find anything instantly.
            </p>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:col-span-4 gap-8 md:gap-4">
            {sections.map((sec) => (
              <div key={sec.title} className="space-y-4">
                <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase">
                  {sec.title}
                </h4>
                <ul className="space-y-2.5">
                  {sec.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href} 
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground">
            &copy; 2026 SaveForLatter. All rights reserved.
          </p>
          <div className="flex gap-4 text-[10px] text-muted-foreground/80">
            <span>Built with ❤️ for digital explorers</span>
          </div>
        </div>

        {/* Giant background brand text cropped at the bottom. Sized with
            clamp() rather than a flat vw value — "saveforlatter" is much
            longer than the old "memora" wordmark, and pure vw sizing ignores
            this container's max-w-6xl cap, so on wide viewports it overflowed
            past the container and got clipped mid-word instead of just
            bleeding off the bottom as intended. */}
        <div className="w-full select-none pointer-events-none overflow-hidden mt-2 md:mt-4 text-center translate-y-[25%]">
          <span
            className="font-black tracking-tighter text-foreground/[0.08] leading-none inline-block font-sans lowercase select-none"
            style={{ fontSize: "clamp(2.5rem, 8vw, 8rem)" }}
          >
            saveforlatter
          </span>
        </div>

      </div>
    </footer>
  );
}
