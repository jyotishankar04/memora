"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CountdownTilesProps {
  targetDate: string;
  size?: "sm" | "lg";
  showLabels?: boolean;
  className?: string;
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

type UnitKey = (typeof UNITS)[number]["key"];

function diffToUnits(ms: number): Record<UnitKey, number> {
  const clamped = Math.max(ms, 0);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** A dark flip-clock-style digit countdown. Ticks every second off `targetDate`. */
export function CountdownTiles({ targetDate, size = "lg", showLabels = true, className }: CountdownTilesProps) {
  const target = React.useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [values, setValues] = React.useState<Record<UnitKey, number> | null>(null);

  React.useEffect(() => {
    const tick = () => setValues(diffToUnits(target - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target]);

  // Nothing on the server / before the first tick — avoids a hydration mismatch.
  if (!values) return null;

  const isLg = size === "lg";

  return (
    <div className={cn("flex items-start", isLg ? "gap-3 sm:gap-4" : "gap-1", className)}>
      {UNITS.map((unit, i) => (
        <React.Fragment key={unit.key}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] font-mono font-semibold text-white tabular-nums",
                isLg ? "h-16 w-16 rounded-2xl text-3xl sm:h-20 sm:w-20 sm:text-4xl" : "h-7 w-7 text-xs"
              )}
            >
              {pad(values[unit.key])}
            </div>
            {showLabels && (
              <span
                className={cn(
                  "font-semibold uppercase tracking-widest text-amber-500",
                  isLg ? "mt-2 text-[10px] sm:text-xs" : "mt-1 text-[7px]"
                )}
              >
                {unit.label}
              </span>
            )}
          </div>
          {i < UNITS.length - 1 && (
            <span className={cn("font-mono text-white/25", isLg ? "mt-3 text-2xl sm:mt-4 sm:text-3xl" : "mt-1 text-xs")}>
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
