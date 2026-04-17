import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://co-r-e.github.io";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", "/api/"],
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
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}${base}/sitemap.xml`,
    host: baseUrl,
  };
}
