"use client";

import { useEffect } from "react";

/**
 * 루트 안의 .reveal-up / .reveal-mask 를 뷰포트 진입 시 .is-in 으로 1회 토글.
 * IntersectionObserver 기반(스크롤 누수 없음). reduced-motion 시 즉시 최종상태.
 */
export function useReveal(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const els = Array.from(
      root.querySelectorAll<HTMLElement>(".reveal-up, .reveal-mask"),
    );
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}
