"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function TextGenerateEffect({
  words,
  className,
  wordClassName,
  duration = 0.4,
  startDelay = 0,
}: {
  words: string;
  className?: string;
  wordClassName?: string;
  duration?: number;
  startDelay?: number;
}) {
  const wordsArray = words.split(" ");

  return (
    <span className={cn(className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration, delay: startDelay + idx * 0.06 }}
          className={cn("inline-block", wordClassName)}
        >
          {word}
          {idx < wordsArray.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}
