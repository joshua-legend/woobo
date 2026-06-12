"use client";

import { useRef, useState } from "react";

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

/* 지도형 표시 방식 3종 */
const MAP_MODES: { key: string; label: string }[] = [
  { key: "swipe", label: "스와이프" },
  { key: "list", label: "리스트" },
];

/* ---------- map: 유럽 지도 + 3가지 브라우징 방식(스와이프/리스트/칩) ---------- */
function BrandMap() {
  const [mode, setMode] = useState("swipe");
  const [active, setActive] = useState(BRANDS[0].key);
  const cardsRef = useRef<HTMLUListElement>(null);

  // 핀(또는 칩) 선택 → active 갱신 + 스와이프 모드면 해당 카드로 스크롤
  const pick = (key: string) => {
    setActive(key);
    if (mode === "swipe") {
      const idx = BRANDS.findIndex((b) => b.key === key);
      const el = cardsRef.current?.children[idx] as HTMLElement | undefined;
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const geo = (
    <div className="bf-map__geo">
      <img
        className="bf-map__europe"
        src="/europe-map.svg"
        alt="유럽 원산지 지도"
      />
      {MAP_DOTS.map((d) => {
        const b = BRANDS.find((x) => x.key === d.key) ?? BRANDS[0];
        return (
          <button
            key={d.key}
            type="button"
            className={`bf-dot${d.key === active ? " is-active" : ""}`}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            onMouseEnter={() => setActive(d.key)}
            onFocus={() => setActive(d.key)}
            onClick={() => pick(d.key)}
            aria-label={`${b.name} · ${b.country}`}
          >
            <span className="bf-dot__pin" />
            <span className="bf-dot__label">{b.name}</span>
          </button>
        );
      })}
      <span className="bf-map__legend">유럽 원산지 → 한국 · 우보 정식 수입</span>
    </div>
  );

  return (
    <div className="bf-map" data-mode={mode}>
      <div className="bf-map__modes" role="tablist" aria-label="지도형 표시 방식">
        {MAP_MODES.map((m) => (
          <button
            type="button"
            key={m.key}
            className={`bf-map__mode${mode === m.key ? " is-active" : ""}`}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="bf-map__split">
          {geo}
          {mode === "list" ? (
            <ul className="bf-maplist" aria-label="브랜드 목록">
              {BRANDS.map((b) => (
                <li
                  key={b.key}
                  className={`bf-maplistitem${b.key === active ? " is-active" : ""}`}
                >
                  <span className="bf-maplistitem__img">
                    {b.img && <img src={b.img} alt="" aria-hidden="true" />}
                  </span>
                  <div className="bf-maplistitem__txt">
                    <span className="bf-country">{b.country}</span>
                    <b className="bf-mapcard__name">{b.name}</b>
                    <p className="bf-role">{b.role}</p>
                    <p className="bf-korea bf-korea--em">{b.korea}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="bf-mapcards" ref={cardsRef} aria-label="브랜드 목록">
              {BRANDS.map((b) => (
                <li
                  key={b.key}
                  className={`bf-mapcard${b.key === active ? " is-active" : ""}`}
                >
                  <span className="bf-mapcard__img">
                    {b.img && <img src={b.img} alt="" aria-hidden="true" />}
                  </span>
                  <span className="bf-country">{b.country}</span>
                  <b className="bf-mapcard__name">{b.name}</b>
                  <p className="bf-role">{b.role}</p>
                  <p className="bf-korea bf-korea--em">{b.korea}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
    </div>
  );
}

/* ---------- showcase: 큰 무드 이미지 히어로 + 썸네일 스트립 ---------- */
function BrandShowcase() {
  const [active, setActive] = useState(BRANDS[0].key);
  const cur = BRANDS.find((b) => b.key === active) ?? BRANDS[0];
  return (
    <div className="bf-showcase">
      <div className="bf-showcase__hero">
        {cur.img && <img src={cur.img} alt="" aria-hidden="true" />}
        <div className="bf-showcase__cap">
          <span className="bf-country">{cur.country}</span>
          <b className="bf-showcase__name">{cur.name}</b>
          <p className="bf-role">{cur.role}</p>
          <p className="bf-korea">{cur.korea}</p>
        </div>
      </div>
      <div className="bf-showcase__thumbs">
        {BRANDS.map((b) => (
          <button
            type="button"
            key={b.key}
            className={`bf-thumb${b.key === active ? " is-active" : ""}`}
            onMouseEnter={() => setActive(b.key)}
            onFocus={() => setActive(b.key)}
            onClick={() => setActive(b.key)}
          >
            {b.img && <img src={b.img} alt="" aria-hidden="true" />}
            <span>{b.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- bands: 세로 풀폭 밴드(이미지/텍스트 좌우 교차) ---------- */
function BrandBands() {
  return (
    <div className="bf-bands">
      {BRANDS.map((b, i) => (
        <div
          key={b.key}
          className={`bf-band${i % 2 ? " bf-band--rev" : ""}`}
        >
          <span className="bf-band__img">
            {b.img && <img src={b.img} alt="" aria-hidden="true" />}
          </span>
          <div className="bf-band__txt">
            <span className="bf-country">{b.country}</span>
            <b className="bf-band__name">{b.name}</b>
            <p className="bf-role">{b.role}</p>
            <p className="bf-korea">{b.korea}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 사장님 선택용 레이아웃 후보 (오른쪽 picker 버튼) */
const LAYOUTS: { key: string; label: string }[] = [
  { key: "showcase", label: "쇼케이스" },
  { key: "map", label: "지도형" },
  { key: "bands", label: "밴드형" },
];

/* =========================== [06] 멀티브랜드 수입 (Brands · 레이아웃 선택) =========================== */
export function BrandsByVariant({ variant }: { variant: string }) {
  const initial = LAYOUTS.some((l) => l.key === variant) ? variant : "showcase";
  const [layout, setLayout] = useState(initial);
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
        <div className="bf-stage">
          <div className="bf-stage__main">
            {layout === "showcase" ? (
              <BrandShowcase />
            ) : layout === "bands" ? (
              <BrandBands />
            ) : (
              <BrandMap />
            )}
          </div>
          <aside className="bf-picker" aria-label="레이아웃 선택">
            <span className="bf-picker__label">레이아웃 선택</span>
            {LAYOUTS.map((l) => (
              <button
                type="button"
                key={l.key}
                className={`bf-picker__btn${layout === l.key ? " is-active" : ""}`}
                onClick={() => setLayout(l.key)}
              >
                {l.label}
              </button>
            ))}
          </aside>
        </div>
        <div className="footnote">
          ※ 로고·브랜드 표기·세부 문구는 클라이언트 확인 후 확정 [TODO].
        </div>
      </div>
    </section>
  );
}
