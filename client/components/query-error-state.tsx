"use client";

import React from "react";

interface QueryErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/** Shared "this fetch failed" state — same heading+subtext shape as the app's empty states, so a real error never looks identical to "nothing here yet." */
export function QueryErrorState({
  title = "Couldn't load this",
  description = "Something went wrong while fetching this. Check your connection and try again.",
  onRetry,
}: QueryErrorStateProps) {
  return (
    <div className="text-center py-20 max-w-sm mx-auto space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-bold text-primary hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}
