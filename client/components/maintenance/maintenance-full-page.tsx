import { HugeiconsIcon } from "@hugeicons/react";
import { ConstructionIcon as Construction } from "@hugeicons/core-free-icons";
import { SquigglyText } from "@/components/ui/squiggly-text";

export function MaintenanceFullPage({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-background">
      <div className="relative w-14 h-14 flex items-center justify-center mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        <div className="w-12 h-12 rounded-2xl border border-primary/30 flex items-center justify-center bg-card shadow-md">
          <HugeiconsIcon icon={Construction} strokeWidth={2.25} className="h-6 w-6 text-primary" />
        </div>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Under <SquigglyText scale={[3, 6]} stepDuration={90} className="text-primary">maintenance</SquigglyText>
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {message ?? "We're currently performing maintenance. Please check back soon."}
        </p>
      </div>
    </div>
  );
}
