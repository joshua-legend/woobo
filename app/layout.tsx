import type { Metadata } from "next";
import { pretendard, plexKR, plexMono } from "./fonts";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import "./globals.css";

export const metadata: Metadata = {
  // TODO: 실제 배포 도메인으로 교체 (og:image 절대경로 해석에 사용)
  metadataBase: new URL("https://woobo.co.kr"),
  title: "Woobo · Blum 한국 독점 에이전트",
  description:
    "우보브랜드샵 — Blum 한국 독점 에이전트(sole agent). 정품의 공식 통로 · 전국 쇼룸 · 프리미엄 하드웨어 수입 전문.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "우보브랜드샵 (Woobo)",
    title: "정품의 공식 통로 — Woobo",
    description:
      "Blum 한국 독점 에이전트(sole agent). 유사품 주의 — 정품 하드웨어는 우보브랜드샵에서. 전국 쇼룸 방문 예약.",
    // TODO: 실물 OG 이미지(1200×630)로 교체 — /public/og.png
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "우보브랜드샵 — Blum 한국 독점 에이전트",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "정품의 공식 통로 — Woobo",
    description:
      "Blum 한국 독점 에이전트(sole agent). 유사품 주의 — 정품 하드웨어는 우보브랜드샵에서. 전국 쇼룸 방문 예약.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${plexKR.variable} ${plexMono.variable}`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
