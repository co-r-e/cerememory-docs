/**
 * Next.js static export emits OpenGraph / Twitter images at extensionless
 * paths (e.g. `out/opengraph-image`). Some scrapers and static hosts assume
 * a `.png` extension when serving content type, so duplicate each file to a
 * `.png` alias next to the original. The `og:image` meta tag continues to
 * reference the extensionless URL Next.js emits; this script just adds a
 * compatibility-friendly alias so JSON-LD and direct embeds work too.
 */
import { copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const projectRoot = process.cwd();
const outDir = join(projectRoot, "out");

const targets = [
  ["opengraph-image", "opengraph-image.png"],
  ["twitter-image", "twitter-image.png"],
  ["ja/opengraph-image", "ja/opengraph-image.png"],
  ["ja/twitter-image", "ja/twitter-image.png"],
] as const;

for (const [src, dst] of targets) {
  const srcPath = join(outDir, src);
  const dstPath = join(outDir, dst);
  if (!existsSync(srcPath)) {
    console.warn(`[finalize-og-images] missing source: ${src}`);
    continue;
  }
  // Ensure target directory exists (it will, but be defensive).
  const dstDir = dirname(dstPath);
  if (!existsSync(dstDir)) {
    console.warn(`[finalize-og-images] missing target dir: ${dstDir}`);
    continue;
  }
  copyFileSync(srcPath, dstPath);
  console.log(`[finalize-og-images] copied ${src} -> ${dst}`);
}
