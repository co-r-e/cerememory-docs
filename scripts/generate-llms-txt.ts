import path from "node:path";

// Set NEXT_PUBLIC_BASE_PATH before importing llms-txt module.
// This script runs before `next build`, so NODE_ENV isn't yet production.
// Production deploys always live at /cerememory-docs on GitHub Pages.
if (process.env.NEXT_PUBLIC_BASE_PATH === undefined) {
  process.env.NEXT_PUBLIC_BASE_PATH = "/cerememory-docs";
}
if (process.env.NEXT_PUBLIC_SITE_URL === undefined) {
  process.env.NEXT_PUBLIC_SITE_URL = "https://co-r-e.github.io";
}

import { writeLlmsTxt } from "../src/lib/docs/llms-txt";

const outDir = path.join(process.cwd(), "public");

writeLlmsTxt(outDir)
  .then(() => {
    console.log(`llms.txt and llms-full.txt written to ${outDir}`);
  })
  .catch((err) => {
    console.error("Failed to generate llms.txt:", err);
    process.exit(1);
  });
