"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrub } from "@/hooks/useScrub";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* 히어로 공통 하단(서브 + 푸터). 3안이 동일하게 사용. */
function HeroBody() {
  return (
    <>
      <p className="lede reveal-up d3">
        가구 하드웨어 전문가의 신념. 그래서 우리는 Blum을 한국에서{" "}
        <span className="hl">독점으로</span> 다룹니다.
      </p>
      <div className="hero__foot reveal-up d4">
        <a className="btn btn--secondary" href="#identity">
          우리가 누구인지 ↓
        </a>
        <span className="hero__scroll">
          Woobo · Blum 한국 독점 에이전트 + 전국 쇼룸 <span className="line" /> 8
          sections
        </span>
      </div>
    </>
  );
}

/* =========================== kinetic (기본) =========================== */
// 현행 히어로 + '움직임' --ease-tip 팝 + 미세 드리프트. 이미지 0장, 신규 JS 0.
export function HeroKinetic() {
  return (
    <section
      className="section section--dark hero hero--kinetic"
      data-section="hero"
      data-theme="dark"
      data-screen-label="01 선언"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">01</span> / 선언
        </span>
        <h1>
          <span className="reveal-mask">
            <span>우리는</span>
          </span>
          <br />
          <span className="reveal-mask d1">
            <span>
              <span className="hero__pop">움직임</span>을
            </span>
          </span>
          <br />
          <span className="reveal-mask d2">
            <span>믿습니다.</span>
          </span>
        </h1>
        <HeroBody />
      </div>
    </section>
  );
}

/* =========================== slot (단어 ↔ 배경 교체) =========================== */
const SLOT_WORDS = [
  { w: "움직임", bg: "hero-bg-motion", cap: "닫히는 서랍 매크로 — ‘움직임’" },
  { w: "정밀", bg: "hero-bg-precision", cap: "힌지 메탈 클로즈업 — ‘정밀’" },
  { w: "정품", bg: "hero-bg-authentic", cap: "각인 표면 추상(무드) — ‘정품’" },
  { w: "디테일", bg: "hero-bg-detail", cap: "누르는 손끝 — ‘디테일’" },
];

export function HeroSlot() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduce) {
      setIdx(0);
      return;
    }
    let count = 0;
    const id = window.setInterval(() => {
      count += 1;
      if (count > 6) {
        // ~1.5바퀴 후 '움직임'(idx 0)에서 정지
        setIdx(0);
        window.clearInterval(id);
        return;
      }
      setIdx(count % SLOT_WORDS.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section
      className="section section--dark hero hero--slot"
      data-section="hero"
      data-theme="dark"
      data-screen-label="01 선언"
    >
      <div className="hero--slot__bgs" aria-hidden="true">
        {SLOT_WORDS.map((s, i) => (
          <div
            key={s.bg}
            className={`hero--slot__bg${i === idx ? " is-active" : ""}`}
            style={{ backgroundImage: `url(/images/hero/${s.bg}.png)` }}
          />
        ))}
        <div className="hero--slot__scrim" />
      </div>
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">01</span> / 선언
        </span>
        <h1 className="hero--slot__h1">
          <span className="reveal-mask">
            <span>우리는</span>
          </span>
          <span className="hero--slot__slot" aria-live="polite">
            {SLOT_WORDS.map((s, i) => (
              <span
                key={s.w}
                className={`hero--slot__word${i === idx ? " is-active" : ""}`}
              >
                {s.w}
              </span>
            ))}
          </span>
          <span className="reveal-mask d1">
            <span>을 믿습니다.</span>
          </span>
        </h1>
        <HeroBody />
      </div>
    </section>
  );
}

/* =========================== aperture (단어 = 조리개) =========================== */
export function HeroAperture() {
  const secRef = useRef<HTMLDivElement>(null);

  // 진행도(--ap)를 섹션에 세팅 → 배경/스크림/글자가 상속해 읽음.
  const onUpdate = useCallback((p: number) => {
    secRef.current?.style.setProperty("--ap", p.toFixed(4));
  }, []);

  useScrub(secRef, onUpdate, { start: "top top", end: "bottom top" });

  return (
    <section
      ref={secRef}
      className="section section--dark hero hero--aperture"
      data-section="hero"
      data-theme="dark"
      data-screen-label="01 선언"
    >
      <div
        className="hero--aperture__bg ph"
        data-ph="hero-bg-aperture · 와이드 컷 (실물 교체)"
        aria-hidden="true"
      />
      <div className="hero--aperture__scrim" aria-hidden="true" />
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">01</span> / 선언
        </span>
        <h1 className="hero--aperture__h1">
          <span className="reveal-mask">
            <span>우리는</span>
          </span>
          <span className="hero--aperture__word">움직임</span>
          <span className="reveal-mask d1">
            <span>을 믿습니다.</span>
          </span>
        </h1>
        <HeroBody />
      </div>
    </section>
  );
}

/* =========================== 셀렉터 =========================== */
export function HeroByVariant({ variant }: { variant: string }) {
  if (variant === "slot") return <HeroSlot />;
  if (variant === "aperture") return <HeroAperture />;
  return <HeroKinetic />;
}
