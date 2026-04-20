import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteUrl, withBasePath } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const crawlDisallow = [
    withBasePath("/_next/"),
    withBasePath("/api/"),
    withBasePath("/docs/search-index.json"),
  ];
  const publicSiteRoot = withBasePath("/");

  return {
    rules: [
      {
        userAgent: ["Googlebot", "Bingbot", "DuckDuckBot", "Slurp"],
        allow: publicSiteRoot,
        disallow: [...crawlDisallow, withBasePath("/llms-full.txt")],
      },
      {
        userAgent: "*",
        allow: publicSiteRoot,
        disallow: crawlDisallow,
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "CCBot",
          "Applebot-Extended",
          "cohere-ai",
          "Meta-ExternalAgent",
          "Bytespider",
        ],
        allow: [
          publicSiteRoot,
          withBasePath("/llms.txt"),
          withBasePath("/llms-full.txt"),
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(getSiteUrl()).host,
  };
}
