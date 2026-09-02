"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon as ArrowLeft, ArrowRight01Icon as ArrowRight, XIcon as X } from "@hugeicons/core-free-icons";

export interface CarouselCard {
  category: string;
  title: string;
  /** Full-bleed backdrop for the collapsed card — a gradient, mockup composition, or image, not necessarily a photo. */
  background: ReactNode;
  content: ReactNode;
}

const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

/** Closes the expanded card when a pointer-down lands outside its container. */
function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, onOutside: () => void) {
  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      onOutside();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [ref, onOutside]);
}

export function Carousel({ items }: { items: ReactNode[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const checkScrollability = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScrollability();
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    carouselRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  // Memoized — an unstable context value here would give every Card a new
  // `onCardClose` reference on each scroll-driven re-render, cascading into
  // all of their close-on-Escape effects tearing down and re-mounting at
  // once (confirmed live: real keydowns started racing that remount and
  // only reaching whichever card's listener happened to survive it).
  const handleCardClose = React.useCallback((index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 230 : 384;
    const gap = isMobile ? 12 : 16;
    el.scrollTo({ left: (cardWidth + gap) * (index + 1), behavior: "smooth" });
    setCurrentIndex(index);
  }, []);

  const contextValue = React.useMemo(
    () => ({ onCardClose: handleCardClose, currentIndex }),
    [handleCardClose, currentIndex],
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <div className="relative w-full">
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex w-full overflow-x-scroll overscroll-x-contain scroll-smooth py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex flex-row justify-start gap-4 px-6 mx-auto max-w-6xl">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: 0.08 * index, ease: "easeOut" }}
                className="rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="h-9 w-9 rounded-full border border-border/60 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <HugeiconsIcon icon={ArrowLeft} strokeWidth={2.25} className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="h-9 w-9 rounded-full border border-border/60 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
}

export function Card({ card, index }: { card: CarouselCard; index: number }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [index, onCardClose]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    document.body.style.overflow = open ? "hidden" : "";
    // Capture phase, defensively — guarantees this fires even if some other
    // page-level Escape listener further down the tree stops propagation.
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open, handleClose]);

  useOutsideClick(containerRef, handleClose);

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              ref={containerRef}
              className="relative z-[60] mx-auto my-10 h-fit max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-xl md:p-10"
            >
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="sticky top-0 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:opacity-85 transition-opacity"
              >
                <HugeiconsIcon icon={X} strokeWidth={2.25} className="h-4 w-4" />
              </button>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mt-2">{card.category}</p>
              <p className="mt-3 text-2xl md:text-3xl font-medium tracking-tight text-foreground">{card.title}</p>
              <div className="mt-8">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl border border-border/60 bg-muted text-left md:h-[26rem] md:w-80 shadow-xs"
      >
        <div className="absolute inset-0">{card.background}</div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-30 p-6 mt-auto">
          <p className="text-left text-xs font-semibold uppercase tracking-wider text-white/80">{card.category}</p>
          <p className="mt-1.5 max-w-[85%] text-left text-xl font-semibold text-balance text-white md:text-2xl">{card.title}</p>
        </div>
      </motion.button>
    </>
  );
}
