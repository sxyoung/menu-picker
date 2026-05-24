import type { Metadata } from "next";
import { buildShareMetadata, shareMetadata } from "@/lib/share-metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { code } = await params;
  const roomCode = code.toUpperCase();
  const title = shareMetadata.room.title(roomCode);
  const description = shareMetadata.room.description;

  return buildShareMetadata({
    title,
    description,
    path: `/room/${roomCode}`,
  });
}

export default function RoomLayout({ children }: Pick<Props, "children">) {
  return children;
}
