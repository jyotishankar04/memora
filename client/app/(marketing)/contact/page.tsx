"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon as Mail, MessageSquareIcon as MessageSquare, MapPinIcon as MapPin, SendIcon as Send } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        
        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4 mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Support
          </span>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.15]">
            Get in touch.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Have a question about subscriptions, integration queries, or custom features? Shoot us a message!
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Left panel: Info */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-foreground">Contact Details</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We respond to inquiries within 24 hours Monday through Friday.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-foreground/80">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={Mail} strokeWidth={2.25} className="h-4 w-4" />
                </div>
                <span>support@saveforlatter.com</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-foreground/80">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={MessageSquare} strokeWidth={2.25} className="h-4 w-4" />
                </div>
                <span>Direct Slack support (Pro)</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-foreground/80">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={MapPin} strokeWidth={2.25} className="h-4 w-4" />
                </div>
                <span>Bengaluru, India</span>
              </div>
            </div>
          </div>

          {/* Right panel: Contact Form (Double Bordered Card!) */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
              <div className="p-6 md:p-8 rounded-xl border border-border/75 bg-card">
                
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-all placeholder:text-muted-foreground/30"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-all placeholder:text-muted-foreground/30"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Message</label>
                      <textarea
                        placeholder="How can we help?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-all placeholder:text-muted-foreground/30 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 rounded-full font-semibold flex items-center justify-center gap-1.5"
                    >
                      Send Message <HugeiconsIcon icon={Send} strokeWidth={2.25} className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                      ✓
                    </div>
                    <h3 className="text-base font-bold text-foreground">Message Sent!</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      Thank you for reaching out, {name}. Our support team will get back to you shortly.
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

      </main>

      <MainFooter />
    </div>
  );
}
