"use client";

import { Fragment, useCallback, useRef, useState } from "react";
import { useScrub } from "@/hooks/useScrub";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const setVar = (el: HTMLElement | null, k: string, v: string) => {
  if (el) el.style.setProperty(k, v);
};

/* 진행도 매핑 상수 */
const A1_DWELL = 0.16; // ACT1 가라오케 채움 구간
const PANELS = 8; // 0=ACT1, 1..6=sole-agent, 7=ACT3
const LAST = PANELS - 1;

// 스텝 슬라이드: 각 패널에서 HOLD 만큼 머물다 다음으로 미끄러짐 → "한 섹션씩 넘어가는" 느낌
const smooth = (x: number) => x * x * (3 - 2 * x);
const STEP_HOLD = 0.5;
const stepped = (s: number) => {
  const i = Math.floor(s);
  const f = s - i;
  return i + (f <= STEP_HOLD ? 0 : smooth((f - STEP_HOLD) / (1 - STEP_HOLD)));
};

/* ACT1 가라오케 문구 — 단어가 채워짐. flag=원산지 강조, br=줄바꿈 */
const ACT1_WORDS: { t: string; flag?: string; br?: boolean }[] = [
  { t: "Made" }, { t: "in" }, { t: "Europe" }, { t: "—", br: true },
  { t: "authentic" }, { t: "to" }, { t: "the" }, { t: "origin.", br: true },
  { t: "Blum", flag: "🇦🇹" }, { t: "·" }, { t: "AGOFORM", flag: "🇩🇪" },
  { t: "·" }, { t: "Peka", flag: "🇨🇭", br: true },
  { t: "원산지" }, { t: "그대로," }, { t: "one" }, { t: "trusted" },
  { t: "channel." },
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

function Act1Karaoke() {
  const n = ACT1_WORDS.length;
  return (
    <>
      <div className="s5-act1bg" />
      <div className="s5-act1scrim" />
      <div className="s5-kara">
        <p>
          {ACT1_WORDS.map((w, i) => (
            <Fragment key={i}>
              <span
                className={`s5-w${w.flag ? " s5-w--brand" : ""}`}
                style={
                  {
                    "--at": ((i / (n - 1)) * 0.85).toFixed(3),
                  } as React.CSSProperties
                }
              >
                {w.t}
                {w.flag ? <span className="s5-w__fl"> {w.flag}</span> : null}{" "}
              </span>
              {w.br ? <br /> : null}
            </Fragment>
          ))}
        </p>
      </div>
    </>
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
    // p → scenePos(0..7) 선형 → stepped(체류→슬라이드) 로 한 패널씩 머물게
    const scene =
      p <= A1_DWELL ? 0 : ((p - A1_DWELL) / (1 - A1_DWELL)) * LAST;
    const sv = stepped(scene); // 화면 위치/상태는 stepped 기준
    setVar(track, "--scene", sv.toFixed(4));

    // ACT1 가라오케 채움 진행도(0→1) — dwell 구간 그대로(자유 스크럽)
    const a1 = p <= A1_DWELL ? p / A1_DWELL : 1;
    setVar(sec, "--a1", a1.toFixed(4));

    // ACT2 sole-agent 진행(0..6) → 레일 게이지 --sa, 현재 인덱스
    const sa = clamp(sv - 1, 0, FACETS.length - 1);
    setVar(sec, "--sa", sa.toFixed(4));

    // ACT3 마무리 reveal
    const a3 = clamp((sv - 6.2) / 0.8, 0, 1);
    setVar(sec, "--a3", a3.toFixed(4));

    // 노드 레일(숫자 1~6)은 ACT2 구간에서만 노출
    setVar(sec, "--rail", sv >= 0.8 && sv <= 6.5 ? "1" : "0");

    const idx = clamp(Math.round(sv) - 1, 0, FACETS.length - 1);
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
            <Act1Karaoke />
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
