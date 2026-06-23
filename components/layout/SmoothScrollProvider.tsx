"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis 가상 스크롤 ↔ GSAP ScrollTrigger 동기화.
 * - rAF 는 GSAP ticker 로 단일화(중복 루프 방지).
 * - prefers-reduced-motion 시 Lenis 미장착(네이티브 스크롤 유지).
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      // 모바일/터치: Lenis 대신 ScrollTrigger.normalizeScroll.
      // 스크롤을 JS 스레드에서 처리해 주소창/툴바가 스크롤 도중 show/hide 되며
      // 스크롤 위치가 한 칸 튀던 문제(뷰포트 리사이즈 점프)를 제거한다.
      // ignoreMobileResize: 주소창 show/hide 로 인한 리사이즈에 반응하지 않아
      // 고정 헤더(position:fixed)가 스크롤 중 위로 밀려 사라지던 현상을 줄인다.
      ScrollTrigger.config({ ignoreMobileResize: true });
      ScrollTrigger.normalizeScroll(true);
      return () => {
        ScrollTrigger.normalizeScroll(false);
      };
    }

    // 데스크톱: Lenis 부드러운 휠 스크롤
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    // 섹션 단계 페이저(섹션5)에서 lenis.scrollTo 로 한 단계씩 이동하기 위해 노출
    (window as unknown as { __wooboLenis?: Lenis }).__wooboLenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      delete (window as unknown as { __wooboLenis?: Lenis }).__wooboLenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
