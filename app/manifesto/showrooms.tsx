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
  { key: "gimpo", region: "수도권", short: "김포", name: "우보브랜드샵 김포", type: "본점", address: "경기 김포시 양촌읍 학운리 263-3", tel: "010-4847-3545", x: 25, y: 20 },
  { key: "yongin", region: "수도권", short: "용인", name: "우보브랜드샵 용인", type: "브랜드샵", address: "경기 용인시 기흥구 고매로253번길 4", tel: "031-274-4241", x: 35, y: 27 },
  { key: "gju", region: "수도권", short: "경기광주", name: "우보브랜드샵 경기광주", type: "브랜드샵", address: "경기 광주시 포은대로 442-18 (추자동)", tel: "031-766-4606", x: 38, y: 24 },
  { key: "incheon", region: "수도권", short: "인천", name: "우보브랜드샵 인천", type: "브랜드샵", address: "인천 서구 봉수대로 268, 109호 (석남동)", tel: "032-577-3545", x: 24, y: 22 },
  { key: "cheongju", region: "충청", short: "청주", name: "우보브랜드샵 청주", type: "파트너샵", sub: "가구철물닷컴", address: "충북 청주시 청원구 내수읍 충청대로 889", tel: "070-8835-2002", x: 44, y: 38 },
  { key: "busan", region: "영남", short: "부산", name: "우보인터내셔날 부산지사", type: "직영 지사", address: "부산 동래구 안락동 459-29번지 1층", tel: "051-323-2532", x: 81, y: 69 },
  { key: "daegu", region: "영남", short: "대구", name: "우보브랜드샵 대구", type: "브랜드샵", address: "대구 중구 국채보상로149길 121 1층", tel: "010-2532-8456", x: 69, y: 55 },
  { key: "gyeongnam", region: "영남", short: "경남", name: "우보브랜드샵 경남", type: "브랜드샵", address: "부산 동래구 안연로102번길 67, 1층 (안락동)", tel: "010-7155-2532", x: 84, y: 73 },
  { key: "honam", region: "호남", short: "호남", name: "우보브랜드샵 호남", type: "브랜드샵", address: "광주 서구 풍서우로 303", tel: "010-3634-6581", x: 26, y: 70 },
  { key: "jeju", region: "제주", short: "제주", name: "우보브랜드샵 제주", type: "파트너샵", sub: "루미채", address: "제주시 번영로 168", tel: "064-753-7005", x: 22, y: 93 },
];

const kakaoHref = (s: Shop) =>
  `https://map.kakao.com/?q=${encodeURIComponent(s.address)}`;
const naverHref = (s: Shop) =>
  `https://map.naver.com/p/search/${encodeURIComponent(s.address)}`;
const telHref = (s: Shop) => `tel:${s.tel.replace(/[^0-9]/g, "")}`;
const isKey = (s: Shop) => s.type === "본점" || s.type === "직영 지사";

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
      <a
        className="sr-naver"
        href={naverHref(s)}
        target="_blank"
        rel="noopener noreferrer"
      >
        네이버지도 ↗
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

/* 카드 — 지역 필터 그리드용(i = 등장 스태거 인덱스) */
function ShopCard({ s, i = 0 }: { s: Shop; i?: number }) {
  return (
    <article className="sr-card" style={{ "--i": i } as React.CSSProperties}>
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

/* ---------- finder: 지역 칩 필터 + 카드 그리드 ---------- */
const REGIONS = ["전체", "수도권", "충청", "영남", "호남", "제주"] as const;
type Region = (typeof REGIONS)[number];

function ShopFinder() {
  const [region, setRegion] = useState<Region>("전체");
  const shown =
    region === "전체" ? SHOPS : SHOPS.filter((s) => s.region === region);
  const count = (r: Region) =>
    r === "전체" ? SHOPS.length : SHOPS.filter((s) => s.region === r).length;

  return (
    <div className="sr-finder">
      <div className="sr-chips" role="tablist" aria-label="지역 선택">
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={region === r}
            className={`sr-chip${region === r ? " is-active" : ""}`}
            onClick={() => setRegion(r)}
          >
            {r}
            <span className="sr-chip__n">{count(r)}</span>
          </button>
        ))}
      </div>
      {/* key=region → 필터 변경 시 카드 재마운트로 등장 애니메이션 리플레이 */}
      <div className="sr-grid" key={region}>
        {shown.map((s, i) => (
          <ShopCard key={s.key} s={s} i={i} />
        ))}
      </div>
    </div>
  );
}

/* =========================== [07] 전국 우보브랜드샵 (CTA) =========================== */
export function ShowroomSection() {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);

  const showLine = useCallback(() => {
    lineRef.current?.classList.add("in");
  }, []);
  useInViewOnce(lineRef, showLine, { amount: 0.5 });

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

        <ShopFinder />

        <div className={`closeline${reduce ? " in" : ""}`} ref={lineRef}>
          <i />
        </div>
        <p className="signoff">
          <b>Woobo</b> · Blum 한국 독점 에이전트 · moving ideas
        </p>
        <div className="footnote">
          ※ 일부 지점은 파트너샵(청주 가구철물닷컴 · 제주 루미채). 지도·연락처는
          변동될 수 있어 방문 전 확인 권장.
        </div>
      </div>
    </section>
  );
}
