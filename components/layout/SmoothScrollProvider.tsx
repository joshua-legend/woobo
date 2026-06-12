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
    // 모바일(터치)은 Lenis가 어차피 터치를 부드럽게 잡지 않음 → 미장착해
    // 네이티브 스크롤-스냅(섹션02 스냅-스탑)이 충돌 없이 작동하게 둔다.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
