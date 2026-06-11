"use client";

import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { CTA_HREF } from "@/lib/branches";

type Shop = {
  key: string;
  region: "수도권" | "충청" | "영남" | "호남" | "제주";
  short: string; // 지도 핀 라벨
  name: string;
  type: "본점" | "직영 지사" | "브랜드샵" | "파트너샵";
  sub?: string; // 파트너 상호
  address: string;
  tel: string;
  x: number; // 한국지도(viewBox 130×204) % 좌표 — 시각 튜닝 대상
  y: number;
};

// 전국 우보브랜드샵 (우보 현 페이지 실데이터). 핀 좌표는 1~2회 시각 튜닝 필요.
const SHOPS: Shop[] = [
  { key: "gimpo", region: "수도권", short: "김포", name: "우보브랜드샵 김포", type: "본점", address: "경기 김포시 양촌읍 학운리 263-3", tel: "010-4847-3545", x: 25, y: 25 },
  { key: "yongin", region: "수도권", short: "용인", name: "우보브랜드샵 용인", type: "브랜드샵", address: "경기 용인시 기흥구 고매로253번길 4", tel: "031-274-4241", x: 34, y: 32 },
  { key: "gju", region: "수도권", short: "경기광주", name: "우보브랜드샵 경기광주", type: "브랜드샵", address: "경기 광주시 포은대로 442-18 (추자동)", tel: "031-766-4606", x: 40, y: 31 },
  { key: "incheon", region: "수도권", short: "인천", name: "우보브랜드샵 인천", type: "브랜드샵", address: "인천 서구 봉수대로 268, 109호 (석남동)", tel: "032-577-3545", x: 23, y: 28 },
  { key: "cheongju", region: "충청", short: "청주", name: "우보브랜드샵 청주", type: "파트너샵", sub: "가구철물닷컴", address: "충북 청주시 청원구 내수읍 충청대로 889", tel: "070-8835-2002", x: 44, y: 42 },
  { key: "busan", region: "영남", short: "부산", name: "우보인터내셔날 부산지사", type: "직영 지사", address: "부산 동래구 안락동 459-29번지 1층", tel: "051-323-2532", x: 70, y: 71 },
  { key: "daegu", region: "영남", short: "대구", name: "우보브랜드샵 대구", type: "브랜드샵", address: "대구 중구 국채보상로149길 121 1층", tel: "010-2532-8456", x: 62, y: 57 },
  { key: "gyeongnam", region: "영남", short: "경남", name: "우보브랜드샵 경남", type: "브랜드샵", address: "부산 동래구 안연로102번길 67, 1층 (안락동)", tel: "010-7155-2532", x: 75, y: 74 },
  { key: "honam", region: "호남", short: "호남", name: "우보브랜드샵 호남", type: "브랜드샵", address: "광주 서구 풍서우로 303", tel: "010-3634-6581", x: 34, y: 67 },
  { key: "jeju", region: "제주", short: "제주", name: "우보브랜드샵 제주", type: "파트너샵", sub: "루미채", address: "제주시 번영로 168", tel: "064-753-7005", x: 30, y: 94 },
];

const kakaoHref = (s: Shop) =>
  `https://map.kakao.com/?q=${encodeURIComponent(s.address)}`;
const telHref = (s: Shop) => `tel:${s.tel.replace(/[^0-9]/g, "")}`;
const isKey = (s: Shop) => s.type === "본점" || s.type === "직영 지사";

/* 지도 핀들(map/split 공용) */
function ShopPins({
  active,
  onPick,
}: {
  active: string;
  onPick: (k: string) => void;
}) {
  return (
    <div className="sr-map__geo">
      <img
        className="sr-map__korea"
        src="/korea-map.svg"
        alt="전국 우보브랜드샵 지도"
      />
      {SHOPS.map((s) => (
        <button
          key={s.key}
          type="button"
          className={`sr-dot${s.key === active ? " is-active" : ""}${isKey(s) ? " is-key" : ""}`}
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          onMouseEnter={() => onPick(s.key)}
          onFocus={() => onPick(s.key)}
          onClick={() => onPick(s.key)}
          aria-label={`${s.name} · ${s.region}`}
        >
          <span className="sr-dot__pin" />
          <span className="sr-dot__label">{s.short}</span>
        </button>
      ))}
    </div>
  );
}

function ShopActions({ s }: { s: Shop }) {
  return (
    <div className="sr-acts">
      <a className="sr-book" href={CTA_HREF.booking}>
        방문 예약 <span className="arrow">→</span>
      </a>
      <a
        className="sr-kakao"
        href={kakaoHref(s)}
        target="_blank"
        rel="noopener noreferrer"
      >
        카카오맵 ↗
      </a>
    </div>
  );
}

function ShopBadges({ s }: { s: Shop }) {
  return (
    <span className="sr-meta">
      <span className="sr-region">{s.region}</span>
      <span className={`sr-badge${isKey(s) ? " is-key" : ""}`}>{s.type}</span>
    </span>
  );
}

/* 상세 패널(map) — 선택 지점 */
function ShopDetail({ s }: { s: Shop }) {
  return (
    <div className="sr-detail">
      <ShopBadges s={s} />
      <b className="sr-name">
        {s.name}
        {s.sub && <em> · {s.sub}</em>}
      </b>
      <p className="sr-addr">{s.address}</p>
      <a className="sr-tel" href={telHref(s)}>
        T. {s.tel}
      </a>
      <ShopActions s={s} />
    </div>
  );
}

/* 카드(grid/finder) */
function ShopCard({ s }: { s: Shop }) {
  return (
    <article className="sr-card">
      <ShopBadges s={s} />
      <b className="sr-name">
        {s.name}
        {s.sub && <em> · {s.sub}</em>}
      </b>
      <p className="sr-addr">{s.address}</p>
      <a className="sr-tel" href={telHref(s)}>
        T. {s.tel}
      </a>
      <ShopActions s={s} />
    </article>
  );
}

/* ---------- map: 한국 지도 + 핀 → 우측 상세 ---------- */
function ShopMap() {
  const [active, setActive] = useState(SHOPS[0].key);
  const cur = SHOPS.find((s) => s.key === active) ?? SHOPS[0];
  return (
    <div className="sr-map">
      <ShopPins active={active} onPick={setActive} />
      <ShopDetail s={cur} />
    </div>
  );
}

/* ---------- split: 지도 + 스크롤 리스트(호버 연동) ---------- */
function ShopSplit() {
  const [active, setActive] = useState(SHOPS[0].key);
  return (
    <div className="sr-split">
      <ShopPins active={active} onPick={setActive} />
      <ul className="sr-list">
        {SHOPS.map((s) => (
          <li
            key={s.key}
            className={`sr-list__item${s.key === active ? " is-active" : ""}`}
            onMouseEnter={() => setActive(s.key)}
            onClick={() => setActive(s.key)}
          >
            <div className="sr-list__head">
              <b>{s.name}</b>
              <span className={`sr-badge${isKey(s) ? " is-key" : ""}`}>
                {s.type}
              </span>
            </div>
            <small>
              {s.region} · {s.address}
            </small>
            <a className="sr-tel" href={telHref(s)}>
              T. {s.tel}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- grid: 10개 카드 전체 ---------- */
function ShopGrid() {
  return (
    <div className="sr-grid">
      {SHOPS.map((s) => (
        <ShopCard key={s.key} s={s} />
      ))}
    </div>
  );
}

/* ---------- finder: 지역 셀렉터 → 해당 지점 ---------- */
const REGIONS = ["수도권", "충청", "영남", "호남", "제주"] as const;
function ShopFinder() {
  const [region, setRegion] = useState<string>("수도권");
  const list = SHOPS.filter((s) => s.region === region);
  return (
    <div className="sr-finder">
      <div className="sr-finder__bar">
        <span className="sr-finder__q">가까운 우보브랜드샵 찾기 —</span>
        <select
          className="sr-finder__sel"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="지역 선택"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="sr-finder__list">
        {list.map((s) => (
          <ShopCard key={s.key} s={s} />
        ))}
      </div>
    </div>
  );
}

/* 레이아웃 후보(섹션 우측 picker) */
const SR_LAYOUTS: { key: string; label: string }[] = [
  { key: "map", label: "지도" },
  { key: "split", label: "지도+리스트" },
  { key: "grid", label: "카드" },
  { key: "finder", label: "지점 찾기" },
];

/* =========================== [07] 전국 우보브랜드샵 (CTA) =========================== */
export function ShowroomSection() {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [layout, setLayout] = useState("map");

  const showLine = useCallback(() => {
    lineRef.current?.classList.add("in");
  }, []);
  useInViewOnce(lineRef, showLine, { amount: 0.5 });

  const pop = useCallback(() => {
    const el = ctaRef.current;
    if (!el || reduce) return;
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }, [reduce]);

  return (
    <section
      className="section section--dark showroom"
      id="showroom"
      data-section="showroom"
      data-theme="dark"
      data-screen-label="07 CTA"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">07</span> / 다음 움직임
        </span>
        <h2 className="reveal-up d1">
          가까운 우보브랜드샵에서 직접 만져보고 결정하세요.
        </h2>
        <p className="lede reveal-up d1">
          전국 우보브랜드샵 — 우보가 수입하는 제품을 판매하고{" "}
          <strong>쇼룸·A/S</strong>를 지원합니다. 가까운 지점에서 더 빠르게.{" "}
          <strong>방문 예약제.</strong>
        </p>

        <div className="sr-stage">
          <div className="sr-stage__main">
            {layout === "split" ? (
              <ShopSplit />
            ) : layout === "grid" ? (
              <ShopGrid />
            ) : layout === "finder" ? (
              <ShopFinder />
            ) : (
              <ShopMap />
            )}
          </div>
          <aside className="sr-picker" aria-label="레이아웃 선택">
            <span className="sr-picker__label">레이아웃 선택</span>
            {SR_LAYOUTS.map((l) => (
              <button
                type="button"
                key={l.key}
                className={`sr-picker__btn${layout === l.key ? " is-active" : ""}`}
                onClick={() => setLayout(l.key)}
              >
                {l.label}
              </button>
            ))}
          </aside>
        </div>

        <div className="actions reveal-up">
          <a
            className="btn btn--primary"
            data-cta="book"
            href={CTA_HREF.booking}
            ref={ctaRef}
            onClick={pop}
          >
            쇼룸 방문 예약 <span className="arrow">→</span>
          </a>
          <a className="btn btn--secondary" href={CTA_HREF.quote}>
            견적·상담 요청
          </a>
          <a className="btn btn--ghost" href={CTA_HREF.catalog}>
            카탈로그 받기 ↓
          </a>
        </div>

        <div className={`closeline${reduce ? " in" : ""}`} ref={lineRef}>
          <i />
        </div>
        <p className="signoff">
          <b>Woobo</b> · Blum 한국 독점 에이전트 · moving ideas
        </p>
        <div className="footnote">
          ※ 일부 지점은 파트너샵(청주 가구철물닷컴 · 제주 루미채). 지도·연락처는
          변동될 수 있어 방문 전 확인 권장 [TODO: 카카오맵 임베드].
        </div>
      </div>
    </section>
  );
}
