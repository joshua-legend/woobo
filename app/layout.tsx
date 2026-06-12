import type { Metadata } from "next";
import { pretendard, plexKR, plexMono } from "./fonts";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { KakaoEscape } from "@/components/KakaoEscape";
import "./globals.css";

export const metadata: Metadata = {
  title: "Woobo · Blum 한국 독점 에이전트",
  description:
    "우보브랜드샵 — Blum 한국 독점 에이전트(sole agent). 정품의 공식 통로 · 전국 쇼룸 · 프리미엄 하드웨어 수입 전문.",
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
        <KakaoEscape />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
