"use client";

import { useEffect } from "react";

type Options = {
  /** 0~1, 이 비율 이상 보이면 1회 발동 (rootMargin 사용 시 0 권장) */
  amount?: number;
  rootMargin?: string;
};

/**
 * 요소가 뷰포트에 들어오면 onEnter 를 1회 실행(slam/cause/float 등 one-shot 트리거).
 * reduced-motion 처리는 호출부가 담당(여기선 순수 트리거만).
 */
export function useInViewOnce(
  ref: React.RefObject<HTMLElement | null>,
  onEnter: () => void,
  opts: Options = {},
) {
  const { amount = 0.5, rootMargin = "0px" } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= amount) {
            onEnter();
            io.disconnect();
            return;
          }
        }
      },
      { threshold: amount === 0 ? 0 : [0, amount, 1], rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, onEnter, amount, rootMargin]);
}
