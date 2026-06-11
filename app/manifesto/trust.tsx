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

/* ---------- hybrid (pillars 가로 여정 + fusion 끝노드 + 아이콘 카드 허브) ---------- */
function TrustHybrid() {
  // 6개 카드 뿅뿅 stagger 팝 — 뷰포트 '가운데'에 카드 그리드가 닿으면 시작.
  const cardsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("is-pop");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-pop");
            io.unobserve(e.target);
          }
        }
      },
      // 그리드 상단이 뷰포트 약 72% 지점에 닿으면 발화(중앙보다 조금 더 일찍).
      { rootMargin: "0px 0px -28% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="tf-hybrid reveal-up">
      <div className="tf-end">
        <b className="tf-end__word">유럽 제조</b>
        <span className="tf-end__rule" aria-hidden="true" />
        <span className="tf-end__desc">Blum · AGOFORM · Peka 원산지</span>
      </div>

      <div className="tf-pipe" aria-hidden="true">
        <i />
      </div>

      <div className="tf-hub tf-hub--center">
        <span className="tf-tag">한국 독점 에이전트 · sole agent</span>
        <b className="tf-hub__title">우보브랜드샵 — 정품의 공식 통로</b>
        <div className="tf-cards" ref={cardsRef}>
          {FACETS.map((f, i) => (
            <div
              key={f.t}
              className="tf-card tf-card--pop"
              style={
                { "--reveal-delay": `${i * 0.09}s` } as React.CSSProperties
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

      <div className="tf-pipe" aria-hidden="true">
        <i />
      </div>

      <div className="tf-end">
        <b className="tf-end__word">고객</b>
        <span className="tf-end__rule" aria-hidden="true" />
        <span className="tf-end__desc">정품 그대로, 손에 닿기까지</span>
      </div>
    </div>
  );
}

/* =========================== [05] 약속 (Trust · 버저닝) =========================== */
export function TrustByVariant({ variant: _variant }: { variant: string }) {
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
        <TrustHybrid />
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
