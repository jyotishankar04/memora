"use client";

import * as React from "react";
import { EmojiPicker as EmojiPickerPrimitive } from "frimousse";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
}

/** A frimousse emoji picker, styled to match the rest of the shadcn-based UI. Meant to sit inside a `PopoverContent`. */
export function EmojiPicker({ onEmojiSelect, className }: EmojiPickerProps) {
  return (
    <EmojiPickerPrimitive.Root
      onEmojiSelect={({ emoji }) => onEmojiSelect(emoji)}
      className={cn("flex h-72 w-full flex-col", className)}
    >
      <EmojiPickerPrimitive.Search
        placeholder="Search emoji..."
        className="mx-2 mt-2 h-8 shrink-0 rounded-md border border-input bg-input/20 px-2.5 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
      />
      <EmojiPickerPrimitive.Viewport className="relative mt-1 flex-1 outline-none">
        <EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          Loading&hellip;
        </EmojiPickerPrimitive.Loading>
        <EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          No emoji found.
        </EmojiPickerPrimitive.Empty>
        <EmojiPickerPrimitive.List
          className="select-none pb-1.5"
          components={{
            CategoryHeader: ({ category, ...props }) => (
              <div
                className="bg-popover px-2.5 pt-2.5 pb-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground"
                {...props}
              >
                {category.label}
              </div>
            ),
            Row: ({ children, ...props }) => (
              <div className="px-1.5" {...props}>
                {children}
              </div>
            ),
            Emoji: ({ emoji, ...props }) => (
              <button
                type="button"
                className={cn(
                  "flex size-8 items-center justify-center rounded-md text-base transition-colors",
                  emoji.isActive && "bg-muted"
                )}
                {...props}
              >
                {emoji.emoji}
              </button>
            ),
          }}
        />
      </EmojiPickerPrimitive.Viewport>
    </EmojiPickerPrimitive.Root>
  );
}
