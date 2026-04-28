const DEFAULT_SITE_URL = "https://co-r-e.github.io";

export const siteConfig = {
  name: "Cerememory",
  applicationName: "Cerememory",
  title: "Cerememory - A Living Memory Database for the Age of AI",
  description:
    "Cerememory is an open-source, neuroscience-inspired memory database that gives AI systems persistent, evolving memory across sessions. LLM-agnostic (Claude, GPT, Gemini), user-sovereign, brain-inspired, and built in Rust. Speaks CMP over HTTP, gRPC, and MCP.",
  docsDescription:
    "Cerememory documentation: getting started, architecture, the CMP protocol, the meta-memory plane, deployment, and reference material.",
  japaneseTitle: "Cerememory - AI時代の生きた記憶データベース",
  japaneseDescription:
    "Cerememory は、神経科学に基づくオープンソースの記憶データベースです。AIシステムに永続的で進化する記憶を提供します。LLM非依存。ユーザー主権。脳にインスパイアされた設計。",
  socialImagePath: "/opengraph-image.png",
  logoPath: "/icon-512.png",
  repoUrl: "https://github.com/co-r-e/cerememory",
  themeColorLight: "#FFFFFF",
  themeColorDark: "#02001A",
} as const;

export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export function withBasePath(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getBasePath()}${normalizedPath}`;
}

export function absoluteUrl(pathname: string): string {
  return `${getSiteUrl()}${withBasePath(pathname)}`;
}
