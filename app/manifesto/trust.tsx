"use client";

import { useEffect, useRef } from "react";

type Facet = {
  t: string;
  d: string;
  feat?: boolean;
  mark: React.ReactNode; // grid 변주용(기존)
  icon: React.ReactNode; // fusion 변주용(직관 아이콘, viewBox 0 0 32 32)
};

const FACETS: Facet[] = [
  {
    t: "Blum 한국 독점 에이전트",
    d: "정품의 공식 통로 (sole agent)",
    feat: true,
    mark: <path d="M4 15 L12 23 L26 6" />,
    // 메달/공인 배지
    icon: (
      <>
        <circle cx="16" cy="12" r="7" />
        <path d="M11 18 L8 28 L16 24 L24 28 L21 18" />
      </>
    ),
  },
  {
    t: "정품 보장 (유사품 차단)",
    d: "A/S·부품 통로 확보",
    mark: <path d="M15 3 L26 8 V16 C26 23 21 26 15 28 C9 26 4 23 4 16 V8 Z" />,
    // 방패 + 체크
    icon: (
      <>
        <path d="M16 4 L27 8 V15 C27 22 22 26 16 28 C10 26 5 22 5 15 V8 Z" />
        <path d="M11 15 L15 19 L22 11" />
      </>
    ),
  },
  {
    t: "프리미엄 멀티브랜드 수입",
    d: "유럽 하드웨어·소재 전문",
    mark: <circle cx="15" cy="15" r="11" />,
    // 박스 3개(멀티)
    icon: (
      <>
        <rect x="4.5" y="16" width="9" height="9" />
        <rect x="18.5" y="16" width="9" height="9" />
        <rect x="11.5" y="6.5" width="9" height="9" />
      </>
    ),
  },
  {
    t: "가구 하드웨어 전문성",
    d: "제작 현장을 아는 상담",
    mark: <path d="M5 22 L15 5 L25 22 Z" />,
    // 기어(기계·하드웨어)
    icon: (
      <>
        <circle cx="16" cy="16" r="5" />
        <path d="M16 4 V8 M16 24 V28 M4 16 H8 M24 16 H28 M7.5 7.5 L10.3 10.3 M21.7 21.7 L24.5 24.5 M24.5 7.5 L21.7 10.3 M10.3 21.7 L7.5 24.5" />
      </>
    ),
  },
  {
    t: "전국 쇼룸 직접 체험",
    d: "실물 확인 · 방문 예약제",
    mark: <path d="M6 6 H24 V24 H6 Z M6 13 H24" />,
    // 지도 핀
    icon: (
      <>
        <path d="M16 28 C16 28 25 19 25 13 A9 9 0 0 0 7 13 C7 19 16 28 16 28 Z" />
        <circle cx="16" cy="13" r="3.2" />
      </>
    ),
  },
  {
    t: "자체 가구 생산 (김포 본점)",
    d: "하드웨어부터 완제품까지",
    mark: <path d="M4 26 V12 L15 5 L26 12 V26" />,
    // 공장
    icon: (
      <>
        <path d="M4 27 V15 L12 19 V15 L20 19 V15 L28 19 V27 Z" />
        <path d="M23 15 V9 H26 V17" />
      </>
    ),
  },
];

/* ---------- D. grid (현행 카드 그리드) ---------- */
function TrustGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".card"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      cards.forEach((c) => c.classList.add("is-draw"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-draw");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
  return (
    <div className="cards" ref={gridRef}>
      {FACETS.map((c, i) => (
        <div key={c.t} className={`card${c.feat ? " feat" : ""}`}>
          <div className="idx">{String(i + 1).padStart(2, "0")}</div>
          <svg className="mark" viewBox="0 0 30 30">
            {c.mark}
          </svg>
          <div>
            <div className="tt">{c.t}</div>
            <div className="ds">{c.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- C. stamp (인증 도장 — identity-stamp 클래스 재사용) ---------- */
function TrustStamp() {
  return (
    <ul className="identity-stamp__list trust-stamp">
      {FACETS.map((f, i) => (
        <li
          key={f.t}
          className="identity-stamp__row reveal-up"
          style={
            { "--reveal-delay": `${0.08 + i * 0.08}s` } as React.CSSProperties
          }
        >
          <svg className="identity-stamp__seal" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="19" />
            <path d="M13 22.5 L19.5 29 L31 16" />
          </svg>
          <div className="identity-stamp__txt">
            <b>{f.t}</b>
            <span>{f.d}</span>
          </div>
          <span className="identity-stamp__no">
            {String(i + 1).padStart(2, "0")}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- A. flow (정품의 공식 통로) ---------- */
function TrustFlow() {
  return (
    <div className="trust-flow">
      <div className="tf-node reveal-up">
        <span className="tf-tag">유럽 제조</span>
        <b>Blum · AGOFORM · Peka</b>
      </div>
      <div className="tf-link reveal-up d1">
        <i />
      </div>
      <div className="tf-node tf-node--hub reveal-up d1">
        <span className="tf-tag">한국 독점 에이전트 · sole agent</span>
        <b>우보브랜드샵 — 정품의 공식 통로</b>
        <div className="tf-facets">
          {FACETS.map((f) => (
            <span key={f.t} className="tf-facet">
              {f.t}
            </span>
          ))}
        </div>
      </div>
      <div className="tf-link reveal-up d2">
        <i />
      </div>
      <div className="tf-node reveal-up d2">
        <span className="tf-tag">고객</span>
        <b>정품 · A/S · 전국 쇼룸으로 안심</b>
      </div>
    </div>
  );
}

/* ---------- fusion (flow 골격 + grid 카드 + 직관 아이콘) ---------- */
function TrustFusion() {
  return (
    <div className="trust-fusion">
      <div className="tf-node tf-node--end reveal-up">
        <span className="tf-node__icon">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="12" />
            <path d="M4 16 H28 M16 4 V28 M16 4 C9.5 9 9.5 23 16 28 M16 4 C22.5 9 22.5 23 16 28" />
          </svg>
        </span>
        <span className="tf-tag">유럽 제조 · ORIGIN</span>
        <b>Blum · AGOFORM · Peka</b>
        <span className="tf-node__sub">프리미엄 하드웨어·소재의 원산지</span>
      </div>
      <div className="tf-link reveal-up d1">
        <i />
      </div>
      <div className="tf-hub reveal-up d1">
        <span className="tf-tag">한국 독점 에이전트 · sole agent</span>
        <b className="tf-hub__title">우보브랜드샵 — 정품의 공식 통로</b>
        <div className="tf-cards">
          {FACETS.map((f, i) => (
            <div
              key={f.t}
              className="tf-card reveal-up"
              style={
                { "--reveal-delay": `${0.06 + i * 0.07}s` } as React.CSSProperties
              }
            >
              <svg className="tf-icon" viewBox="0 0 32 32" aria-hidden="true">
                {f.icon}
              </svg>
              <div className="tf-card__tt">{f.t}</div>
              <div className="tf-card__ds">{f.d}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="tf-link reveal-up d2">
        <i />
      </div>
      <div className="tf-node tf-node--end reveal-up d2">
        <span className="tf-node__icon">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="11" r="5" />
            <path d="M6 27 C6 20 10 18 16 18 C22 18 26 20 26 27" />
          </svg>
        </span>
        <span className="tf-tag">고객 · YOU</span>
        <b>정품 · A/S · 전국 쇼룸으로 안심</b>
        <span className="tf-node__sub">손에 닿기까지, 우보가 책임집니다</span>
      </div>
    </div>
  );
}

/* =========================== [05] 약속 (Trust · 버저닝) =========================== */
export function TrustByVariant({ variant }: { variant: string }) {
  return (
    <section
      className="section trust"
      data-section="trust"
      data-theme="light"
      data-screen-label="05 약속"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">05</span> / 약속
        </span>
        <h2 className="reveal-up d1">그래서, 우리가 독점으로 책임집니다.</h2>
        <p className="lede reveal-up d1">
          <span className="warn">
            유사품에 주의하십시오 — 정품 Blum은 한국 독점 에이전트 우보에서.
          </span>
        </p>
        {variant === "flow" ? (
          <TrustFlow />
        ) : variant === "stamp" ? (
          <TrustStamp />
        ) : variant === "grid" ? (
          <TrustGrid />
        ) : (
          <TrustFusion />
        )}
        <div className="brands reveal-up">
          멀티브랜드 수입 전문 — <b>Blum</b> (간판) · AGOFORM (독일) · Peka
          (스위스) 등
        </div>
        <div className="footnote">
          ※ 재고·납기 및 정확한 법적 등급 표현은 클라이언트 확인 후 확정 [TODO:
          확인].
        </div>
      </div>
    </section>
  );
}
