import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getAllPages } from "./content";

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://cerememory.dev";
}

function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Strip MDX/JSX syntax from source to produce plain text. */
function mdxToPlainText(source: string): string {
  const { content } = matter(source);

  return content
    .replace(/<[^>]+\/?>/g, "")
    .replace(/`{3,}[\s\S]*?`{3,}/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Generate llms.txt content following the llms.txt specification.
 * Contains project overview and links to all documentation pages.
 */
export async function generateLlmsTxt(): Promise<string> {
  const pages = await getAllPages();

  const lines: string[] = [
    "# Cerememory",
    "",
    "> A neuroscience-inspired memory database that gives AI systems persistent, evolving memory. LLM-agnostic. User-sovereign. Brain-inspired.",
    "",
  ];

  // Group pages by section
  const sections = new Map<string, { title: string; description: string; url: string }[]>();

  for (const page of pages) {
    const sectionSlug = page.slug.length > 1 ? page.slug[0] : "_root";
    const sectionName = sectionSlug === "_root"
      ? "General"
      : sectionSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    if (!sections.has(sectionName)) {
      sections.set(sectionName, []);
    }

    sections.get(sectionName)!.push({
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      url: `${getSiteUrl()}${getBasePath()}/docs/${page.slug.join("/")}`,
    });
  }

  for (const [section, entries] of sections) {
    lines.push(`## ${section}`, "");
    for (const entry of entries) {
      lines.push(`- [${entry.title}](${entry.url}): ${entry.description}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generate llms-full.txt with all documentation content concatenated.
 * Suitable for LLMs to ingest the full documentation in one pass.
 */
export async function generateLlmsFullTxt(): Promise<string> {
  const pages = await getAllPages();

  const sections: string[] = [
    "# Cerememory — Full Documentation",
    "",
    "> A neuroscience-inspired memory database that gives AI systems persistent, evolving memory.",
    "",
  ];

  for (const page of pages) {
    const raw = await fs.readFile(page.filePath, "utf-8");
    const plainText = mdxToPlainText(raw);
    const url = `${getSiteUrl()}${getBasePath()}/docs/${page.slug.join("/")}`;

    sections.push(
      `---`,
      "",
      `## ${page.frontmatter.title}`,
      "",
      `Source: ${url}`,
      "",
      plainText,
      "",
    );
  }

  return sections.join("\n");
}

/** Write both llms.txt and llms-full.txt to the specified directory. */
export async function writeLlmsTxt(outDir: string): Promise<void> {
  await fs.mkdir(outDir, { recursive: true });

  const [llmsTxt, llmsFullTxt] = await Promise.all([
    generateLlmsTxt(),
    generateLlmsFullTxt(),
  ]);

  await Promise.all([
    fs.writeFile(path.join(outDir, "llms.txt"), llmsTxt, "utf-8"),
    fs.writeFile(path.join(outDir, "llms-full.txt"), llmsFullTxt, "utf-8"),
  ]);
}
