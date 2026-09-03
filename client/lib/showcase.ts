export const SHOWCASE_MODE = process.env.NEXT_PUBLIC_SHOWCASE_MODE === "true";

/** In a marketing-only showcase deployment, every sign-up/sign-in CTA goes to the waitlist instead. */
export function ctaHref(real: string): string {
  return SHOWCASE_MODE ? "/waitlist" : real;
}
