"use client";

import { Sparkles, Globe, Video, Image as ImageIcon, Code, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IntegrationsPage() {
  const integrations = [
    { name: "Browser Extension", desc: "Save anything instantly from your Chrome, Firefox, or Safari window.", icon: Globe, connected: true },
    { name: "iOS Share Extension", desc: "Share links and screenshots directly to your memory index on iPhone.", icon: Smartphone, connected: false },
    { name: "YouTube Integration", desc: "Sync video transcripts, description summaries, and timestamps.", icon: Video, connected: true },
    { name: "GitHub Connector", desc: "Sync repositories, extract readmes, and code outline details.", icon: Code, connected: false }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Connect your daily apps and browsers to capture information without leaving the page.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
        {integrations.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
            <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[140px] space-y-4 text-xs font-semibold">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{item.name}</h3>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/20">
                <span className={`text-[9px] font-mono font-bold uppercase ${item.connected ? "text-emerald-500" : "text-muted-foreground"}`}>
                  {item.connected ? "Connected ✓" : "Disconnected"}
                </span>
                <button 
                  onClick={() => alert("Toggling connector configuration...")}
                  className="text-[10px] text-primary hover:underline"
                >
                  Configure &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
