"use client";

import React from "react";
import { MessageSquare, Sparkles, User, FileText, ExternalLink } from "lucide-react";

const sources = [
  { id: "01", title: "AI Agents Guide", type: "Article", url: "https://example.com/agents-guide" },
  { id: "02", title: "Building Reliable Agents", type: "Video", url: "https://example.com/reliable-agents" },
  { id: "03", title: "Agent Memory Architecture", type: "GitHub", url: "https://example.com/memory-architecture" },
];

const topics = [
  { name: "Memory", count: 8, pct: "w-[80%]" },
  { name: "Tool calling", count: 6, pct: "w-[60%]" },
  { name: "RAG", count: 5, pct: "w-[50%]" },
  { name: "Evaluation", count: 3, pct: "w-[30%]" },
  { name: "Multi-agent", count: 2, pct: "w-[20%]" },
];

export default function AskSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Background radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full pointer-events-none opacity-20 blur-[130px] dark:opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.07) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            ASK MEMORA
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            Your memory can answer back.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            Ask questions about everything you've saved. Memora connects the dots and gives you answers grounded in your own memories.
          </p>
        </div>

        {/* Visual: Chat interface (Double Bordered Card) */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-border/45 bg-muted/75 p-1.5 shadow-md overflow-hidden">
          <div className="rounded-xl border border-border/75 bg-card overflow-hidden h-full shadow-xs">
            
            {/* Chat Window Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-foreground tracking-wide flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary fill-current" /> Ask Memora Assistant
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded">
                Grounded Model
              </span>
            </div>

            {/* Chat Area */}
            <div className="p-5 md:p-6 space-y-6">
              
              {/* User Message */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 bg-muted/30 border border-border/40 rounded-2xl rounded-tl-none p-3.5">
                  <p className="text-xs text-foreground/90 font-medium">
                    What have I saved about AI agents?
                  </p>
                </div>
              </div>

              {/* Assistant Message */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(20,71,230,0.3)]">
                  <Sparkles className="h-4.5 w-4.5 fill-current" />
                </div>
                
                <div className="flex-1 space-y-4">
                  
                  {/* Intro summary */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5 fill-current" />
                      <span>You have 24 memories about AI agents.</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Based on your bookmarks, videos, and articles, the topics you've explored most are:
                    </p>
                  </div>

                  {/* Topics explored charts (horizontal bar chart mockup) */}
                  <div className="space-y-2 max-w-md bg-background/50 border border-border/30 rounded-xl p-3.5">
                    {topics.map((topic) => (
                      <div key={topic.name} className="flex items-center justify-between text-[11px]">
                        <span className="w-24 font-medium text-foreground">{topic.name}</span>
                        <div className="flex-1 mx-3 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full bg-primary rounded-full ${topic.pct}`} />
                        </div>
                        <span className="text-muted-foreground font-mono w-20 text-right">{topic.count} resources</span>
                      </div>
                    ))}
                  </div>

                  {/* Sources - Important Trust Detail (Double Bordered Cards!) */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                      Sources Used
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {sources.map((src) => (
                        <div 
                          key={src.id}
                          className="rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-xs"
                        >
                          <div className="p-2.5 rounded-md border border-border/75 bg-card hover:border-primary/20 transition-all flex items-center justify-between group h-full">
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[10px] font-mono text-primary font-semibold">{src.id}</span>
                              <span className="text-[11px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {src.title}
                              </span>
                            </div>
                            <ExternalLink className="h-3 w-3 text-muted-foreground/60 group-hover:text-primary shrink-0 ml-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
