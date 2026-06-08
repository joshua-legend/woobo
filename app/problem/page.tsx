import type { Metadata } from "next";
import ProblemClient from "./ProblemClient";

export const metadata: Metadata = {
  title: "문제해결 — Woobo · Blum 한국 독점 에이전트",
  description:
    "병행수입·유사품·실물 미확인의 불안을 정품의 공식 통로 Blum 한국 독점 에이전트 우보브랜드샵과 전국 쇼룸 직접 체험으로 해결합니다.",
};

export default function ProblemPage() {
  return <ProblemClient />;
}
