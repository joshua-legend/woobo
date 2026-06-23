"use client";

import { useEffect, useRef, useState } from "react";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Brand = {
  key: string;
  name: string;
  country: string;
  role: string; // 전문분야 한 줄
  korea: string; // 한국 관계(우보 = 공식 통로)
  img?: string; // 가안 무드 이미지(없으면 빗금 폴백)
};

// 우보인터내셔날이 한국에 정식 수입·공급하는 브랜드(단일 소스).
const BRANDS: Brand[] = [
  {
    key: "blum",
    name: "Blum",
    country: "오스트리아",
    role: "세계 1위 가구 Fitting 제조 · High-tech 혁신",
    korea: "대한민국 sole agent — 우보인터내셔날",
    img: "/brands/blum.webp",
  },
  {
    key: "agoform",
    name: "AGOFORM",
    country: "독일",
    role: "플라스틱 열성형(thermoforming) 전문 · 가구·주방·욕실",
    korea: "대형 가구사 등에 논슬립매트·수저분리함 공급",
    img: "/brands/agoform.webp",
  },
  {
    key: "peka",
    name: "Peka",
    country: "스위스",
    role: "주방·거실 부속 · 풀아웃 시스템",
    korea: "주방·가구 산업용 풀아웃 시스템 개발·생산",
    img: "/brands/peka.webp",
  },
  {
    key: "bekaert",
    name: "BekaertDeslee",
    country: "벨기에",
    role: "세계 1위 매트리스 원단 공급",
    korea: "한국 에이스·시몬스 침대에 공급",
    img: "/brands/bekaertdeslee.webp",
  },
  {
    key: "pwg",
    name: "PWG",
    country: "독일",
    role: "Glue-coated veneer backing 소재 · world-wide leader",
    korea: "한국에 부직포·본드 함침 부직포 공급",
    img: "/brands/pwg.webp",
  },
];

/* 점 위치 = europe-map.svg(viewBox 365 318 150 130) 위 % 좌표. 독일은 2개(AGOFORM·PWG). */
const MAP_DOTS: { key: string; x: number; y: number }[] = [
  { key: "agoform", x: 38.2, y: 50.9 }, // 독일
  { key: "pwg", x: 42.2, y: 43.3 }, // 독일(오프셋)
  { key: "blum", x: 43.6, y: 65.7 }, // 오스트리아
  { key: "peka", x: 39.2, y: 65.2 }, // 스위스
  { key: "bekaert", x: 32.7, y: 56.7 }, // 벨기에
];

/* 밴드 뒤 대형 워터마크용 원산지 영문 표기 */
const ORIGIN_EN: Record<string, string> = {
  오스트리아: "AUSTRIA",
  독일: "GERMANY",
  스위스: "SWITZERLAND",
  벨기에: "BELGIUM",
};

/* 유럽 지도 + 원산지 점(활성 점등). 데스크탑 좌측 sticky 컴패니언용. */
function GeoMap({ active }: { active: string }) {
  return (
    <div className="bf-map__geo">
      <img className="bf-map__europe" src="/europe-map.svg" alt="" />
      {MAP_DOTS.map((d) => {
        const b = BRANDS.find((x) => x.key === d.key) ?? BRANDS[0];
        return (
          <span
            key={d.key}
            className={`bf-dot${d.key === active ? " is-active" : ""}`}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            <span className="bf-dot__pin" />
            <span className="bf-dot__label">{b.name}</span>
          </span>
        );
      })}
      <span className="bf-map__legend">유럽 원산지 → 한국 · 우보 정식 수입</span>
    </div>
  );
}

/* ---------- 밴드형 + sticky 유럽지도 컴패니언 ----------
   - 좌우 교차 밴드(reveal-up 슬라이드인 + 헤드라인 노출).
   - 스크롤하면 뷰포트 중앙에 가장 가까운 밴드가 활성 → 지도의 원산지 점이 점등.
   - 활성 밴드 이미지에 미세 세로 패럴랙스. reduced-motion 시 전부 정적. */
function BrandBands() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(BRANDS[0].key);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const bands = Array.from(wrap.querySelectorAll<HTMLElement>(".bf-band"));
    if (!bands.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestD = Infinity;
      bands.forEach((b, i) => {
        const r = b.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = Math.abs(c - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
        if (!reduce) {
          const p = clamp((c - mid) / window.innerHeight, -0.5, 0.5);
          const img = b.querySelector<HTMLElement>(".bf-band__img img");
          if (img)
            img.style.transform = `scale(1.12) translateY(${(p * 4).toFixed(2)}%)`;
          const wm = b.querySelector<HTMLElement>(".bf-band__wm");
          if (wm) wm.style.transform = `translateX(${(p * 56).toFixed(1)}px)`;
        }
      });
      const key = BRANDS[best].key;
      setActive((prev) => (prev === key ? prev : key));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bf-bandwrap" ref={wrapRef}>
      <aside className="bf-geoaside" aria-hidden="true">
        <GeoMap active={active} />
      </aside>

      <div className="bf-bands">
        {BRANDS.map((b, i) => (
          <article
            key={b.key}
            className={`bf-band${i % 2 ? " bf-band--rev" : ""}${
              b.key === active ? " is-active" : ""
            }`}
          >
            <span className="bf-band__wm" aria-hidden="true">
              {ORIGIN_EN[b.country] ?? b.country}
            </span>
            <span className="bf-band__img reveal-up">
              {b.img && <img src={b.img} alt="" aria-hidden="true" />}
            </span>
            <div className="bf-band__txt reveal-up d1">
              <span className="bf-band__no">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(BRANDS.length).padStart(2, "0")}
              </span>
              <span className="bf-country">{b.country}</span>
              <b className="bf-band__name">{b.name}</b>
              <p className="bf-role">{b.role}</p>
              <p className="bf-korea bf-korea--em">{b.korea}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* =========================== [06] 멀티브랜드 수입 (Brands · 밴드형 고정) =========================== */
export function BrandsByVariant({ variant: _variant }: { variant: string }) {
  return (
    <section
      className="section brandfolio"
      data-section="brands"
      data-theme="light"
      data-screen-label="06 브랜드"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">06</span> / 멀티브랜드 수입
        </span>
        <h2 className="reveal-up d1">세계의 부품·소재 기준을, 한국 정식 통로로.</h2>
        <p className="lede reveal-up d1">
          우보인터내셔날은 유럽·세계의 프리미엄 부품·소재 브랜드를{" "}
          <strong>한국에 정식으로 수입·공급하는 공식 통로</strong>입니다.
        </p>
        <BrandBands />
      </div>
    </section>
  );
}
