"use client";

import { useCallback, useRef, useState } from "react";
import { useScrub } from "@/hooks/useScrub";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const setVar = (el: HTMLElement | null, k: string, v: string) => {
  if (el) el.style.setProperty(k, v);
};

/* 진행도 매핑 상수 */
const A1_DWELL = 0.12; // ACT1 카드 던지기 구간
const PANELS = 8; // 0=ACT1, 1..6=sole-agent, 7=ACT3
const LAST = PANELS - 1;

/* 오리진(ACT1) — 던지는 순서 = 쌓이는 순서, Blum 맨 위·강조 */
const ORIGINS = [
  { name: "AGOFORM", country: "독일", flag: "🇩🇪", img: "agoform", rot: "-11deg" },
  { name: "Peka", country: "스위스", flag: "🇨🇭", img: "peka", rot: "6deg" },
  { name: "Blum", country: "오스트리아", flag: "🇦🇹", img: "blum", rot: "-4deg", flagship: true },
];

/* sole agent 6가지(ACT2) — 기존 콘텐츠 유지 */
const FACETS = [
  { t: "Blum 한국 독점 에이전트", d: "정품의 공식 통로 · sole agent", img: "sole-agent-01" },
  { t: "정품 보장 (유사품 차단)", d: "A/S · 부품 통로 확보", img: "sole-agent-02" },
  { t: "프리미엄 멀티브랜드 수입", d: "유럽 하드웨어 · 소재 전문", img: "sole-agent-03" },
  { t: "가구 하드웨어 전문성", d: "제작 현장을 아는 상담", img: "sole-agent-04" },
  { t: "전국 쇼룸 직접 체험", d: "실물 확인 · 방문 예약제", img: "sole-agent-05" },
  { t: "자체 가구 생산 (김포 본점)", d: "하드웨어부터 완제품까지", img: "sole-agent-06" },
];

function Act1Stack() {
  return (
    <div className="s5-deck">
      {ORIGINS.map((o, i) => (
        <div
          key={o.name}
          className={`s5-deckcard${o.flagship ? " is-flag" : ""}`}
          style={
            {
              "--ci": `var(--c${i + 1})`,
              "--rot": o.rot,
              zIndex: i + 1,
            } as React.CSSProperties
          }
        >
          <div className="s5-deckcard__img" data-ph={o.img} />
          <div className="s5-deckcard__meta">
            <b>{o.name}</b>
            <span>
              {o.flag} {o.country}
              {o.flagship ? " · 간판" : ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function NodeRail({ active }: { active: number }) {
  return (
    <div className="s5-rail" aria-hidden="true">
      <span className="s5-rail__track">
        <i className="s5-rail__fill" />
      </span>
      {FACETS.map((_f, i) => (
        <span
          key={i}
          className={`s5-rail__node${i <= active ? " is-lit" : ""}${i === active ? " is-cur" : ""}`}
        >
          {i + 1}
        </span>
      ))}
    </div>
  );
}

function Act3Closing() {
  return (
    <div className="s5-closing">
      <p className="s5-closing__eyebrow">한국 독점 에이전트 · sole agent</p>
      <h2 className="s5-closing__head">당신의 공간에 정품의 기준을.</h2>
      <p className="s5-closing__sub">Blum 한국 독점 에이전트, 우보브랜드샵.</p>
      <a className="s5-closing__cta" href="#showroom">
        전국 쇼룸 방문 예약 <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

function Section5Scroll() {
  const secRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const onUpdate = useCallback((p: number) => {
    const track = trackRef.current;
    const sec = secRef.current;
    // p → scenePos (0..7): ACT1 dwell 후 선형 sweep
    const scene =
      p <= A1_DWELL ? 0 : ((p - A1_DWELL) / (1 - A1_DWELL)) * LAST;
    setVar(track, "--scene", scene.toFixed(4));

    // ACT1 카드 로컬 진행 → 카드별 --c1/--c2/--c3
    const a1 = p <= A1_DWELL ? p / A1_DWELL : 1;
    for (let i = 0; i < ORIGINS.length; i++) {
      const ci = clamp(a1 * ORIGINS.length - i, 0, 1);
      setVar(sec, `--c${i + 1}`, ci.toFixed(4));
    }

    // ACT2 sole-agent 진행(0..6) → 레일 게이지 --sa, 현재 인덱스
    const sa = clamp(scene - 1, 0, FACETS.length - 1);
    setVar(sec, "--sa", sa.toFixed(4));

    // ACT3 마무리 reveal
    const a3 = clamp((scene - 6.2) / 0.8, 0, 1);
    setVar(sec, "--a3", a3.toFixed(4));

    const idx = clamp(Math.round(scene) - 1, 0, FACETS.length - 1);
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, []);

  useScrub(secRef, onUpdate, { start: "top top", end: "bottom bottom" });

  return (
    <section
      className="section s5"
      data-section="trust"
      data-theme="dark"
      data-screen-label="05 약속"
      ref={secRef}
    >
      <div className="s5__sticky">
        <div className="s5__track" ref={trackRef}>
          {/* ACT1 */}
          <div className="s5-panel s5-act1">
            <span className="s5-label">유럽 제조 · 원산지</span>
            <Act1Stack />
          </div>
          {/* ACT2 — sole agent 6 */}
          {FACETS.map((f, i) => (
            <div className="s5-panel s5-sa" key={f.t}>
              <div className="s5-sa__bg" data-ph={f.img} />
              <div className="s5-sa__scrim" />
              <div className="s5-sa__txt">
                <span className="s5-sa__no">
                  {String(i + 1).padStart(2, "0")} / 06
                </span>
                <h3 className="s5-sa__ttl">{f.t}</h3>
                <p className="s5-sa__ds">{f.d}</p>
              </div>
            </div>
          ))}
          {/* ACT3 */}
          <div className="s5-panel s5-act3">
            <span className="s5-label">고객에게</span>
            <Act3Closing />
          </div>
        </div>
        <NodeRail active={active} />
      </div>
    </section>
  );
}

/* =========================== [05] 약속 (Trust · 횡스크롤) =========================== */
export function TrustByVariant({ variant: _variant }: { variant: string }) {
  return <Section5Scroll />;
}
