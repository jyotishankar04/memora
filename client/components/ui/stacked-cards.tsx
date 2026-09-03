"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface StackedCard {
  title: string;
  description: string;
  visual: React.ReactNode;
  className: string;
  config: { y: number; rotate: number };
}

type SpringConfig = {
  type: "spring";
  bounce?: number;
  visualDuration?: number;
};

const defaultSpring: SpringConfig = {
  type: "spring",
  visualDuration: 0.6,
  bounce: 0.25,
};

/**
 * A fanned stack of cards that spreads into a row and expands whichever one
 * is clicked. Adapted from a hand-off snippet (originally generic "skill
 * level" cards) — spacing/scale tuned here, content supplied by the caller.
 */
export function StackedCards({
  cards,
  spring = defaultSpring,
  activeScale = 1.15,
  cardSpacing = 180,
}: {
  cards: StackedCard[];
  spring?: SpringConfig;
  activeScale?: number;
  cardSpacing?: number;
}) {
  const [active, setActive] = useState<StackedCard | null>(null);
  const [spacing, setSpacing] = useState(cardSpacing);
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActive(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setSpacing(mq.matches ? cardSpacing : Math.round(cardSpacing * 0.42));
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [cardSpacing]);

  const middle = (cards.length - 1) / 2;
  const isAnyActive = Boolean(active);
  const isCurrent = (card: StackedCard) => active?.title === card.title;

  const cardSpring = reduceMotion ? { duration: 0 } : spring;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <motion.div
        ref={ref}
        onClick={() => setActive(null)}
        className="relative mx-auto flex h-[26rem] w-full max-w-5xl items-center justify-center [--height:280px] [--width:200px] lg:[--height:340px] lg:[--width:260px]"
      >
        {cards.map((card, index) => {
          const offsetX = (index - middle) * spacing;
          const current = isCurrent(card);
          return (
            <motion.button
              key={card.title}
              type="button"
              initial={{ x: 0, scale: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setActive(card);
              }}
              animate={{
                y: current ? 0 : isAnyActive ? 260 : card.config.y,
                x: current ? 0 : isAnyActive ? offsetX * 0.4 : offsetX,
                rotate: current ? 0 : isAnyActive ? 0.2 * card.config.rotate : card.config.rotate,
                scale: current ? activeScale : isAnyActive ? 0.7 : 1,
              }}
              whileHover={reduceMotion ? undefined : { scale: current ? activeScale : isAnyActive ? 0.7 : 1.05 }}
              transition={cardSpring}
              style={{
                width: "var(--width)",
                height: "var(--height)",
                marginLeft: "calc(var(--width) / -2)",
                marginTop: "calc(var(--height) / -2)",
                zIndex: current ? 50 : cards.length - Math.abs(index - middle),
              }}
              className={cn(
                "absolute top-1/2 left-1/2 flex cursor-pointer flex-col items-start justify-between overflow-hidden rounded-2xl p-4 text-left shadow-lg",
                card.className,
              )}
            >
              {card.visual}
              <div className="mt-4">
                <p className="max-w-40 text-base font-semibold leading-snug">{card.title}</p>
                <AnimatePresence mode="popLayout">
                  {current && (
                    <motion.p
                      initial={{ opacity: 0, y: 8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 8, height: 0 }}
                      transition={cardSpring}
                      className="mt-2 text-sm leading-relaxed opacity-80"
                    >
                      {card.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
