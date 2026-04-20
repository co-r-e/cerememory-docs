import type { MetadataRoute } from "next";
import { getAllPages, getDocsLastModified, getPageLastModified } from "@/lib/docs/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, docsLastModified] = await Promise.all([
    getAllPages(),
    getDocsLastModified(),
  ]);

  const docEntries: MetadataRoute.Sitemap = await Promise.all(pages.map(async (page) => {
    const pagePath = `/docs/${page.slug.join("/")}`;
    return {
      url: absoluteUrl(pagePath),
      lastModified: await getPageLastModified(page.filePath) ?? docsLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: absoluteUrl(pagePath),
          'x-default': absoluteUrl(pagePath),
        },
      },
    };
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: docsLastModified,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          en: absoluteUrl("/"),
          ja: absoluteUrl("/ja"),
          'x-default': absoluteUrl("/"),
        },
      },
    },
    {
      url: absoluteUrl("/ja"),
      lastModified: docsLastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          en: absoluteUrl("/"),
          ja: absoluteUrl("/ja"),
          'x-default': absoluteUrl("/"),
        },
      },
    },
    {
      url: absoluteUrl("/docs"),
      lastModified: docsLastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: absoluteUrl("/docs"),
          "x-default": absoluteUrl("/docs"),
        },
      },
    },
    ...docEntries,
  ];
}
