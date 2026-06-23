"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type ScrubOptions = {
  start?: string;
  end?: string;
  /** 진행도 스냅 지점(0~1) 또는 스냅 함수. coarse 포인터(모바일)에서만 적용 — 한 비트씩 정렬. */
  snap?: number | number[] | ((value: number) => number);
};

/**
 * 섹션 스크롤 진행도(0→1)를 onUpdate 로 흘려보내는 스크럽 헬퍼.
 * - CSS position:sticky 로 핀을 잡는 디자인을 그대로 살리고, ScrollTrigger 는
 *   진행도 읽기에만 사용(자체 pin 미사용). Lenis 가 부드러움을 담당.
 * - gsap.context 스코프 + 언마운트 revert 로 ScrollTrigger 누수 차단.
 * - reduced-motion: 즉시 최종상태(progress=1) 1회 통지.
 */
export function useScrub(
  ref: React.RefObject<HTMLElement | null>,
  onUpdate: (progress: number) => void,
  opts: ScrubOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onUpdate(1);
      return;
    }

    // 모바일/터치(normalizeScroll 구간)에서만 스냅 — CSS scroll-snap 은 normalizeScroll 과
    // 충돌하므로 GSAP ScrollTrigger snap 으로 한 비트씩 정렬한다.
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: opts.start ?? "top top",
        end: opts.end ?? "bottom bottom",
        onUpdate: (self) => onUpdate(self.progress),
        onRefresh: (self) => onUpdate(self.progress),
        snap:
          coarse && opts.snap != null
            ? {
                snapTo: opts.snap,
                duration: { min: 0.18, max: 0.42 },
                delay: 0.02,
                ease: "power2.inOut",
                // 관성 투영 끄기 → 슬라이드 사이 중간에 안 멈추고 가까운 패널로 바로 정렬
                inertia: false,
                directional: true,
              }
            : undefined,
      });
    }, el);

    return () => ctx.revert();
    // onUpdate 는 호출부에서 useCallback 으로 안정화
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, opts.start, opts.end, opts.snap]);
}
