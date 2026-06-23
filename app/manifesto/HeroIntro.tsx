"use client";

import { useEffect, useState } from "react";

// 히어로 배경(프리로드 대상) — 다 받으면 인트로 디졸브.
const HERO_BGS = [
  "/images/hero/hero-bg-motion.webp",
  "/images/hero/hero-bg-precision.webp",
  "/images/hero/hero-bg-authentic.webp",
  "/images/hero/hero-bg-detail.webp",
];

type Variant = "scene" | "minimal" | "off";

/**
 * 페이지 진입 오프닝 오버레이. 히어로 배경 프리로드가 끝나면(또는 최대 시간 후) 자연스럽게 디졸브.
 * 비교용: ?intro=scene (기본) / ?intro=minimal / ?intro=off
 * reduced-motion·SSR-안전·타임아웃 보장(절대 안 멈춤).
 */
export function HeroIntro() {
  const [variant, setVariant] = useState<Variant>("minimal");
  const [phase, setPhase] = useState<"show" | "leaving" | "done">("show");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    // 기본 = 합본(minimal). 비교용: ?intro=scene / ?intro=off
    const q = new URLSearchParams(window.location.search).get("intro");
    const v: Variant =
      q === "scene" ? "scene" : q === "off" ? "off" : "minimal";
    setVariant(v);
    if (v === "off") {
      setPhase("done");
      return;
    }

    const t0 = performance.now();
    const MIN = v === "minimal" ? 2100 : 1500; // 합본은 시퀀스가 길어 더 노출
    const MAX = 3800; // 최대(안 받아져도 무조건 진행)
    let dismissed = false;
    let leaveTimer = 0;
    const finish = () => {
      if (dismissed) return;
      dismissed = true;
      setPhase("leaving");
      leaveTimer = window.setTimeout(() => setPhase("done"), 760);
    };

    let loaded = 0;
    HERO_BGS.forEach((src) => {
      const img = new Image();
      const done = () => {
        loaded += 1;
        if (loaded === HERO_BGS.length) {
          window.setTimeout(finish, Math.max(0, MIN - (performance.now() - t0)));
        }
      };
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
    const maxTimer = window.setTimeout(finish, MAX);
    return () => {
      window.clearTimeout(maxTimer);
      window.clearTimeout(leaveTimer);
    };
  }, []);

  // 인트로 진행 중(show/leaving)에는 스크롤 잠금 — 디졸브 끝나면(또는 unmount) 복구.
  useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    // Lenis/normalizeScroll 는 overflow:hidden 을 우회하므로(JS 가상 스크롤),
    // 인트로 동안 터치/휠을 window 캡처 단계에서 막아 스크롤 자체를 차단한다.
    // (안 막으면 스플래시 중 터치 스크롤로 첫 섹션이 넘어간 채로 시작됨)
    const block = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const opts: AddEventListenerOptions = { capture: true, passive: false };
    window.addEventListener("touchmove", block, opts);
    window.addEventListener("wheel", block, opts);
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      window.removeEventListener("touchmove", block, opts);
      window.removeEventListener("wheel", block, opts);
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`hero-intro intro--${variant}${phase === "leaving" ? " is-leaving" : ""}`}
      aria-hidden="true"
    >
      {variant === "minimal" ? (
        <div className="intro__inner">
          <span className="intro__sweep" />
          <span className="intro__kw">움직임</span>
          <span className="intro__mark">Woobo</span>
          <span className="intro__line" />
          <span className="intro__sub">Blum 한국 독점 에이전트</span>
        </div>
      ) : (
        <div className="intro__inner">
          <span className="intro__sweep" />
          <span className="intro__kw">움직임</span>
          <span className="intro__mark intro__mark--scene">WOOBO</span>
        </div>
      )}
      <span className="intro__bar">
        <i />
      </span>
    </div>
  );
}
