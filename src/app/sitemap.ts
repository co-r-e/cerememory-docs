import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/docs/content";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://co-r-e.github.io";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const lastModified = new Date();

  const pages = await getAllPages();

  const docEntries: MetadataRoute.Sitemap = pages.map((page) => {
    const pagePath = `/docs/${page.slug.join("/")}`;
    return {
      url: `${baseUrl}${base}${pagePath}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}${base}${pagePath}`,
          'x-default': `${baseUrl}${base}${pagePath}`,
        },
      },
    };
  });

  return [
    {
      url: `${baseUrl}${base}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}${base}/`,
          ja: `${baseUrl}${base}/ja`,
          'x-default': `${baseUrl}${base}/`,
        },
      },
    },
    {
      url: `${baseUrl}${base}/ja`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}${base}/`,
          ja: `${baseUrl}${base}/ja`,
          'x-default': `${baseUrl}${base}/`,
        },
      },
    },
    {
      url: `${baseUrl}${base}/docs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docEntries,
  ];
}
