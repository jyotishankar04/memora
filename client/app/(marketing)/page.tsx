import HeroStacked from "@/components/marketing/landing/hero-stacked";
import { FeaturesGridCards } from "@/components/marketing/landing/features-grid-cards";
import { ContributeSection } from "@/components/marketing/landing/contribute-section";
import { FaqSection } from "@/components/marketing/landing/faq-section";
import { FinalCtaSection } from "@/components/marketing/landing/final-cta-section";
import MainFooter from "@/components/marketing/landing/main-footer";

/**
 * Three heroes are built against the same copy and the same salt-flat art:
 *
 *   hero-stacked.tsx    full-bleed art, copy left-aligned and vertically
 *                       centred, three-up capability row at the bottom
 *                       (in use — the Hero34 layout)
 *   hero-fullbleed.tsx  full-bleed art with the copy in the bottom band
 *                       (the Hero35 layout)
 *   hero-split.tsx      copy on a plain ground, art in a panel bleeding off
 *                       the right edge
 *
 * Swap by changing the import above and the element below — nothing else in
 * the page depends on which one renders.
 *
 * The homepage used to carry a full anchored breakdown of every feature
 * (how-it-works, ask, formats, search, graph, everywhere, integrations,
 * vault) plus a 9-tile bento overview linking between them. That's all
 * moved to /features now.
 *
 * The homepage's own features section has gone through three layouts on
 * the same real capabilities, each left in place unused as an alternate:
 *
 *   features-grid-cards.tsx     9-card grid, real UI/live demos inset in
 *                               each card (in use)
 *   sticky-features-section.tsx sticky-scroll reveal, 3 of the demos
 *   features-alternating.tsx    alternating left/right rows, same 3
 *
 * ChangelogSection (what's-new carousel) was here between the features
 * grid and pricing — removed per request, not deleted (changelog-
 * section.tsx still exists and still renders on /changelog itself).
 *
 * There's no pricing section anymore — this product isn't sold. ContributeSection
 * (also the whole content of /contribute) replaced it: the Buy Me a Coffee
 * support ask, what "free" actually means, and how to contribute code —
 * not a plans grid.
 */
export default function MarketingPage() {
  return (
    <>
      <HeroStacked />
      <FeaturesGridCards />
      <ContributeSection />
      <FaqSection />
      <FinalCtaSection />
      <MainFooter />
    </>
  );
}
