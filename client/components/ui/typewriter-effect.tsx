"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export type TypewriterWord = {
  text: string;
  className?: string;
};

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
  direction = "in",
}: {
  words: TypewriterWord[];
  className?: string;
  cursorClassName?: string;
  /** "in" types the text forward, "out" deletes it backward (backspace feel). */
  direction?: "in" | "out";
}) {
  const totalChars = words.reduce((sum, w) => sum + w.text.length, 0);
  const typeDuration = Math.max(totalChars * 0.035, 0.3);
  const deleteDuration = Math.max(totalChars * 0.018, 0.2);

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <motion.span
        className="inline-block overflow-hidden whitespace-nowrap align-bottom"
        initial={{ width: "0%" }}
        animate={{ width: direction === "in" ? "100%" : "0%" }}
        transition={{
          duration: direction === "in" ? typeDuration : deleteDuration,
          ease: direction === "in" ? "linear" : "easeIn",
        }}
      >
        <span className="whitespace-nowrap">
          {words.map((word, idx) => (
            <span key={idx} className={cn("inline", word.className)}>
              {word.text}
              {idx < words.length - 1 && " "}
            </span>
          ))}
        </span>
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className={cn(
          "ml-0.5 inline-block h-4 md:h-5 w-[2px] shrink-0 bg-primary align-middle",
          cursorClassName
        )}
      />
    </span>
  );
}
