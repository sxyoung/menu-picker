import { ImageResponse } from "next/og";
import { shareMetadata } from "@/lib/share-metadata";

export const alt = shareMetadata.home.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(145deg, #fff7ed 0%, #f4f4f5 55%, #ffedd5 100%)",
          padding: 64,
        }}
      >
        <div style={{ fontSize: 88, marginBottom: 24 }}>🍽️</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#18181b",
            letterSpacing: "-0.02em",
          }}
        >
          {shareMetadata.home.title}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#52525b",
            textAlign: "center",
            lineHeight: 1.45,
            maxWidth: 900,
          }}
        >
          {shareMetadata.home.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
