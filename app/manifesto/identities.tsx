"use client";

import { useCallback, useRef } from "react";
import { useScrub } from "@/hooks/useScrub";

/* =========================== pin (현행) =========================== */
const IDENTITY_KEYWORDS = [
  "Blum 한국 독점 에이전트",
  "정품의 공식 통로",
  "전국 오프라인 쇼룸",
  "프리미엄 멀티브랜드 수입",
  "자체 가구 생산 (김포 본점)",
];

export function IdentityPin() {
  const secRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const activeRef = useRef(0);

  const onUpdate = useCallback((p: number) => {
    const n = IDENTITY_KEYWORDS.length;
    const next = Math.min(n - 1, Math.max(0, Math.floor(p * n)));
    if (next === activeRef.current) return;
    activeRef.current = next;
    itemsRef.current.forEach((li, i) => {
      if (li) li.classList.toggle("is-active", i === next);
    });
  }, []);

  useScrub(secRef, onUpdate, { start: "top top", end: "bottom bottom" });

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
          <p className="identity__kicker reveal-up d3">우리는 또한 —</p>
          <ul className="identity__loop" aria-hidden="true">
            {IDENTITY_KEYWORDS.map((kw, i) => (
              <li
                key={kw}
                className={`identity__kw${i === 0 ? " is-active" : ""}`}
                ref={(el) => {
                  if (el) itemsRef.current[i] = el;
                }}
              >
                {kw}
              </li>
            ))}
          </ul>
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
export function IdentityByVariant({ variant }: { variant: string }) {
  if (variant === "stamp") return <IdentityStamp />;
  if (variant === "marquee") return <IdentityMarquee />;
  return <IdentityPin />;
}
