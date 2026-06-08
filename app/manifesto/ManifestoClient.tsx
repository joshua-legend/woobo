"use client";

import { useCallback, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useReveal } from "@/hooks/useReveal";
import { useScrub } from "@/hooks/useScrub";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CTA_HREF } from "@/lib/branches";
import "./manifesto.css";

const setP = (el: HTMLElement | null, v: number) => {
  if (el) el.style.setProperty("--p", v.toFixed(4));
};

/* =========================== [01] HERO · 선언 (다크) =========================== */
function Hero() {
  return (
    <section
      className="section section--dark hero"
      data-section="hero"
      data-theme="dark"
      data-screen-label="01 선언"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">01</span> / 선언
        </span>
        <h1>
          <span className="reveal-mask">
            <span>우리는</span>
          </span>
          <br />
          <span className="reveal-mask d1">
            <span>
              <span className="hero__pop">움직임</span>을
            </span>
          </span>
          <br />
          <span className="reveal-mask d2">
            <span>믿습니다.</span>
          </span>
        </h1>
        <p className="lede reveal-up d3">
          가구 하드웨어 전문가의 신념. 그래서 우리는 Blum을 한국에서{" "}
          <span className="hl">독점으로</span> 다룹니다.
        </p>
        <div className="hero__foot reveal-up d4">
          <a className="btn btn--secondary" href="#identity">
            우리가 누구인지 ↓
          </a>
          <span className="hero__scroll">
            Woobo · Blum 한국 독점 에이전트 + 전국 쇼룸{" "}
            <span className="line" /> 8 sections
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================== [02] 정체성 핀 (sticky + scrub) =========================== */
const IDENTITY_KEYWORDS = [
  "Blum 한국 독점 에이전트",
  "정품의 공식 통로",
  "전국 오프라인 쇼룸",
  "프리미엄 멀티브랜드 수입",
  "자체 가구 생산 (김포 본점)",
];

function Identity() {
  const secRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);
  const activeRef = useRef(0);

  const onUpdate = useCallback((p: number) => {
    const n = IDENTITY_KEYWORDS.length;
    const next = Math.min(n - 1, Math.max(0, Math.floor(p * n)));
    if (next === activeRef.current) return;
    activeRef.current = next;
    itemsRef.current.forEach((li, i) => {
      if (li) li.classList.toggle("is-active", i === next);
    });
  }, []);

  useScrub(secRef, onUpdate, { start: "top top", end: "bottom bottom" });

  return (
    <section
      className="section--dark identity"
      id="identity"
      data-section="identity"
      data-theme="dark"
      data-screen-label="02 정체성"
      ref={secRef}
    >
      <div className="identity__sticky">
        <div className="inner">
          <span className="eyebrow reveal-up">
            <span className="num">02</span> / 정체성
          </span>
          <h2 className="reveal-up d1">
            우리는 <span className="hl">Blum 한국 독점 에이전트</span>입니다.
          </h2>
          <p className="lede reveal-up d2">
            우보인터내셔날 주식회사 — 프리미엄 가구 하드웨어·소재 수입 전문.
          </p>
          <p className="identity__kicker reveal-up d3">우리는 또한 —</p>
          <ul className="identity__loop" aria-hidden="true">
            {IDENTITY_KEYWORDS.map((kw, i) => (
              <li
                key={kw}
                className={`identity__kw${i === 0 ? " is-active" : ""}`}
                ref={(el) => {
                  if (el) itemsRef.current[i] = el;
                }}
              >
                {kw}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =========================== [03] 신념① · soft-close =========================== */
function DemoSoftClose() {
  const stageRef = useRef<HTMLDivElement>(null);

  const onUpdate = useCallback((p: number) => {
    setP(stageRef.current, p);
  }, []);

  useScrub(stageRef, onUpdate, { start: "top 86%", end: "top 32%" });

  return (
    <section
      className="section demo demo-softclose-wrap"
      data-section="demo-softclose"
      data-theme="light"
      data-screen-label="03 신념①"
    >
      <div className="inner">
        <div className="grid">
          <div className="demo__copy">
            <span className="eyebrow reveal-up">
              <span className="num">03</span> / 신념 · 하자 제로
            </span>
            <h3 className="reveal-up d1">
              손을 뗀 뒤에야,
              <br />
              진짜 차이가 드러납니다.
            </h3>
            <p className="lede reveal-up d1">
              세게 닫아도 사뿐히. ‘쾅’ 소리가 부르는{" "}
              <strong>클레임·재방문을 없앱니다.</strong>
            </p>
            <div className="chiprow reveal-up d2">
              <span className="chip chip--accent">BLUMOTION</span>
              <span className="chip">클레임 ↓</span>
              <span className="chip">쇼룸에서 직접 체험</span>
            </div>
            <a className="microcta reveal-up d3" href="#showroom">
              이 감각, 전국 쇼룸에서 직접 만져보세요{" "}
              <span className="arrow">→</span>
            </a>
          </div>
          <div className="reveal-up d1">
            <div className="demo__stage demo-softclose" data-demo="softclose" ref={stageRef}>
              <div className="cab" />
              <div className="runner" />
              <div className="soft">soft-close ·</div>
              <div className="drawer">
                <div className="face" />
              </div>
              <div className="grabhint">스크롤 = 서랍 닫힘 스크럽</div>
              <div className="stage-meter">
                <span>OPEN</span>
                <span className="track">
                  <i />
                </span>
                <span>SOFT&nbsp;CLOSE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== [04] 신념② · tool-free hinge =========================== */
const AXIS_TARGETS = ["78%", "30%", "66%"];

function DemoHinge() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const clickedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const hingeClick = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    clickedRef.current = true;
    stage.classList.add("clicked");
    const knobs = Array.from(stage.querySelectorAll<HTMLElement>(".axis .bar i"));
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    knobs.forEach((k, i) => {
      timersRef.current.push(
        window.setTimeout(
          () => k.style.setProperty("--ax", AXIS_TARGETS[i] || "60%"),
          reduce ? 0 : 180 + i * 220,
        ),
      );
    });
  }, [reduce]);

  const hingeReset = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    clickedRef.current = false;
    stage.classList.remove("clicked");
    stage
      .querySelectorAll<HTMLElement>(".axis .bar i")
      .forEach((k) => k.style.setProperty("--ax", "16%"));
  }, []);

  const onUpdate = useCallback(
    (p: number) => {
      setP(stageRef.current, p);
      if (!clickedRef.current && p > 0.36) hingeClick();
      if (clickedRef.current && p < 0.2) hingeReset();
    },
    [hingeClick, hingeReset],
  );

  useScrub(stageRef, onUpdate, { start: "top 86%", end: "top 30%" });

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <section
      className="section demo flip demo-hinge-wrap"
      data-section="demo-hinge"
      data-theme="light"
      data-screen-label="04 신념②"
    >
      <div className="inner">
        <div className="grid">
          <div className="demo__copy">
            <span className="eyebrow reveal-up">
              <span className="num">04</span> / 신념 · 시공 효율
            </span>
            <h3 className="reveal-up d1">공구 없이, 딸깍.</h3>
            <p className="lede reveal-up d1">
              끼우고 상하·좌우·깊이 3방향 미세조절.{" "}
              <strong>시공 시간과 재작업을 줄입니다.</strong>
            </p>
            <div className="chiprow reveal-up d2">
              <span className="chip chip--accent">CLIP top</span>
              <span className="chip">무공구</span>
              <span className="chip">3방향 조절</span>
            </div>
            <a className="microcta reveal-up d3" href="#showroom">
              쇼룸에서 직접 조절하고, 견적까지 상담하세요{" "}
              <span className="arrow">→</span>
            </a>
          </div>
          <div className="reveal-up d1">
            <div className="demo__stage demo-hinge" data-demo="hinge" ref={stageRef}>
              <div className="wall" />
              <div className="hinge h1" />
              <div className="hinge h2" />
              <div className="door" />
              <div className="click">click · 무공구 장착</div>
              <div className="axes">
                <div className="axis">
                  상하 ↕
                  <div className="bar">
                    <i />
                  </div>
                </div>
                <div className="axis">
                  좌우 ↔
                  <div className="bar">
                    <i />
                  </div>
                </div>
                <div className="axis">
                  깊이 ⇲
                  <div className="bar">
                    <i />
                  </div>
                </div>
              </div>
              <div className="stage-meter">
                <span>CLIP</span>
                <span className="track">
                  <i />
                </span>
                <span>3-WAY&nbsp;ADJ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== [05] 신념③ · TIP-ON =========================== */
function DemoTipOn() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);

  const onUpdate = useCallback((p: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    setP(stage, p);
    if (!openedRef.current && p > 0.55) {
      openedRef.current = true;
      stage.classList.add("open");
    }
    if (openedRef.current && p < 0.15) {
      openedRef.current = false;
      stage.classList.remove("open");
    }
  }, []);

  useScrub(stageRef, onUpdate, { start: "top 80%", end: "top 40%" });

  // reduced-motion: 정적(닫힘) 고정
  useEffect(() => {
    if (reduce) {
      const stage = stageRef.current;
      if (stage) {
        setP(stage, 0);
        stage.classList.remove("open");
      }
    }
  }, [reduce]);

  const onClick = useCallback(() => {
    if (reduce) return;
    const stage = stageRef.current;
    if (!stage) return;
    stage.classList.toggle("open");
    openedRef.current = stage.classList.contains("open");
  }, [reduce]);

  return (
    <section
      className="section section--dark demo demo-tipon-wrap"
      data-section="demo-tipon"
      data-theme="dark"
      data-screen-label="05 신념③"
    >
      <div className="inner">
        <div className="grid">
          <div className="demo__copy">
            <span className="eyebrow reveal-up">
              <span className="num">05</span> / 신념 · 디자인 자유
            </span>
            <h3 className="reveal-up d1">
              손잡이가 사라지면,
              <br />
              디자인이 완성됩니다.
            </h3>
            <p className="lede reveal-up d1">
              톡 누르면 열리는 TIP-ON.{" "}
              <strong>핸들 없는 미니멀, 더 넓은 제안 폭.</strong>
            </p>
            <div className="chiprow reveal-up d2">
              <span className="chip chip--accent">TIP-ON</span>
              <span className="chip">핸들리스</span>
            </div>
            <a className="microcta reveal-up d3" href="#showroom">
              전국 쇼룸에서 실물의 완성도를 확인하세요{" "}
              <span className="arrow">→</span>
            </a>
          </div>
          <div className="reveal-up d1">
            <div
              className="demo__stage demo-tipon"
              data-demo="tipon"
              ref={stageRef}
              onClick={onClick}
              style={reduce ? undefined : { cursor: "pointer" }}
            >
              <div className="cab" />
              <div className="drawerC" />
              <div className="tap">tap · 톡</div>
              <div className="stage-meter">
                <span>PUSH</span>
                <span className="track">
                  <i />
                </span>
                <span>TIP-ON&nbsp;OPEN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== [06] 약속 (Trust) =========================== */
type TrustCard = {
  idx: string;
  tt: string;
  ds: string;
  feat?: boolean;
  mark: React.ReactNode;
};

const TRUST_CARDS: TrustCard[] = [
  {
    idx: "01",
    tt: "Blum 한국 독점 에이전트",
    ds: "정품의 공식 통로 (sole agent)",
    feat: true,
    mark: <path d="M4 15 L12 23 L26 6" />,
  },
  {
    idx: "02",
    tt: "정품 보장 (유사품 차단)",
    ds: "A/S·부품 통로 확보",
    mark: <path d="M15 3 L26 8 V16 C26 23 21 26 15 28 C9 26 4 23 4 16 V8 Z" />,
  },
  {
    idx: "03",
    tt: "프리미엄 멀티브랜드 수입",
    ds: "유럽 하드웨어·소재 전문",
    mark: <circle cx="15" cy="15" r="11" />,
  },
  {
    idx: "04",
    tt: "가구 하드웨어 전문성",
    ds: "제작 현장을 아는 상담",
    mark: <path d="M5 22 L15 5 L25 22 Z" />,
  },
  {
    idx: "05",
    tt: "전국 쇼룸 직접 체험",
    ds: "실물 확인 · 방문 예약제",
    mark: <path d="M6 6 H24 V24 H6 Z M6 13 H24" />,
  },
  {
    idx: "06",
    tt: "자체 가구 생산 (김포 본점)",
    ds: "하드웨어부터 완제품까지",
    mark: <path d="M4 26 V12 L15 5 L26 12 V26" />,
  },
];

function Trust() {
  const gridRef = useRef<HTMLDivElement>(null);

  // 카드가 뷰포트에 들어오면 1회 마크 드로잉 (.is-draw → stroke-dashoffset 0)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".card"));
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
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
    <section
      className="section trust"
      data-section="trust"
      data-theme="light"
      data-screen-label="06 약속"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">06</span> / 약속
        </span>
        <h2 className="reveal-up d1">그래서, 우리가 독점으로 책임집니다.</h2>
        <p className="lede reveal-up d1">
          <span className="warn">
            유사품에 주의하십시오 — 정품 Blum은 한국 독점 에이전트 우보에서.
          </span>
        </p>
        <div className="cards" ref={gridRef}>
          {TRUST_CARDS.map((c) => (
            <div
              key={c.idx}
              className={`card${c.feat ? " feat" : ""}`}
            >
              <div className="idx">{c.idx}</div>
              <svg className="mark" viewBox="0 0 30 30">
                {c.mark}
              </svg>
              <div>
                <div className="tt">{c.tt}</div>
                <div className="ds">{c.ds}</div>
              </div>
            </div>
          ))}
        </div>
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

/* =========================== [07] 사회적 증거 (placeholder) =========================== */
function SocialProof() {
  return (
    <section
      className="section social"
      data-section="social"
      data-theme="light"
      data-screen-label="07 함께"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">07</span> / 함께
        </span>
        <h2 className="reveal-up d1">
          이미 많은 제작사와 고객이 Woobo와 함께합니다.
        </h2>
        <p className="lede reveal-up d1">
          현장에서 검증된 신뢰.{" "}
          <span className="todoinline">[TODO: 확인 — 레퍼런스·후기]</span>
        </p>
        <div
          className="social__logos ph reveal-up"
          data-ph="제작사 · 고객 로고월 — placeholder (실물 교체)"
        />
        <div className="social__quotes">
          <blockquote className="social__quote reveal-up d1">
            <p>“[TODO: 확인 — 고객/제작사 후기 문구]”</p>
            <cite>제작사 OO · [TODO]</cite>
          </blockquote>
          <blockquote className="social__quote reveal-up d2">
            <p>“[TODO: 확인 — 고객/제작사 후기 문구]”</p>
            <cite>고객 OO · [TODO]</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/* =========================== [08] 전국 쇼룸 (CTA) =========================== */
type ShowroomCard = {
  delay: string;
  name: string;
  tag: string;
  meta: React.ReactNode;
};

const SHOWROOM_CARDS: ShowroomCard[] = [
  {
    delay: "d1",
    name: "김포 본점",
    tag: "FLAGSHIP",
    meta: (
      <>
        대규모 쇼룸 + 가구 직접 생산
        <br />
        <span className="todo">[TODO: 확인 — 김포 주소·전화]</span>
      </>
    ),
  },
  {
    delay: "d2",
    name: "용인점",
    tag: "SHOWROOM",
    meta: (
      <>
        <span className="ph-line">T. 031-274-4241</span>
        <br />
        <span className="todo">[TODO: 확인 — 용인 주소]</span>
      </>
    ),
  },
  {
    delay: "d3",
    name: "부산지사",
    tag: "SHOWROOM",
    meta: (
      <>
        부산 동래구 안락동 459-29
        <br />
        <span className="ph-line">T. 051-323-2532</span>
      </>
    ),
  },
];

function Showroom() {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

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
      data-screen-label="08 CTA"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">08</span> / 다음 움직임
        </span>
        <h2 className="reveal-up d1">직접 만져보고 결정하세요 — 전국 쇼룸에서.</h2>
        <p className="lede reveal-up d1">
          <strong>방문 예약제</strong>로 운영합니다.
        </p>

        <div className="branches">
          {SHOWROOM_CARDS.map((c) => (
            <div key={c.name} className={`showroom-card reveal-up ${c.delay}`}>
              <div className="bh">
                <span className="name">{c.name}</span>
                <span className="tag">{c.tag}</span>
              </div>
              <div className="meta">{c.meta}</div>
              <a className="book" href={CTA_HREF.booking}>
                방문 예약 <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </div>

        <div
          className="ph map reveal-up"
          data-ph="전국 지점 지도 · 16:9 (지도 임베드/이미지 교체)"
        />

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
      </div>
    </section>
  );
}

/* =========================== PAGE =========================== */
export default function ManifestoClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="route-manifesto" ref={rootRef}>
      <SiteHeader
        brand="우보"
        sub="Blum 한국 독점 에이전트"
        ctaLabel="쇼룸 방문 예약 →"
        ctaHref="#showroom"
      />
      <main id="top">
        <Hero />
        <Identity />
        <DemoSoftClose />
        <DemoHinge />
        <DemoTipOn />
        <Trust />
        <SocialProof />
        <Showroom />
      </main>
    </div>
  );
}
