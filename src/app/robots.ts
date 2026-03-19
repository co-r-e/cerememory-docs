import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cerememory.dev";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}${base}/sitemap.xml`,
  };
}
