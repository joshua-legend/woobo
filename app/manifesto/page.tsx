import type { Metadata } from "next";
import ManifestoClient from "./ManifestoClient";
import { resolveVariants } from "@/lib/variants";

export const metadata: Metadata = {
  title: "매니페스토 — Woobo · Blum 한국 독점 에이전트",
  description:
    "직접 보고 결정하세요 — 정품의 공식 통로 Blum 한국 독점 에이전트 우보가 소프트클로즈·무공구 시공·TIP-ON을 전국 쇼룸에서 직접 체험으로 증명합니다.",
};

// 검수 기간엔 ?hero=... 로 변주를 고르므로 동적 렌더. 변주 확정·스위처 제거 후 정적 복귀.
export default async function ManifestoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const variants = resolveVariants(await searchParams);
  return <ManifestoClient variants={variants} />;
}
