"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Ctrl/Cmd+D toggles light/dark, site-wide. Browsers bind that combo to
 * "bookmark this page" — preventDefault() is required or the bookmark
 * dialog opens instead of (or alongside) the toggle.
 */
export function ThemeShortcut() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, setTheme]);

  return null;
}
