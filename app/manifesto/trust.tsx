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

/* ---------- fusion (flow 골격 + grid 카드 + 직관 아이콘) ---------- */
function TrustFusion() {
  // 독점 에이전트 허브의 카드 스태커 — 전역 reveal(-10%)보다 조금 더 일찍 발동.
  const hubRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = hubRef.current;
    if (!el) return;
    const reveal = () =>
      [el, ...el.querySelectorAll<HTMLElement>(".reveal-up")].forEach((n) =>
        n.classList.add("is-in"),
      );
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal();
            io.unobserve(e.target);
          }
        }
      },
      // 뷰포트 하단보다 12% 아래에서 미리 발화(전역 -10% 대비 더 이르게).
      { rootMargin: "0px 0px 12% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      <div className="tf-hub reveal-up d1" ref={hubRef}>
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
      // 뷰포트 세로 중앙의 0px 라인 — 그리드 상단이 가운데 닿는 순간 발화.
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
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

/* ---------- 공용 작은 아이콘(여정 노드용) ---------- */
const IconOrigin = (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="12" />
    <path d="M4 16 H28 M16 4 V28 M16 4 C9.5 9 9.5 23 16 28 M16 4 C22.5 9 22.5 23 16 28" />
  </svg>
);
const IconHub = (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="13" r="6" />
    <path d="M9 20 L6.5 28 L16 24 L25.5 28 L23 20" />
  </svg>
);
const IconYou = (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="11" r="5" />
    <path d="M6 27 C6 20 10 18 16 18 C22 18 26 20 26 27" />
  </svg>
);

/* ---------- A. conveyor (여정 컨베이어 — 유통 ‘과정’) ---------- */
function TrustConveyor() {
  return (
    <div className="tf-conveyor reveal-up">
      <div className="tf-conv__rail">
        <div className="tf-conv__track" />
        <div className="tf-conv__box" aria-hidden="true" />
        <div className="tf-conv__stamp" aria-hidden="true">
          ✓ 정품 · A/S
        </div>
        <div className="tf-conv__stops">
          {[
            { i: IconOrigin, t: "유럽 제조", d: "Blum · AGOFORM · Peka" },
            {
              i: IconHub,
              t: "우보 검수·보관",
              d: "한국 독점 에이전트 · sole agent",
              hub: true,
            },
            { i: IconYou, t: "고객 인도", d: "정품 · A/S · 전국 쇼룸" },
          ].map((s) => (
            <div
              key={s.t}
              className={`tf-conv__stop${s.hub ? " is-hub" : ""}`}
            >
              <span className="tf-conv__dot">{s.i}</span>
              <b>{s.t}</b>
              <span>{s.d}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="tf-conv__cap">
        우보 구간에서 정품에 더해지는 것 —
      </div>
      <div className="tf-conv__facets">
        {FACETS.map((f) => (
          <span key={f.t} className="tf-chip">
            {f.t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- B. pillars (3 기둥 + 흐르는 파이프) ---------- */
function TrustPillars() {
  return (
    <div className="tf-pillars reveal-up">
      <div className="tf-pillar">
        <span className="tf-tag">유럽 제조 · ORIGIN</span>
        <b>Blum · AGOFORM · Peka</b>
        <span className="tf-pillar__sub">프리미엄 하드웨어·소재의 원산지</span>
      </div>
      <div className="tf-pipe" aria-hidden="true">
        <i />
      </div>
      <div className="tf-pillar tf-pillar--hub">
        <span className="tf-tag">한국 독점 에이전트 · sole agent</span>
        <b>우보브랜드샵 — 정품의 공식 통로</b>
        <ul className="tf-pillar__list">
          {FACETS.map((f, i) => (
            <li
              key={f.t}
              className="reveal-up"
              style={
                {
                  "--reveal-delay": `${0.1 + i * 0.07}s`,
                } as React.CSSProperties
              }
            >
              <svg className="tf-icon" viewBox="0 0 32 32" aria-hidden="true">
                {f.icon}
              </svg>
              <span>{f.t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="tf-pipe" aria-hidden="true">
        <i />
      </div>
      <div className="tf-pillar">
        <span className="tf-tag">고객 · YOU</span>
        <b>정품 · A/S · 전국 쇼룸으로 안심</b>
        <span className="tf-pillar__sub">손에 닿기까지, 우보가 책임집니다</span>
      </div>
    </div>
  );
}

/* ---------- D. hub (허브 노드 다이어그램 — 탐색형) ---------- */
function TrustHub() {
  // 6개 가치를 허브 위·아래 호로 배치(좌=유럽, 우=고객은 가로축 양끝).
  const pos = [
    { x: 24, y: 16 },
    { x: 50, y: 9 },
    { x: 76, y: 16 },
    { x: 24, y: 84 },
    { x: 50, y: 91 },
    { x: 76, y: 84 },
  ];
  return (
    <div className="tf-hubg reveal-up">
      <svg className="tf-hubg__wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line className="tf-wire tf-wire--axis" x1="9" y1="50" x2="50" y2="50" />
        <line className="tf-wire tf-wire--axis" x1="50" y1="50" x2="91" y2="50" />
        {pos.map((p, i) => (
          <line
            key={i}
            className="tf-wire"
            x1="50"
            y1="50"
            x2={p.x}
            y2={p.y}
          />
        ))}
      </svg>

      <div className="tf-hubg__end tf-hubg__end--l">
        <span className="tf-hubg__icon">{IconOrigin}</span>
        <b>유럽 제조</b>
        <span>ORIGIN</span>
      </div>
      <div className="tf-hubg__core">
        <span className="tf-tag">독점 에이전트</span>
        <b>우보브랜드샵</b>
      </div>
      <div className="tf-hubg__end tf-hubg__end--r">
        <span className="tf-hubg__icon">{IconYou}</span>
        <b>고객</b>
        <span>YOU</span>
      </div>

      {FACETS.map((f, i) => (
        <div
          key={f.t}
          className="tf-orb"
          style={
            { left: `${pos[i].x}%`, top: `${pos[i].y}%` } as React.CSSProperties
          }
        >
          <svg className="tf-icon" viewBox="0 0 32 32" aria-hidden="true">
            {f.icon}
          </svg>
          <span className="tf-orb__t">{f.t}</span>
          <span className="tf-orb__d">{f.d}</span>
        </div>
      ))}
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
        {variant === "conveyor" ? (
          <TrustConveyor />
        ) : variant === "pillars" ? (
          <TrustPillars />
        ) : variant === "hub" ? (
          <TrustHub />
        ) : variant === "hybrid" ? (
          <TrustHybrid />
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
