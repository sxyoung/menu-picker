/** 카카오톡·SNS 링크 미리보기 문구 — 여기서 제목·설명을 수정하세요 */
export const SITE_NAME = "오늘 뭐 먹지?";

export const shareMetadata = {
  home: {
    title: "오늘 뭐 먹지?",
    description:
      "친구와 함께 메뉴를 정해 보세요. 방을 만들고 메뉴를 고른 뒤, 랜덤으로 오늘의 메뉴를 정할 수 있어요.",
  },
  room: {
    title: (roomCode: string) => `오늘 뭐 먹지? · ${roomCode}번 방`,
    description: "메뉴 결정 방에 초대됐어요. 링크로 들어와 함께 메뉴를 정해 보세요!",
  },
} as const;

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, "");
  if (production) return `https://${production}`;

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export function buildShareMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}) {
  const url = `${getSiteUrl()}${path}`;

  const imagePath = path === "/" ? "/opengraph-image" : `${path}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      type: "website" as const,
      locale: "ko_KR",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [imagePath],
    },
  };
}
