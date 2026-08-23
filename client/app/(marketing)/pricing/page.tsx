"use client";

import React from "react";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import PricingTableSection from "@/components/marketing/landing/pricing-table-section";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <PricingTableSection />
      </main>

      <MainFooter />
    </div>
  );
}
