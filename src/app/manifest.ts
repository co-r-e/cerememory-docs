import type { MetadataRoute } from "next";
import { getBasePath, siteConfig, withBasePath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = getBasePath();

  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    background_color: siteConfig.themeColorLight,
    theme_color: siteConfig.themeColorDark,
    categories: ["developer tools", "artificial intelligence", "databases"],
    icons: [
      {
        src: withBasePath("/favicon-48.png"),
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: withBasePath("/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: withBasePath("/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: withBasePath("/apple-icon.png"),
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    lang: "en",
    id: `${basePath || "/"}`,
  };
}
