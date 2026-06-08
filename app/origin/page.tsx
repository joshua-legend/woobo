import type { Metadata } from "next";
import OriginClient from "./OriginClient";

export const metadata: Metadata = {
  title: "기원 서사 — Woobo · Blum 한국 독점 에이전트",
  description:
    "‘좋은 움직임이 좋은 가구를 만든다.’ 우보인터내셔날의 여정과 Blum 헤리티지, 그리고 Blum 한국 독점 에이전트·전국 쇼룸으로.",
};

export default function OriginPage() {
  return <OriginClient />;
}
