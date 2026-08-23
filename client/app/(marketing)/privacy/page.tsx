"use client";

import React from "react";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-xs font-mono">
            Last Updated: August 2026
          </p>
        </div>

        {/* Content text */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-xs leading-relaxed text-foreground/80 space-y-8">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">1. Introduction</h2>
            <p>
              At Memora, we build personal memory indexers for the internet. This Privacy Policy details how we handle the information you save, collect, and sync using our browser extensions, mobile apps, and dashboard.
            </p>
            <p>
              Our core mission is to help you remember your ideas, which is why your data belongs exclusively to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">2. Information We Collect</h2>
            <p>
              When you use Memora, we collect and process the following information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Saved Memories:</strong> The URLs, screenshots, text fragments, and repositories you explicitly choose to save.</li>
              <li><strong>Account Credentials:</strong> Profile details collected via Google or GitHub OAuth. We do not store passwords.</li>
              <li><strong>Index Meta:</strong> Automatic tags, extracted OCR text, and vector query indices computed by our models to support search.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">3. How We Process Data</h2>
            <p>
              Your saved content is stored in secure cloud containers or processed locally. We use secure AI models to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Formulate vector embeddings for semantic search querying.</li>
              <li>Perform OCR character scans on screenshot uploads.</li>
              <li>Summarize text chunks and identify related links.</li>
            </ul>
            <p>
              <strong>We do not sell your personal data or saved information to third-party advertisers.</strong> We do not train foundation models on your private archives.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-foreground">4. User Rights & Data Deletion</h2>
            <p>
              You have full ownership of your data graph. You can request:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>A complete JSON export of all your saved memories at any time.</li>
              <li>The absolute deletion of specific memories or your entire account profile. Deletions are processed instantly across our servers.</li>
            </ul>
          </section>

        </div>

      </main>

      <MainFooter />
    </div>
  );
}
