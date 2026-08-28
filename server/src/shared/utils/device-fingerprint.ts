import crypto from "node:crypto";
import type { Request } from "express";

export function getClientIp(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

export function buildDeviceFingerprint(ip: string, userAgent: string): string {
  return crypto.createHash("sha256").update(`${ip}::${userAgent}`).digest("hex");
}

export interface ParsedUserAgent {
  platform?: string;
  browser?: string;
  deviceType?: string;
}

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const ua = userAgent.toLowerCase();

  let platform: string | undefined;
  if (ua.includes("windows")) platform = "windows";
  else if (ua.includes("mac os") || ua.includes("macintosh")) platform = "macos";
  else if (ua.includes("android")) platform = "android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) platform = "ios";
  else if (ua.includes("linux")) platform = "linux";

  let browser: string | undefined;
  if (ua.includes("edg/")) browser = "edge";
  else if (ua.includes("chrome/")) browser = "chrome";
  else if (ua.includes("firefox/")) browser = "firefox";
  else if (ua.includes("safari/") && !ua.includes("chrome/")) browser = "safari";

  let deviceType: string | undefined;
  if (ua.includes("mobile")) deviceType = "mobile";
  else if (ua.includes("tablet") || ua.includes("ipad")) deviceType = "tablet";
  else deviceType = "desktop";

  return { platform, browser, deviceType };
}
