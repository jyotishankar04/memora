"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoonIcon as Moon, Sun01Icon as Sun, Calendar01Icon as Calendar } from "@hugeicons/core-free-icons";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { BOOKING_URL } from "@/lib/booking";

// Structure adapted from a pasted "Footer12" reference — kept: the
// asymmetric two-column grid (a lead block beside 4 link columns), the
// stagger/rise motion choreography, the giant brand wordmark bleeding off
// the bottom, a working theme toggle. Dropped rather than faked:
//
// - The newsletter signup form: no subscribe endpoint exists anywhere in
//   this codebase (checked lib/ and app/) — a form that silently does
//   nothing on submit is worse than no form. Its slot instead holds the
//   same brand blurb the previous footer used.
// - Social icons (Facebook/X/Instagram/LinkedIn) and react-icons: no real
//   account for any of them exists anywhere in this codebase (checked) —
//   four icons linking to "#" would be worse than none.
// - The language selector: this app has no i18n/locale switching anywhere,
//   so a working dropdown isn't possible and a decorative one that does
//   nothing would be misleading.
// - The theme toggle is real, not decorative — wired to next-themes'
//   useTheme(), same hook the navbar's own toggle uses.
//
// Colour: an earlier pass used bg-foreground/text-background (inverted —
// a dark band on the light theme, a light band on the dark theme) to echo
// the reference's committed-dark look. That made this the one section on
// the page using the opposite token direction from everywhere else, which
// reads as "off" rather than "on brand" — every other section here is
// plain bg-background/bg-card with text-foreground/text-muted-foreground,
// so this now follows that same direction: a normal part of the page,
// flipping with light/dark exactly like the sections above it, not a
// contrasting band.
interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const sections: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "How it works", href: "/features#how-it-works" },
      { label: "Contribute", href: "/contribute" },
      { label: "Changelog", href: "/changelog" },
      { label: "Report a bug", href: "/report" },
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
      { label: "Book a call", href: BOOKING_URL, external: true },
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

const footerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.08, staggerChildren: 0.1 } },
};

const riseItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", duration: 0.65, bounce: 0 } },
};

export function MainFooter() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Must start false on both server and first client render (mount flag
  // avoids a hydration mismatch against next-themes' resolved theme);
  // flipped true only after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";

  return (
    <motion.footer
      variants={footerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.28 }}
      className="w-full overflow-hidden border-t border-border bg-background px-6 py-10 font-sans text-foreground antialiased sm:px-10 lg:px-12"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-between">
        <div className="grid gap-10 lg:grid-cols-[minmax(250px,340px)_1fr] lg:gap-20">
          <motion.div variants={riseItem} className="max-w-[340px] space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-90">
              <Logo className="text-lg text-foreground" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Save anything. Ask it anything. A personal library that gets smarter
              the more you use it.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <HugeiconsIcon icon={Calendar} strokeWidth={2.25} className="h-3.5 w-3.5" />
              Book a 30-min call
            </a>
          </motion.div>

          <motion.nav
            variants={footerContainer}
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4"
          >
            {sections.map((section) => (
              <motion.div key={section.title} variants={riseItem}>
                <h3 className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  {section.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.nav>
        </div>

        {/* Giant background brand text, auto-fit to the container width via
            textLength rather than the old footer's clamp() guess — more
            robust against a brand name this long ("saveforlatter") at any
            viewport width. Still a low-opacity watermark, not the
            reference's full-strength brand statement. */}
        <div className="pointer-events-none mt-10 w-full translate-y-[22%] overflow-hidden text-center select-none sm:mt-8">
          <svg
            className="h-auto w-full select-none"
            viewBox="0 0 1200 160"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <text
              x="50%"
              y="92%"
              textAnchor="middle"
              textLength="94%"
              lengthAdjust="spacing"
              fontSize="150"
              className="fill-foreground/[0.08] font-sans font-black tracking-tighter lowercase"
            >
              saveforlatter
            </text>
          </svg>
        </div>

        <motion.div variants={riseItem} className="mt-9 grid gap-6 border-t border-border pt-8 md:grid-cols-3 md:items-center">
          <p className="text-xs text-muted-foreground">&copy; 2026 SaveForLatter. All rights reserved.</p>

          <p className="text-xs text-muted-foreground md:text-center">Built with ❤️ for digital explorers</p>

          <div className="flex items-center gap-3 md:justify-end">
            <div className="flex h-7 items-center rounded-full bg-muted p-0.5">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                  "flex h-full items-center gap-1.5 rounded-full px-2.5 text-[10px] font-medium transition-colors",
                  !isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <HugeiconsIcon icon={Sun} strokeWidth={2.5} className="h-2.5 w-2.5" />
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex h-full items-center gap-1.5 rounded-full px-2.5 text-[10px] font-medium transition-colors",
                  isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <HugeiconsIcon icon={Moon} strokeWidth={2.5} className="h-2.5 w-2.5" />
                Dark
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default MainFooter;
