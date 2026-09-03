"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { XIcon as X } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export interface StickyBannerProps {
  className?: string;
  children?: React.ReactNode;
  /** Slide the banner away once the page scrolls past ~40px, and back in near the top. */
  hideOnScroll?: boolean;
  /** Fired only on an explicit close-button click — not on a scroll-driven hide. */
  onClose?: () => void;
}

export function StickyBanner({ className, children, hideOnScroll = false, onClose }: StickyBannerProps) {
  const [open, setOpen] = React.useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (hideOnScroll) setOpen(latest <= 40);
  });

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "sticky inset-x-0 top-0 z-40 flex min-h-10 w-full items-center justify-center px-4 py-2",
            className
          )}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Dismiss banner"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <HugeiconsIcon icon={X} strokeWidth={2.25} className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
