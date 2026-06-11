"use client";

import { useCallback, useRef, useState } from "react";
import { useScrub } from "@/hooks/useScrub";

/* 키워드 5종 ↔ 우측 스테이지 매핑 (pin 공통) */
const FACETS = [
  { kw: "Blum 한국 독점 에이전트", proof: "한국 독점 에이전트 — sole agent" },
  { kw: "정품의 공식 통로", proof: "정품은 공식 통로 한 곳을 거칩니다" },
  { kw: "전국 오프라인 쇼룸", proof: "김포 · 용인 · 부산 — 방문 예약제" },
  { kw: "프리미엄 멀티브랜드 수입", proof: "Blum · AGOFORM · Peka 등" },
  { kw: "자체 가구 생산 (김포 본점)", proof: "하드웨어부터 완제품까지" },
];

// story 씬별 배경 틴트(이미지 없을 때·가장자리에 은은히 비침) — 스크롤 진행 시 색 변화
const SCENE_TINTS = ["#1d1812", "#15191a", "#1b1410", "#13171a", "#1c1813"];

/* =========================== pin · story (가운데 텍스트 + 뒷배경 횡스크롤 팬) =========================== */
export function IdentityPin() {
  const secRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const onUpdate = useCallback((p: number) => {
    const el = secRef.current;
    // 페이즈 인덱스 + 페이즈 내부 진행도(--story-local 0→1, 진행바·패럴럭스용)
    const n = FACETS.length;
    const scaled = p * n;
    const next = Math.min(n - 1, Math.max(0, Math.floor(scaled)));
    const local = Math.min(1, Math.max(0, scaled - next));
    if (el) {
      el.style.setProperty("--story-local", local.toFixed(4));
      // 글 페이드: 페이즈 시작/끝에서 부드럽게 들어오고 나감(가운데 고정)
      const fade = Math.max(0, Math.min(local / 0.15, (1 - local) / 0.15, 1));
      el.style.setProperty("--story-text", fade.toFixed(3));
      // 씬 커버: 페이즈 진입 시 그 씬이 아래→위로 덮어 올라옴(clip 0→full)
      for (let i = 1; i < n; i++) {
        const cov = Math.min(1, Math.max(0, (scaled - i) / 0.5));
        el.style.setProperty(`--cov-${i}`, cov.toFixed(4));
      }
    }
    if (next === activeRef.current) return;
    activeRef.current = next;
    setActive(next);
  }, []);

  useScrub(secRef, onUpdate, { start: "top top", end: "bottom bottom" });

  return (
      <section
        className="section--dark identity identity--story"
        id="identity"
        data-section="identity"
        data-theme="dark"
        data-screen-label="02 정체성"
        ref={secRef}
      >
        <div className="identity__sticky">
          <div className="story-bg" aria-hidden="true">
            <div className="story-bg__far" />
            <div className="story-bg__scenes">
              {FACETS.map((f, i) => (
                <div
                  key={f.kw}
                  className="story-bg__scene"
                  style={{
                    backgroundColor: SCENE_TINTS[i],
                    backgroundImage: `url(/images/identity/identity-card-${i + 1}.png)`,
                  }}
                />
              ))}
            </div>
            <div className="story-bg__near" />
            <div className="story-bg__scrim" />
          </div>
          <div className="story-center">
            <div className="story-top">
              <span className="eyebrow reveal-up">
                <span className="num">02</span> / 정체성
              </span>
              <p className="story-claim reveal-up d1">
                우리는 <span className="hl">Blum 한국 독점 에이전트</span>입니다.
              </p>
            </div>
            <div className="story-mid">
              <div className="story-beat">
                <p className="story-chapter">
                  {String(active + 1).padStart(2, "0")} / 05
                </p>
                <h2 className="story-head">{FACETS[active].kw}</h2>
                <p className="story-proof">{FACETS[active].proof}</p>
              </div>
            </div>
            <div className="story-bottom">
              <div className="story-progress">
                <i />
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

/* =========================== 셀렉터 =========================== */
export function IdentityByVariant({
  variant: _variant,
  stage: _stage,
}: {
  variant: string;
  stage: string;
}) {
  return <IdentityPin />;
}
