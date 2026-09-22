"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ANIMATION_DURATION = 0.5;
const STAGGER_DELAY = 0.08;

// Adapted from @shoogle/smoothui/faq-2 — free, already token-based
// (text-foreground, border-border), already using motion/react (no
// framer-motion swap needed). Only real changes: hover:border-brand → a
// token this project actually has, and every question/answer replaced —
// the reference's defaults are about SmoothUI itself ("Is it free to
// use?", "What frameworks are supported?"). Answers here are checked
// against the same facts established building the rest of this page: the
// vault is a PIN gate, not encryption; the extension is Chrome-only and
// not yet published; the mobile app isn't released yet.
interface Faq {
  question: string;
  answer: string;
}

const FAQS: Faq[] = [
  {
    question: "What actually happens when I save something?",
    answer:
      "It's read (transcribed if it's audio, OCR'd if it's an image, extracted if it's a document), summarized, tagged, and embedded into your memory graph — automatically, the same four steps every time, whatever format it came in.",
  },
  {
    question: "Is my vault encrypted?",
    answer:
      "No — it's PIN-protected, not encrypted. Your PIN is scrypt-hashed and checked on the server; the vault blurs the instant the window loses focus and locks for real when you switch tabs. That's real access control, but it isn't end-to-end encryption of the content itself, and we'd rather say that plainly than let the word \"locked\" imply more than it does.",
  },
  {
    question: "Is the browser extension available yet?",
    answer:
      "Not yet — it's built (Chrome only, Manifest V3) but not published to the Chrome Web Store. The dashboard and bulk import work today; the extension is coming.",
  },
  {
    question: "Is there a mobile app?",
    answer: "One's built for iOS and Android, but it hasn't been released yet. The web dashboard works on mobile browsers in the meantime.",
  },
  {
    question: "What can I import from another tool?",
    answer:
      "A bookmarks export (the standard HTML file every browser can produce) or a plain list of URLs, all at once. It's exactly those two formats today — nothing more specific is supported yet.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes — 100 saves a month, web access, and standard keyword search, no card required. Upgrade when you actually hit the limit.",
  },
];

export function FaqSection() {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: ANIMATION_DURATION }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Before you ask</span>
          <h2 className="mt-3 text-3xl font-normal tracking-tight text-foreground sm:text-4xl">Frequently asked questions</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            The honest version of the things every one of these sections claims.
          </p>
        </motion.div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: ANIMATION_DURATION, delay: index * STAGGER_DELAY }}
                className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-colors hover:ring-primary/40"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: ANIMATION_DURATION, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" strokeWidth={2.25} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: ANIMATION_DURATION, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 leading-relaxed text-muted-foreground">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
