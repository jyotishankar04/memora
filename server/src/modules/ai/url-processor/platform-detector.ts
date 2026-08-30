import type { PlatformInfo } from "./types";

interface PlatformRule {
  platform: string;
  hostnames: string[];
  resourceType?: (pathname: string) => string | null;
}

// Data, not branching logic — a new platform is a new row here, never a new
// `if (host.includes(...))` somewhere else in the codebase. Not every URL
// from a platform is the same resource type (a GitHub URL can be a repo, an
// issue, a PR, or a profile), so resourceType is a small per-platform
// classifier over the path, kept honest about what it can't determine
// (returns null rather than guessing).
const PLATFORM_RULES: PlatformRule[] = [
  {
    platform: "instagram",
    hostnames: ["instagram.com"],
    resourceType: (path) => {
      if (/^\/(p|reel|reels|tv)\//.test(path)) return "post";
      if (/^\/stories\//.test(path)) return "story";
      if (/^\/[^/]+\/?$/.test(path)) return "profile";
      return null;
    },
  },
  {
    platform: "x",
    hostnames: ["x.com", "twitter.com"],
    resourceType: (path) => {
      if (/\/status\/\d+/.test(path)) return "post";
      if (/^\/[^/]+\/?$/.test(path)) return "profile";
      return null;
    },
  },
  {
    platform: "youtube",
    hostnames: ["youtube.com", "youtu.be"],
    resourceType: (path) => {
      if (/^\/shorts\//.test(path)) return "short";
      if (/^\/watch/.test(path) || /^\/[A-Za-z0-9_-]{6,}$/.test(path)) return "video";
      if (/^\/(channel|c)\//.test(path) || /^\/@/.test(path)) return "channel";
      if (/^\/playlist/.test(path)) return "playlist";
      return null;
    },
  },
  {
    platform: "tiktok",
    hostnames: ["tiktok.com"],
    resourceType: (path) => {
      if (/\/video\/\d+/.test(path)) return "video";
      if (/^\/@[^/]+\/?$/.test(path)) return "profile";
      return null;
    },
  },
  {
    platform: "linkedin",
    hostnames: ["linkedin.com"],
    resourceType: (path) => {
      if (/^\/posts\//.test(path)) return "post";
      if (/^\/in\//.test(path)) return "profile";
      if (/^\/company\//.test(path)) return "company";
      return null;
    },
  },
  { platform: "facebook", hostnames: ["facebook.com", "fb.com"] },
  {
    platform: "reddit",
    hostnames: ["reddit.com"],
    resourceType: (path) => {
      if (/\/comments\//.test(path)) return "post";
      if (/^\/r\/[^/]+\/?$/.test(path)) return "subreddit";
      return null;
    },
  },
  {
    platform: "github",
    hostnames: ["github.com"],
    resourceType: (path) => {
      const segments = path.split("/").filter(Boolean);
      if (segments.length >= 4 && segments[2] === "issues") return "issue";
      if (segments.length >= 4 && segments[2] === "pull") return "pull_request";
      if (segments.length === 2) return "repository";
      if (segments.length === 1) return "profile";
      return null;
    },
  },
  { platform: "medium", hostnames: ["medium.com"], resourceType: () => "article" },
  {
    platform: "dribbble",
    hostnames: ["dribbble.com"],
    resourceType: (path) => (/^\/shots\//.test(path) ? "shot" : null),
  },
  {
    platform: "behance",
    hostnames: ["behance.net"],
    resourceType: (path) => (/^\/gallery\//.test(path) ? "project" : null),
  },
  {
    platform: "producthunt",
    hostnames: ["producthunt.com"],
    resourceType: (path) => (/^\/posts\//.test(path) ? "product" : null),
  },
  {
    // Fronted by Cloudflare's bot challenge, so our server-side fetch almost
    // never gets the real page — a platform-branded tile beats the fully
    // generic one for every LeetCode link, not just profiles.
    platform: "leetcode",
    hostnames: ["leetcode.com"],
    resourceType: (path) => {
      if (/^\/problems\//.test(path)) return "problem";
      if (/^\/u\//.test(path) || /^\/[^/]+\/?$/.test(path)) return "profile";
      if (/^\/discuss\//.test(path)) return "discussion";
      if (/^\/contest\//.test(path)) return "contest";
      return null;
    },
  },
];

export const KNOWN_PLATFORMS = PLATFORM_RULES.map((r) => r.platform);

export function detectPlatform(url: string): PlatformInfo {
  let hostname: string;
  let pathname: string;
  try {
    const parsed = new URL(url);
    hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
    pathname = parsed.pathname;
  } catch {
    return { platform: null, resourceType: null, domain: "" };
  }

  const rule = PLATFORM_RULES.find((r) => r.hostnames.some((h) => hostname === h || hostname.endsWith(`.${h}`)));
  if (!rule) return { platform: null, resourceType: null, domain: hostname };

  return { platform: rule.platform, resourceType: rule.resourceType?.(pathname) ?? null, domain: hostname };
}
