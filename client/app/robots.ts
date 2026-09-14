import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The authenticated app and the API have nothing crawlable in them.
      //
      // /s/ is deliberately NOT disallowed: shared pages are noindex by
      // default via their own robots meta tag, which lets an owner opt a
      // single page in. A blanket rule here would override that and make
      // the per-share setting a lie.
      disallow: ["/api/", "/app/", "/admin/", "/auth/"],
    },
    // No `sitemap:` entry — this app has no sitemap route yet, and pointing
    // crawlers at a 404 is worse than omitting the line. Add it here when
    // app/sitemap.ts lands.
  };
}
