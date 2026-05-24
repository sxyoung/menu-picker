import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { buildShareMetadata, getSiteUrl, shareMetadata, SITE_NAME } from "@/lib/share-metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...buildShareMetadata({
    title: shareMetadata.home.title,
    description: shareMetadata.home.description,
    path: "/",
  }),
  title: {
    default: shareMetadata.home.title,
    template: `%s | ${SITE_NAME}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-zinc-100 antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-zinc-100 text-zinc-900">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col bg-zinc-100">
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <footer className="shrink-0 px-5 pb-6 pt-4 text-center text-[11px] text-zinc-400">
            made by 서영
          </footer>
        </div>
      </body>
    </html>
  );
}
