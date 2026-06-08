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

/* ---------- 우측 스테이지 변주: card (이미지 카드) ---------- */
// 키워드별 풀카드 이미지 + 하단 텍스트 오버레이. 이미지 없으면 .ph 해치 폴백.
function StageCard({ i }: { i: number }) {
  const f = FACETS[i];
  return (
    <div
      className="pin-card ph"
      data-ph={`identity-card-${i + 1}`}
    >
      <div
        className="pin-card__img"
        style={{
          backgroundImage: `url(/images/identity/identity-card-${i + 1}.png)`,
        }}
      />
      <div className="pin-card__overlay" />
      <div className="pin-card__txt">
        <b>{f.kw}</b>
        <span>{f.proof}</span>
      </div>
    </div>
  );
}

/* ---------- 우측 스테이지 변주: demo (항목별 미니 인터랙션) ---------- */
function StageDemo({ i }: { i: number }) {
  switch (i) {
    case 0:
      return (
        <div className="pd pd-seal">
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r="30" />
            <path d="M27 41 L36 50 L54 28" />
          </svg>
          <span>SOLE AGENT</span>
        </div>
      );
    case 1:
      return (
        <div className="pd pd-route">
          <div className="pd-route__row pd-route__row--ok">
            <b>정품의 공식 통로</b>
            <span className="pd-route__track">
              <i />
            </span>
          </div>
          <div className="pd-route__row pd-route__row--no">
            <b>유사품 · 병행수입</b>
            <span className="pd-route__track" />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="pd pd-map">
          <svg viewBox="0 0 100 132" className="pd-map__svg" aria-hidden="true">
            <path
              className="pd-map__land"
              d="M50 8 L63 12 L67 23 L79 29 L74 41 L85 53 L80 65 L89 80 L78 93 L83 105 L70 113 L60 109 L52 118 L44 111 L40 97 L30 91 L35 77 L26 67 L32 53 L24 43 L35 35 L30 22 L42 18 Z"
            />
            <g className="pd-map__pin">
              <circle cx="44" cy="41" r="3.4" />
              <text x="49" y="42.5">김포</text>
            </g>
            <g className="pd-map__pin">
              <circle cx="50" cy="53" r="3.4" />
              <text x="55" y="54.5">용인</text>
            </g>
            <g className="pd-map__pin">
              <circle cx="78" cy="98" r="3.4" />
              <text x="54" y="99.5">부산</text>
            </g>
          </svg>
        </div>
      );
    case 3:
      return (
        <div className="pd pd-logos">
          <span className="pd-chip">Blum</span>
          <span className="pd-chip">AGOFORM</span>
          <span className="pd-chip">Peka</span>
          <span className="pd-chip pd-chip--more">+ more</span>
        </div>
      );
    default:
      return (
        <div className="pd pd-line">
          <div className="pd-line__rail" />
          <div className="pd-line__part" />
          <span>click · 김포 자체 생산</span>
        </div>
      );
  }
}

/* ---------- 우측 스테이지 변주: diagram (SVG draw) ---------- */
function StageDiagram({ i }: { i: number }) {
  const dia = [
    <svg key="d" viewBox="0 0 220 80" className="pin-dia">
      <line x1="16" y1="40" x2="86" y2="40" />
      <circle cx="110" cy="40" r="18" />
      <line x1="134" y1="40" x2="204" y2="40" />
    </svg>,
    <svg key="d" viewBox="0 0 220 90" className="pin-dia">
      <line x1="16" y1="45" x2="80" y2="45" />
      <path d="M80 45 L150 20" className="ok" />
      <path d="M80 45 L150 70" className="no" />
    </svg>,
    <svg key="d" viewBox="0 0 220 100" className="pin-dia">
      <path d="M60 14 L150 14 L170 50 L120 86 L50 70 L40 36 Z" />
      <circle cx="92" cy="40" r="4" />
      <circle cx="110" cy="52" r="4" />
      <circle cx="128" cy="66" r="4" />
    </svg>,
    <svg key="d" viewBox="0 0 220 90" className="pin-dia">
      <rect x="40" y="16" width="140" height="16" rx="3" />
      <rect x="40" y="37" width="140" height="16" rx="3" />
      <rect x="40" y="58" width="140" height="16" rx="3" />
    </svg>,
    <svg key="d" viewBox="0 0 220 90" className="pin-dia">
      <path d="M30 74 V36 L110 12 L190 36 V74" />
      <path d="M90 74 V52 L130 52 V74" />
    </svg>,
  ];
  return (
    <div className="pin-dia-wrap">
      {dia[i]}
      <span className="pin-dia__cap">{FACETS[i].kw}</span>
    </div>
  );
}

function PinStage({ variant, active }: { variant: string; active: number }) {
  return (
    <div className={`pin-stage pin-stage--${variant}`} aria-hidden="true">
      {FACETS.map((f, i) => (
        <div
          key={f.kw}
          className={`pin-stage__item${i === active ? " is-active" : ""}`}
        >
          {variant === "card" && <StageCard i={i} />}
          {variant === "image" && (
            <div
              className="pin-stage__ph ph"
              data-ph={`identity-${i + 1} · ${f.kw} (실물 교체)`}
            />
          )}
          {variant === "diagram" && <StageDiagram i={i} />}
          {variant === "demo" && <StageDemo i={i} />}
        </div>
      ))}
    </div>
  );
}

/* =========================== pin (좌우 분할 · 우측 스테이지 동기) =========================== */
export function IdentityPin({ stage = "card" }: { stage?: string }) {
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

  // story: 가운데 텍스트 + 뒷배경 횡스크롤 팬(사이드스크롤)
  if (stage === "story") {
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
                    backgroundImage: `url(/images/identity/identity-story-${i + 1}.png)`,
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

  return (
    <section
      className="section--dark identity"
      id="identity"
      data-section="identity"
      data-theme="dark"
      data-screen-label="02 정체성"
      ref={secRef}
    >
      <div className="identity__sticky">
        <div className="inner identity__grid">
          <div className="identity__left">
            <span className="eyebrow reveal-up">
              <span className="num">02</span> / 정체성
            </span>
            <h2 className="reveal-up d1">
              우리는 <span className="hl">Blum 한국 독점 에이전트</span>입니다.
            </h2>
            <p className="lede reveal-up d2">
              우보인터내셔날 주식회사 — 프리미엄 가구 하드웨어·소재 수입 전문.
            </p>
            <p className="identity__kicker reveal-up d3">우리는 또한 —</p>
            <ul className="identity__loop" aria-hidden="true">
              {FACETS.map((f, i) => (
                <li
                  key={f.kw}
                  className={`identity__kw${i === active ? " is-active" : ""}`}
                >
                  {f.kw}
                </li>
              ))}
            </ul>
          </div>
          <div className="identity__right">
            <PinStage variant={stage} active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== stamp (자격 도장) =========================== */
const STAMP_FACETS = [
  { t: "정품의 공식 통로", d: "sole agent — 정품은 한 곳을 거칩니다" },
  { t: "전국 오프라인 쇼룸", d: "실물 확인 · 방문 예약제" },
  { t: "프리미엄 멀티브랜드 수입", d: "Blum · AGOFORM · Peka 등" },
  { t: "가구 하드웨어 전문성", d: "제작 현장을 아는 상담" },
  { t: "자체 가구 생산 (김포 본점)", d: "하드웨어부터 완제품까지" },
];

export function IdentityStamp() {
  return (
    <section
      className="section section--dark identity-stamp"
      id="identity"
      data-section="identity"
      data-theme="dark"
      data-screen-label="02 정체성"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">02</span> / 정체성
        </span>
        <h2 className="reveal-up d1">
          우리는 <span className="hl">Blum 한국 독점 에이전트</span>입니다.
        </h2>
        <p className="lede reveal-up d2">
          우보인터내셔날 주식회사 — 프리미엄 가구 하드웨어·소재 수입 전문.
        </p>
        <ul className="identity-stamp__list">
          {STAMP_FACETS.map((f, i) => (
            <li
              key={f.t}
              className="identity-stamp__row reveal-up"
              style={
                { "--reveal-delay": `${0.12 + i * 0.1}s` } as React.CSSProperties
              }
            >
              <svg className="identity-stamp__seal" viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="19" />
                <path d="M13 22.5 L19.5 29 L31 16" />
              </svg>
              <div className="identity-stamp__txt">
                <b>{f.t}</b>
                <span>{f.d}</span>
              </div>
              <span className="identity-stamp__no">
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>
        <p className="identity-stamp__foot reveal-up">
          유사품에 주의하십시오 — 정품 Blum은 한국 독점 에이전트 우보에서.
        </p>
      </div>
    </section>
  );
}

/* =========================== marquee (흐르는 키워드 띠) =========================== */
const MQ_WORDS = [
  ["정품의 공식 통로", "OFFICIAL CHANNEL"],
  ["전국 오프라인 쇼룸", "NATIONWIDE SHOWROOM"],
  ["프리미엄 멀티브랜드 수입", "MULTI-BRAND IMPORT"],
  ["가구 하드웨어 전문성", "HARDWARE EXPERTS"],
  ["자체 가구 생산 · 김포", "OWN PRODUCTION"],
];

function MarqueeBand() {
  return (
    <>
      {MQ_WORDS.map((w) => (
        <span className="identity-mq__item" key={w[0]}>
          {w[0]} <i>· {w[1]} ·</i>{" "}
        </span>
      ))}
    </>
  );
}

export function IdentityMarquee() {
  const secRef = useRef<HTMLDivElement>(null);

  const onUpdate = useCallback((p: number) => {
    secRef.current?.style.setProperty("--mq", p.toFixed(4));
  }, []);

  useScrub(secRef, onUpdate, { start: "top bottom", end: "bottom top" });

  return (
    <section
      ref={secRef}
      className="section section--dark identity-mq"
      id="identity"
      data-section="identity"
      data-theme="dark"
      data-screen-label="02 정체성"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">02</span> / 정체성
        </span>
        <h2 className="reveal-up d1">
          우리는 <span className="hl">Blum 한국 독점 에이전트</span>입니다.
        </h2>
        <p className="lede reveal-up d2">
          우보인터내셔날 주식회사 — 프리미엄 가구 하드웨어·소재 수입 전문.
        </p>
      </div>
      <div className="identity-mq__rows" aria-hidden="true">
        <div className="identity-mq__row identity-mq__row--a">
          <div className="identity-mq__track">
            <MarqueeBand />
            <MarqueeBand />
          </div>
        </div>
        <div className="identity-mq__row identity-mq__row--b">
          <div className="identity-mq__track">
            <MarqueeBand />
            <MarqueeBand />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== 셀렉터 =========================== */
export function IdentityByVariant({
  variant,
  stage,
}: {
  variant: string;
  stage: string;
}) {
  if (variant === "stamp") return <IdentityStamp />;
  if (variant === "marquee") return <IdentityMarquee />;
  return <IdentityPin stage={stage} />;
}
