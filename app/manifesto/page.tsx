import type { Metadata } from "next";
import ManifestoClient from "./ManifestoClient";

export const metadata: Metadata = {
  title: "매니페스토 — Woobo · Blum 한국 독점 에이전트",
  description:
    "직접 보고 결정하세요 — 정품의 공식 통로 Blum 한국 독점 에이전트 우보가 소프트클로즈·무공구 시공·TIP-ON을 전국 쇼룸에서 직접 체험으로 증명합니다.",
};

export default function ManifestoPage() {
  return <ManifestoClient />;
}
