"use client";

import React from "react";
import { Sparkles, Globe, FileText, Code, Video, Clock } from "lucide-react";

const oldMemories = [
  { type: "Website", title: "agent-frameworks.dev", icon: Globe, color: "text-blue-500 bg-blue-500/10", excerpt: "Collection of orchestration patterns and multi-agent libraries." },
  { type: "Article", title: "State of Prompt Engineering", icon: FileText, color: "text-amber-500 bg-amber-500/10", excerpt: "Core prompt formatting tips and structure recommendations for LLMs." },
  { type: "GitHub", title: "langchain-agents", icon: Code, color: "text-foreground bg-foreground/10", excerpt: "Official template repositories for conversational retrieval setups." },
  { type: "Video", title: "AI Agent Dev Day Talk", icon: Video, color: "text-red-500 bg-red-500/10", excerpt: "Deep dive talk covering long-term memory configurations." },
];

export default function RediscoverSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Background soft glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] dark:opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.06) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            REDISCOVER
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            Some of your best ideas are already in your memory.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            You saved it for a reason. Memora brings old discoveries back when they become useful again.
          </p>
        </div>

        {/* Visual: Horizontal Collection with Timeline Label */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Timeline header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground tracking-widest uppercase">
              <Clock className="h-4 w-4 text-primary" />
              <span>6 months ago</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-border/80 to-transparent" />
          </div>

          {/* Cards list (Double Bordered Cards!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {oldMemories.map((mem, idx) => {
              const Icon = mem.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full group">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-1.5 rounded-lg ${mem.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {mem.type}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {mem.title}
                      </h4>

                      <p className="text-[10px]/relaxed text-muted-foreground mt-2">
                        {mem.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-border/20 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                      <span>Saved Mar 2026</span>
                      <span className="text-primary/70 font-semibold group-hover:underline">View Memory</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI suggestion banner */}
          <div className="relative p-5 rounded-2xl border border-primary/20 bg-primary/5 max-w-2xl mx-auto text-center space-y-2">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(20,71,230,0.2)]">
              <Sparkles className="h-4.5 w-4.5 fill-current" />
            </div>
            
            <h4 className="text-sm font-semibold text-foreground">
              ✦ You might find these useful now.
            </h4>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              You saved these while exploring <span className="font-semibold text-foreground">AI agents</span>. 
              <br />
              <span className="text-primary font-medium">3 of them relate directly</span> to your recent searches for "embeddings" and "agent workflows".
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
