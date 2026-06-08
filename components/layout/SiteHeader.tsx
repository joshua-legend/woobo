"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SiteHeader.module.css";

type NavItem = { label: string; href: string; hideSm?: boolean };

type SiteHeaderProps = {
  /** 워드마크 텍스트 (예: "Woobo", "우보") */
  brand: string;
  /** 워드마크 보조 라벨 (예: "Blum 한국 독점 에이전트") */
  sub: string;
  /** 헤더 CTA 라벨 */
  ctaLabel: string;
  /** 헤더 CTA href (페이지 내 앵커) */
  ctaHref: string;
  /** 워드마크 클릭 시 이동 앵커 */
  homeHref?: string;
  /** 선택: 보조 내비 링크(가안 c) */
  nav?: NavItem[];
};

/**
 * 공유 상단 크롬: 스크롤 진행바 + 고정 헤더(축소/다크테마 반전).
 * - 진행바: 문서 스크롤 0→1 → scaleX.
 * - 헤더: scrollY>40 축소. 헤더 아래(probe 64px)가 [data-theme="dark"] 섹션이면 색 반전.
 * - rAF 코얼레싱 스크롤 핸들러, 언마운트 정리.
 */
export function SiteHeader({
  brand,
  sub,
  ctaLabel,
  ctaHref,
  homeHref = "#hero",
  nav,
}: SiteHeaderProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [shrunk, setShrunk] = useState(false);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-theme]"),
    );
    let ticking = false;

    const update = () => {
      ticking = false;
      const st = window.scrollY || document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const p = docH > 0 ? Math.min(Math.max(st / docH, 0), 1) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      setShrunk(st > 40);

      const probe = 64;
      let dark = false;
      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          dark = sec.getAttribute("data-theme") === "dark";
          break;
        }
      }
      setOnDark(dark);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const headerClass = [
    styles.header,
    shrunk ? styles.shrunk : "",
    onDark ? styles.onDark : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={styles.progress} ref={barRef} aria-hidden />
      <header className={headerClass}>
        <a className={styles.brand} href={homeHref}>
          {brand}
          <span className={styles.dot}>.</span>
          <span className={styles.sub}>{sub}</span>
        </a>
        <nav className={styles.nav}>
          {nav?.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`${styles.navLink}${n.hideSm ? " " + styles.hideSm : ""}`}
            >
              {n.label}
            </a>
          ))}
          <a className={styles.cta} href={ctaHref}>
            {ctaLabel}
          </a>
        </nav>
      </header>
    </>
  );
}
