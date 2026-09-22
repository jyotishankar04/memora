"use client";

import React from "react";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Legal Policy
          </span>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.15]">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-xs font-mono">
            Last Updated: August 2026
          </p>
        </div>

        {/* Content text */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-xs leading-relaxed text-foreground/80 space-y-8">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">1. Agreement to Terms</h2>
            <p>
              By accessing or using SaveForLatter, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must not use our browser extensions, mobile applications, or web dashboards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">2. Account Registration</h2>
            <p>
              To use SaveForLatter, you must authenticate securely via our Google or GitHub OAuth providers. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Keep your OAuth credentials secure.</li>
              <li>Provide accurate account contact information if prompted.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">3. Fair Use & Account Restrictions</h2>
            <p>
              SaveForLatter provides personal indexing services. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Upload malicious code, worms, or scripts designed to damage our servers.</li>
              <li>Scrape data from our site or attempt to reverse-engineer our vector mapping.</li>
              <li>Store illegal content or violate copyright regulations within your saved memories.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">4. Pricing</h2>
            <p>
              This product is free and open source. There is no paid tier, no subscription, and no billing — every account gets every feature with no usage limits.
            </p>
          </section>

        </div>

      </main>

      <MainFooter />
    </div>
  );
}
