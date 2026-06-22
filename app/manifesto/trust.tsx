"use client";

import { Fragment, useCallback, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useScrub } from "@/hooks/useScrub";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const setVar = (el: HTMLElement | null, k: string, v: string) => {
  if (el) el.style.setProperty(k, v);
};

/* 진행도 매핑 상수 */
const A1_DWELL = 0.16; // ACT1 가라오케 채움 구간
const PANELS = 7; // 0=ACT1, 1..6=sole-agent (ACT3 제거 → 바로 섹션6)
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
  { t: "·" }, { t: "Peka", flag: "🇨🇭" }, { t: "·" },
  { t: "BekaertDeslee", flag: "🇧🇪" }, { t: "·" }, { t: "PWG", flag: "🇩🇪", br: true },
  { t: "원산지" }, { t: "그대로," }, { t: "one" }, { t: "trusted" },
  { t: "channel." },
];

/* ACT1 유럽 지도 — 원산지 도장(브랜드 단어 채움 시점 at 에 점등).
   at = 해당 브랜드 단어 인덱스 / (단어수-1=21) * 0.85 와 동기 */
const GEO = "/geo/countries-110m.json";
const GEO_STYLE = {
  default: { fill: "#16130d", stroke: "#2c2920", strokeWidth: 0.4, outline: "none" },
  hover: { fill: "#16130d", stroke: "#2c2920", strokeWidth: 0.4, outline: "none" },
  pressed: { fill: "#16130d", outline: "none" },
} as const;
const ACT1_COUNTRIES = [
  { id: "at", name: "Blum · 오스트리아", code: "AT", coord: [14.3, 47.6], at: 0.324 },
  { id: "de", name: "AGOFORM · 독일", code: "DE", coord: [10.0, 51.0], at: 0.405 },
  { id: "ch", name: "Peka · 스위스", code: "CH", coord: [8.2, 46.8], at: 0.486 },
  { id: "be", name: "BekaertDeslee · 벨기에", code: "BE", coord: [4.4, 50.7], at: 0.567 },
  { id: "de2", name: "PWG · 독일", code: "DE", coord: [13.2, 52.0], at: 0.648 },
] as const;

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
      <div className="s5-act1map">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [11, 50], scale: 1000 }}
          width={960}
          height={540}
          className="s5-map"
          preserveAspectRatio="xMidYMid slice"
        >
          <Geographies geography={GEO}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} style={GEO_STYLE} />
              ))
            }
          </Geographies>
          {ACT1_COUNTRIES.map((c) => (
            <Marker key={c.id} coordinates={c.coord as [number, number]}>
              <g
                className="s5-mk"
                style={{ "--at": c.at } as React.CSSProperties}
              >
                <text className="s5-mk__lbl" y={-22} textAnchor="middle">
                  {c.name}
                </text>
                <circle r={4.5} className="s5-mk__dot" />
                <g className="s5-mk__stamp">
                  <circle r={16} className="s5-mk__ring" />
                  <text className="s5-mk__code" dy="4" textAnchor="middle">
                    {c.code}
                  </text>
                </g>
              </g>
            </Marker>
          ))}
        </ComposableMap>
      </div>
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

function Section5Scroll() {
  const secRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(-1);
  const [active, setActive] = useState(-1);

  const onUpdate = useCallback((p: number) => {
    const track = trackRef.current;
    const sec = secRef.current;
    // p → scenePos(0..7) 선형 → stepped(체류→슬라이드) 로 한 패널씩 머물게
    const scene =
      p <= A1_DWELL ? 0 : ((p - A1_DWELL) / (1 - A1_DWELL)) * LAST;
    const sv = stepped(scene); // 화면 위치/상태는 stepped 기준
    setVar(track, "--scene", sv.toFixed(4));
    // ACT1 이탈 진행도(0=ACT1 머묾, 1=SA1 도착) → 비행기 비행에 사용
    setVar(sec, "--a1exit", clamp(sv, 0, 1).toFixed(4));

    // ACT1 가라오케 채움 진행도(0→1) — dwell 구간 그대로(자유 스크럽)
    const a1 = p <= A1_DWELL ? p / A1_DWELL : 1;
    setVar(sec, "--a1", a1.toFixed(4));

    // ACT2 sole-agent 진행(0..6) → 레일 게이지 --sa, 현재 인덱스
    const sa = clamp(sv - 1, 0, FACETS.length - 1);
    setVar(sec, "--sa", sa.toFixed(4));

    // 노드 레일(숫자 1~6)은 ACT2 구간에서만 노출
    setVar(sec, "--rail", sv >= 0.8 && sv <= 6.5 ? "1" : "0");

    // ACT1 구간(sv<0.5)엔 active 없음(-1) → SA 항목 효과는 ACT2 진입 때만 재생
    const idx =
      sv < 0.5 ? -1 : clamp(Math.round(sv) - 1, 0, FACETS.length - 1);
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
            <div
              className={`s5-panel s5-sa${i === active ? " is-active" : ""}`}
              key={f.t}
            >
              <div
                className="s5-sa__bg"
                style={{
                  backgroundImage: `url(/images/section5/${f.img}.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="s5-sa__scrim" />
              <div className="s5-sa__txt">
                <span className="s5-sa__no">
                  {String(i + 1).padStart(2, "0")} / 06
                </span>
                <h3 className="s5-sa__ttl">{f.t}</h3>
                <span className="s5-sa__underline" aria-hidden="true" />
                <p className="s5-sa__ds">{f.d}</p>
              </div>
            </div>
          ))}
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
