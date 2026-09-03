"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

export function HoverEffect({
  items,
  className,
}: {
  items: { id: string | number; content: ReactNode }[];
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute -inset-1.5 block rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
              />
            )}
          </AnimatePresence>
          <motion.div
            className="relative"
            whileHover={reduceMotion ? undefined : { y: -3 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          >
            {item.content}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
