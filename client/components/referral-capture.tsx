"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureReferralCode } from "@/lib/referrals";

function ReferralCaptureInner() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (ref) captureReferralCode(ref);
  }, [ref]);

  return null;
}

/**
 * Mounted once in the root layout — a no-op unless the URL carries
 * ?ref=CODE. useSearchParams() needs a Suspense boundary or it opts the
 * whole tree into client-side-only rendering for every page.
 */
export function ReferralCapture() {
  return (
    <Suspense fallback={null}>
      <ReferralCaptureInner />
    </Suspense>
  );
}
