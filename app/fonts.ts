import localFont from "next/font/local";
import { IBM_Plex_Sans_KR, IBM_Plex_Mono } from "next/font/google";

// Pretendard — self-hosted variable font (헤드라인/마크)
export const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

// IBM Plex Sans KR — 본문
export const plexKR = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-kr",
});

// IBM Plex Mono — 라벨/eyebrow/모노
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-mono",
});
