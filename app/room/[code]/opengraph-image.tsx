import { ImageResponse } from "next/og";
import { shareMetadata } from "@/lib/share-metadata";

export const alt = "오늘 뭐 먹지? 방 초대";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ code: string }>;
};

export default async function Image({ params }: Props) {
  const { code } = await params;
  const roomCode = (code ?? "").toUpperCase() || "------";
  const title = shareMetadata.room.title(roomCode);

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
            fontSize: 64,
            fontWeight: 700,
            color: "#18181b",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          {title}
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
          {shareMetadata.room.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
