import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt = "Cerememory — A Living Memory Database for the Age of AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadLogoDataUrl(): string {
  const svgPath = path.join(process.cwd(), "public", "logo.svg");
  const svg = fs.readFileSync(svgPath, "utf-8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default async function OpenGraphImage(): Promise<ImageResponse> {
  const logoDataUrl = loadLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          padding: "0 80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 80,
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8B1A2B",
          }}
        >
          Cerememory
        </div>
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 80,
            fontSize: 18,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#A8A29E",
          }}
        >
          Open Source · MIT
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUrl}
          alt="Cerememory"
          width={840}
          height={166}
          style={{ marginTop: 24 }}
        />
        <div
          style={{
            marginTop: 56,
            fontSize: 32,
            color: "#1C1917",
            textAlign: "center",
            lineHeight: 1.4,
            fontStyle: "italic",
          }}
        >
          A Living Memory Database for the Age of AI
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 20,
            color: "#57534E",
            textAlign: "center",
            letterSpacing: "0.04em",
          }}
        >
          Brain-inspired · LLM-Agnostic · User-Sovereign
        </div>
      </div>
    ),
    { ...size },
  );
}
