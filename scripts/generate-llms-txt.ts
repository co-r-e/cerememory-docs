import path from "node:path";

// Set NEXT_PUBLIC_BASE_PATH before importing llms-txt module.
// This mirrors the basePath logic in next.config.ts.
if (!process.env.NEXT_PUBLIC_BASE_PATH) {
  process.env.NEXT_PUBLIC_BASE_PATH =
    process.env.NODE_ENV === "production" ? "/cerememory-docs" : "";
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
