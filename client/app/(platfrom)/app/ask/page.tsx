"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Globe, Video, Image as ImageIcon, Code, FileText, StickyNote, Plus, Search, 
  ArrowRight, X, ArrowUpRight, ChevronRight, RotateCcw, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  sources?: Array<{ id: string; title: string; type: string }>;
}

export default function AskPage() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "You've saved 24 memories related to AI agents. The main topics are:\n\n1. Tool calling\n2. RAG patterns\n3. Agent memory architectures\n4. Evaluation frameworks.";
      let mockSources = [
        { id: "01", title: "Building Reliable AI Agents", type: "Web" },
        { id: "02", title: "Agent Memory Architecture", type: "Note" },
        { id: "03", title: "Agent Patterns Summary", type: "Document" }
      ];

      if (userText.toLowerCase().includes("postgres") || userText.toLowerCase().includes("database")) {
        aiText = "Based on your PostgreSQL notes, you saved 5 guides on query optimizations, B-Tree index adjustments, and indexing jsonb fields for SaaS schemas.";
        mockSources = [
          { id: "01", title: "PG index tuning tips", type: "Web" },
          { id: "02", title: "JSONB queries syntax", type: "Note" }
        ];
      }

      setMessages(prev => [...prev, { sender: "ai", text: aiText, sources: mockSources }]);
      setIsTyping(false);
    }, 1200);
  };

  const handlePresetQuestion = (q: string) => {
    setChatInput(q);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 h-full flex flex-col justify-between">
      
      {/* Messages Scroll Area */}
      <ScrollArea className="flex-1 min-h-0 mb-4">
      <div className="space-y-6 pr-2">

        {/* Chat Title / Initial state */}
        {messages.length === 0 && (
          <div className="space-y-6 pt-10 text-center max-w-md mx-auto">
            <div className="h-12 w-12 bg-primary/5 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="h-6 w-6 fill-current" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight">Ask Memora</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your memories are full of ideas. Ask anything about them conceptually to discover connections.
              </p>
            </div>

            {/* Preset templates */}
            <div className="space-y-2.5 pt-4 text-left font-medium">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block text-center mb-1">
                Try asking:
              </span>
              <div className="space-y-2 text-xs">
                {[
                  "What have I saved about AI agents?",
                  "What design patterns keep appearing in my saved websites?",
                  "Summarize my research on PostgreSQL.",
                  "What should I revisit for my current project?"
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handlePresetQuestion(q)}
                    className="w-full text-left p-3 border border-border bg-card rounded-xl hover:border-primary/30 transition-all text-primary hover:bg-primary/5 font-semibold"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversation Dialogues */}
        {messages.length > 0 && (
          <div className="space-y-6 pt-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-4 rounded-2xl max-w-[85%] leading-relaxed space-y-3 animate-fade-in",
                  msg.sender === "user" 
                    ? "bg-primary text-white ml-auto shadow-sm" 
                    : "bg-muted border border-border/60 text-foreground mr-auto shadow-xs"
                )}
              >
                <div className="text-xs whitespace-pre-line font-medium">{msg.text}</div>
                
                {/* Sources list inside AI message */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="border-t border-border/20 pt-3 space-y-2 text-xs">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
                      Sources
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans font-semibold">
                      {msg.sources.map((src, sIdx) => (
                        <div 
                          key={sIdx}
                          className="p-2 border border-border bg-card rounded-lg flex items-center justify-between text-[10px] text-foreground hover:border-primary/20 transition-all select-none"
                        >
                          <div className="truncate pr-2">
                            <span className="text-[8px] font-mono uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded mr-1.5 shrink-0">
                              {src.type}
                            </span>
                            <span className="truncate">{src.title}</span>
                          </div>
                          <span className="text-[9px] font-mono text-muted-foreground">{src.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="bg-muted border border-border/60 p-4 rounded-2xl mr-auto max-w-[100px] flex justify-center items-center gap-1.5 animate-pulse text-[10px] text-muted-foreground font-bold font-mono">
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce delay-75" />
                <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce delay-150" />
              </div>
            )}
          </div>
        )}

      </div>
      </ScrollArea>

      {/* Message Chat Input Footer */}
      <form onSubmit={handleSubmit} className="border-t border-border/20 pt-4 bg-background shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask Memora about your saves..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full bg-muted/30 border border-border rounded-full pl-4 pr-12 py-3.5 text-xs text-foreground focus:outline-none focus:border-primary/80 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <button 
            type="submit" 
            disabled={!chatInput.trim() || isTyping}
            className="absolute right-2 h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-30 cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Local animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
