import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getAllPages } from "./content";

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://co-r-e.github.io";
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
  const siteUrl = `${getSiteUrl()}${getBasePath()}`;

  const lines: string[] = [
    "# Cerememory",
    "",
    "> Cerememory is an open-source, neuroscience-inspired memory database that gives AI systems persistent, evolving memory across sessions. It is LLM-agnostic (Claude, GPT, Gemini, and others), user-sovereign, local-first, and built in Rust.",
    "",
    "## Core concepts (read this first)",
    "",
    "- **CMP (Cerememory Protocol)** is the single, transport-agnostic protocol for every operation against Cerememory. All messages are versioned and organized into four categories: `encode.*`, `recall.*`, `lifecycle.*`, `introspect.*`.",
    "- **HTTP, gRPC, and MCP are transport bindings for CMP**, not separate APIs. HTTP and gRPC expose the full CMP surface. MCP exposes a curated 15-tool subset designed for LLM agents. When an LLM agent calls an MCP tool, the tool invokes CMP under the hood.",
    "- **Five memory stores**, each modeled after a brain region: Episodic (hippocampus), Semantic (neocortex), Procedural (basal ganglia), Emotional (amygdala), Working (prefrontal cortex).",
    "- **Living memory dynamics**: memories decay over time on a power-law curve, accumulate interference noise, are modulated by an 8-dimensional emotion vector, and can reactivate through spreading activation.",
    "- **Two recall modes**: `Human` (realistic recall with fidelity-weighted noise) and `Perfect` (complete retrieval of original data).",
    "- **User-sovereign**: local-first, fully exportable to a single-file JSON Lines CMA archive (with optional ChaCha20-Poly1305 + Argon2id encryption), MIT-licensed.",
    "- **Implementation**: Core engine in Rust (redb, Tantivy, hnsw_rs, MessagePack, Axum + Tonic + rmcp). Distributed as source only — you clone the repository and build the `cerememory` binary with `cargo build -p cerememory-cli --release`. There are no published GitHub Releases, crates.io, Docker, PyPI, or npm artifacts.",
    "- **MCP operation mode**: run one long-lived `cerememory serve` process per data directory and point every MCP client at it with `cerememory mcp --server-url http://127.0.0.1:8420`. `--server-url` is required — there is no embedded-store MCP mode.",
    "",
    `- Website: ${siteUrl}/`,
    `- Full documentation (single file for LLMs): ${siteUrl}/llms-full.txt`,
    "- Source: https://github.com/co-r-e/cerememory",
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
    "# Cerememory - Full Documentation",
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
