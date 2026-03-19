import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/docs/content";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cerememory.dev";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const pages = await getAllPages();

  const docEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}${base}/docs/${page.slug.join("/")}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: `${baseUrl}${base}`,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}${base}/docs`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docEntries,
  ];
}
