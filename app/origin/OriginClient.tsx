"use client";

import { useCallback, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useReveal } from "@/hooks/useReveal";
import { useScrub } from "@/hooks/useScrub";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CTA_HREF } from "@/lib/branches";
import "./origin.css";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const prefersReduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================== HERO (parallax) =========================== */
function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const bg = bgRef.current;
    if (!hero || !bg || prefersReduce()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg,
        { yPercent: 0 },
        {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, hero);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="hero sec-dark"
      id="hero"
      data-section="hero"
      data-theme="dark"
      ref={heroRef}
    >
      <div className="hero__bg" ref={bgRef}>
        <div
          className="ph is-dark"
          data-ph="풀블리드 영상 · 가구 하드웨어 작업 · 16:9 muted loop"
        >
          <span className="ph-cap">
            <b>풀블리드 영상 / 이미지</b>가구 하드웨어 작업 — 서랍 슬라이드·CNC·쇼룸
            핸즈온
            <br />
            16:9 · MUTED LOOP
          </span>
        </div>
      </div>
      <div className="hero__vignette" />
      <div className="wrap">
        <span className="eyebrow t-mono">01 / 우보의 여정</span>
        <h1 className="hero__title t-head">
          <span className="reveal-mask">
            <span>하나의 믿음에서</span>
          </span>
          <span className="reveal-mask">
            <span>시작했습니다.</span>
          </span>
          <span className="reveal-mask">
            <span className="quote">‘좋은 움직임이</span>
          </span>
          <span className="reveal-mask">
            <span className="quote">좋은 가구를 만든다.’</span>
          </span>
        </h1>
        <p className="hero__sub reveal-up d3">
          우보인터내셔날 주식회사 — 프리미엄 가구 하드웨어·소재 수입 전문. 그리고
          이제, <b>Blum 한국 독점 에이전트 + 전국 쇼룸</b>으로.
        </p>
      </div>
      <div className="scroll-cue">
        <span className="t-mono-sm">Scroll</span>
        <span className="scroll-cue__track" />
      </div>
    </section>
  );
}

/* =========================== HERITAGE (pinned timeline) =========================== */
const TL_NODES = [
  { at: "0.04", left: "15%", top: "8%", yr: "1952", desc: "Blum 창립 — 오스트리아 가족기업의 시작", tag: "Fact · Blum", todo: false },
  { at: "0.32", left: "54%", top: "34%", yr: "특허 2,100+", desc: "움직임을 향한 70여 년의 연구", tag: "Fact · Blum", todo: false },
  { at: "0.56", left: "18%", top: "60%", yr: "시험장비 26,000+", desc: "반복 개폐·내구 시험 설비", tag: "Fact · Blum", todo: false },
  { at: "0.78", left: "52%", top: "74%", yr: "우보 · 수입 전문", desc: "프리미엄 하드웨어·소재 수입", tag: "[TODO] placeholder", todo: true },
  { at: "0.96", left: "82%", top: "92%", yr: "Blum 한국 독점", desc: "독점 에이전트 + 전국 쇼룸 + 자체 생산", tag: "[TODO] placeholder", todo: true },
];

function Heritage() {
  const pinRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const draw = drawRef.current;
    if (!pin) return;

    const nodes = Array.from(pin.querySelectorAll<HTMLElement>(".tl-node"));
    const dots = Array.from(pin.querySelectorAll<HTMLElement>(".tl-dots i"));
    const counters = Array.from(
      pin.querySelectorAll<HTMLElement>(".stat__num[data-count]"),
    );

    let len = 0;
    const measure = () => {
      if (draw) {
        len = draw.getTotalLength();
        draw.style.strokeDasharray = String(len);
      }
    };
    measure();

    const render = (p: number) => {
      if (draw) draw.style.strokeDashoffset = String(len * (1 - p));
      nodes.forEach((n) =>
        n.classList.toggle("is-on", p >= parseFloat(n.dataset.at || "1") - 0.02),
      );
      const a = Math.round(p * (dots.length - 1));
      dots.forEach((d, i) => d.classList.toggle("is-on", i <= a));
      const ep = easeOutCubic(clamp((p - 0.1) / 0.7, 0, 1));
      counters.forEach((c) => {
        c.textContent = Math.round(
          Number(c.dataset.count) * ep,
        ).toLocaleString();
      });
    };

    if (prefersReduce()) {
      if (draw) draw.style.strokeDashoffset = "0";
      nodes.forEach((n) => n.classList.add("is-on"));
      dots.forEach((d) => d.classList.add("is-on"));
      counters.forEach((c) => {
        c.textContent = Number(c.dataset.count).toLocaleString();
      });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      });
    }, pin);

    // 모바일 주소창 접힘/펼침은 가로폭은 그대로 두고 세로만 바꾼다.
    // 그때마다 refresh 하면 스크롤이 한 칸 튀므로, 가로폭이 실제로 바뀐 경우만 갱신.
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      measure();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    render(0);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      className="heritage sec-dark"
      id="heritage"
      data-section="heritage"
      data-theme="dark"
    >
      <div className="pin-outer" ref={pinRef}>
        <div className="pin-stage">
          <div className="wrap">
            <div className="heritage__left">
              <span className="eyebrow t-mono">02 / 헤리티지</span>
              <h2 className="t-head-2">
                우리가 독점으로 취급하는 브랜드의 유산 — Blum, 70여 년 가족기업의
                외길.
              </h2>
              <div className="stat-row">
                <div className="stat">
                  <div className="stat__num" data-count="2100">
                    0
                  </div>
                  <span className="stat__lab">특허 (Blum 자체 기준)</span>
                </div>
                <div className="stat">
                  <div className="stat__num" data-count="26000">
                    0
                  </div>
                  <span className="stat__lab">시험장비 종 +</span>
                </div>
                <div className="stat">
                  <div
                    className="stat__num"
                    style={{
                      fontSize: "clamp(1.2rem,2vw,1.7rem)",
                      lineHeight: 1.2,
                      marginTop: "0.4em",
                    }}
                  >
                    Made in
                    <br />
                    Austria
                  </div>
                  <span className="stat__lab">오스트리아 제조</span>
                </div>
              </div>
              <div className="heritage__note">
                <b>Woobo는 이 유산을 한국에서 독점으로 잇는 에이전트</b> — 정품의
                공식 통로.
                <br />
                <span
                  className="t-mono-sm"
                  style={{
                    color: "var(--c-d-cap)",
                    display: "inline-block",
                    marginTop: "8px",
                  }}
                >
                  [TODO: 확인] 우보 자체 연혁 세부
                </span>
              </div>
            </div>
            <div className="timeline">
              <div className="tl-dots">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg viewBox="0 0 460 520" preserveAspectRatio="none" aria-hidden>
                <path
                  className="tl-track"
                  d="M70,40 C 280,90 60,200 250,250 C 420,295 120,400 330,470"
                />
                <path
                  className="tl-draw"
                  ref={drawRef}
                  d="M70,40 C 280,90 60,200 250,250 C 420,295 120,400 330,470"
                />
              </svg>
              {TL_NODES.map((n) => (
                <div
                  key={n.at}
                  className={`tl-node${n.todo ? " is-todo" : ""}`}
                  data-at={n.at}
                  style={{ left: n.left, top: n.top }}
                >
                  <div className="tl-node__card">
                    <span className="tl-node__ring" />
                    <div className="tl-node__yr">{n.yr}</div>
                    <div className="tl-node__desc">{n.desc}</div>
                    <div className="tl-node__tag">{n.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== DEMO A · soft-close (scrub) =========================== */
function DemoSoftClose() {
  const stageRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const msRef = useRef<HTMLSpanElement>(null);

  const onUpdate = useCallback((p: number) => {
    const drawer = drawerRef.current;
    const stage = stageRef.current;
    const ms = msRef.current;
    if (!drawer) return;
    const e = easeOutCubic(p);
    drawer.style.transform = `translateX(${lerp(48, -2, e)}%)`;
    stage?.classList.toggle("is-soft", p > 0.72 && p < 0.999);
    if (ms) ms.textContent = (clamp(1 - p, 0, 1) * 0.5).toFixed(2) + "s";
  }, []);

  useScrub(stageRef, onUpdate, { start: "top 85%", end: "top 15%" });

  return (
    <section
      className="sec-light sec-pad"
      id="demo-softclose"
      data-section="demo-softclose"
      data-theme="light"
    >
      <div className="wrap">
        <div className="demo-grid">
          <div className="demo-copy">
            <span className="eyebrow t-mono">03 / 결과 · 하자 제로</span>
            <h3 className="t-head-2 reveal-up">닫힘의 마지막 0.5초까지.</h3>
            <p className="lede reveal-up d1">
              세게 닫아도 사뿐히.{" "}
              <span className="u-emph">현장에선 클레임·재방문이 사라집니다.</span>
            </p>
            <div className="chips reveal-up d2">
              <span className="chip chip--orange">BLUMOTION</span>
              <span className="chip">클레임&nbsp;↓</span>
              <span className="chip chip--solid">쇼룸에서 직접 체험</span>
            </div>
            <a className="micro reveal-up d3" href="#showroom">
              이 감각, 전국 쇼룸에서 직접 만져보세요 <span className="arr">→</span>
            </a>
          </div>
          <div
            className="demo-stage demo-softclose reveal-up d1"
            data-demo="softclose"
            ref={stageRef}
          >
            <div className="scene">
              <div className="cabinet">
                <div className="cabinet__opening">
                  <div className="softzone" />
                  <div className="drawer" ref={drawerRef}>
                    <span className="drawer__glyph">Soft-close</span>
                  </div>
                </div>
                <div className="cabinet__rail" />
              </div>
            </div>
            <div className="hud">
              <span>Closing damping</span>
              <span className="hud__ms" ref={msRef}>
                0.50s
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== DEMO B · tool-free (onEnter sequence) =========================== */
function DemoToolFree() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const arm = root.querySelector<HTMLElement>(".hinge__arm");
    const burst = root.querySelector<HTMLElement>(".hinge__burst");
    const axes = Array.from(root.querySelectorAll<HTMLElement>(".axis"));
    if (!arm || !burst) return;

    if (prefersReduce()) {
      arm.classList.add("is-clicked");
      axes.forEach((a) => a.classList.add("is-on"));
      return;
    }

    let playing = false;
    const timers: number[] = [];
    const play = () => {
      if (playing) return;
      playing = true;
      arm.classList.remove("is-clicked");
      burst.classList.remove("is-go");
      axes.forEach((a) => a.classList.remove("is-on"));
      timers.push(window.setTimeout(() => arm.classList.add("is-clicked"), 250));
      timers.push(window.setTimeout(() => burst.classList.add("is-go"), 760));
      axes.forEach((a, i) =>
        timers.push(
          window.setTimeout(() => a.classList.add("is-on"), 1050 + i * 280),
        ),
      );
    };
    const io = new IntersectionObserver(
      (ents) =>
        ents.forEach((e) => (e.isIntersecting ? play() : (playing = false))),
      { threshold: 0.5 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <section
      className="sec-light sec-light-2 sec-pad"
      id="demo-toolfree"
      data-section="demo-toolfree"
      data-theme="light"
    >
      <div className="wrap">
        <div className="demo-grid demo-grid--rev">
          <div
            className="demo-stage demo-toolfree reveal-up"
            data-demo="toolfree"
            ref={rootRef}
          >
            <div className="scene">
              <div className="hinge">
                <div className="hinge__plate" />
                <div className="hinge__arm">
                  <span className="hinge__cup" />
                </div>
                <div className="hinge__burst">딸깍 · CLICK</div>
              </div>
              <div className="axes">
                <div className="axis" style={{ "--w": "64%" } as React.CSSProperties}>
                  <div className="axis__lab">
                    <span>상하 H</span>
                    <span className="v">+2.0</span>
                  </div>
                  <div className="axis__track">
                    <div className="axis__fill" />
                  </div>
                </div>
                <div className="axis" style={{ "--w": "48%" } as React.CSSProperties}>
                  <div className="axis__lab">
                    <span>좌우 S</span>
                    <span className="v">−1.5</span>
                  </div>
                  <div className="axis__track">
                    <div className="axis__fill" />
                  </div>
                </div>
                <div className="axis" style={{ "--w": "72%" } as React.CSSProperties}>
                  <div className="axis__lab">
                    <span>깊이 D</span>
                    <span className="v">+3.0</span>
                  </div>
                  <div className="axis__track">
                    <div className="axis__fill" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="demo-copy">
            <span className="eyebrow t-mono">04 / 결과 · 시공 효율</span>
            <h3 className="t-head-2 reveal-up">공구 없이, 딸깍.</h3>
            <p className="lede reveal-up d1">
              끼우고 상하·좌우·깊이 3방향 조절.{" "}
              <span className="u-emph">시공 시간·재작업&nbsp;↓.</span>
            </p>
            <div className="chips reveal-up d2">
              <span className="chip chip--orange">CLIP top</span>
              <span className="chip">무공구</span>
              <span className="chip chip--solid">3방향</span>
            </div>
            <a className="micro reveal-up d3" href="#showroom">
              쇼룸에서 직접 조절하고, 견적까지 상담하세요{" "}
              <span className="arr">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== DEMO C · TIP-ON (onEnter + click) =========================== */
function DemoTipOn() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const handler = () => root.classList.toggle("is-open");
    root.addEventListener("click", handler);
    if (prefersReduce()) {
      root.classList.add("is-open");
      return () => root.removeEventListener("click", handler);
    }
    const io = new IntersectionObserver(
      (ents) =>
        ents.forEach((e) =>
          root.classList.toggle(
            "is-open",
            e.isIntersecting && e.intersectionRatio > 0.55,
          ),
        ),
      { threshold: [0, 0.55, 0.8] },
    );
    io.observe(root);
    return () => {
      root.removeEventListener("click", handler);
      io.disconnect();
    };
  }, []);

  return (
    <section
      className="sec-dark sec-pad"
      id="demo-tipon"
      data-section="demo-tipon"
      data-theme="dark"
    >
      <div className="wrap">
        <div className="demo-grid">
          <div className="demo-copy">
            <span className="eyebrow t-mono">05 / 결과 · 디자인 자유</span>
            <h3 className="t-head-2 reveal-up">
              손잡이가 사라지면, 디자인이 완성됩니다.
            </h3>
            <p className="lede reveal-up d1">
              핸들리스 TIP-ON, 슬림한 LEGRABOX. 더 넓은 제안 폭.
            </p>
            <div className="chips reveal-up d2">
              <span className="chip chip--orange">TIP-ON</span>
              <span className="chip">LEGRABOX</span>
              <span className="chip">핸들리스</span>
            </div>
            <a className="micro reveal-up d3" href="#showroom">
              전국 쇼룸에서 실물의 완성도를 확인하세요{" "}
              <span className="arr">→</span>
            </a>
          </div>
          <div
            className="demo-stage demo-tipon reveal-up d1"
            data-demo="tipon"
            role="button"
            tabIndex={0}
            aria-label="서랍 톡 열기"
            ref={rootRef}
          >
            <span className="load-badge">
              하중 최대 약 70kg급 · 자체 시험 기준
            </span>
            <div className="scene">
              <div className="unit">
                <div className="unit__box">
                  <span className="legra">LEGRABOX · 슬림 프로파일</span>
                </div>
                <div className="unit__front">
                  <span className="seam" />
                  <span className="nohandle">No Handle · TIP-ON</span>
                </div>
              </div>
            </div>
            <span className="tip-hint">
              <i />
              탭하면 톡 열림
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== WHY (trust grid) =========================== */
const TRUST = [
  { ix: "A1", t: "Blum 한국 독점 에이전트", d: "정품의 공식 통로. 본사·코리아가 아닌, 한국 독점 에이전트(sole agent)입니다.", feature: true, svg: <><circle cx="17" cy="17" r="13" /><path d="M11 17.5l4 4 8-9" /></> },
  { ix: "A2", t: "정품 보장 (유사품 차단)", d: "공식 통로를 통한 정품만. 출처가 분명한 제품으로 현장 리스크를 줄입니다.", svg: <><path d="M17 4l11 4v8c0 7-5 12-11 14C11 28 6 23 6 16V8z" /><path d="M12 16l4 4 7-8" /></> },
  { ix: "A3", t: "프리미엄 멀티브랜드 수입", d: "가구 하드웨어·소재를 아우르는 프리미엄 유럽 브랜드 수입 전문기업.", svg: <><rect x="5" y="9" width="11" height="11" /><rect x="18" y="14" width="11" height="11" /></> },
  { ix: "A4", t: "가구 하드웨어 전문성", d: "움직임·결합·소재를 이해하는 팀. 제품 선정부터 시공 상담까지.", svg: <path d="M20 6a6 6 0 00-8 8L6 20l4 4 6-6a6 6 0 008-8l-4 4-4-4z" /> },
  { ix: "A5", t: "전국 쇼룸 직접 체험", d: "온라인으로 살짝, 그리고 전국 쇼룸에서 직접. 손끝의 완성도를 확인하세요.", svg: <><path d="M5 14l12-8 12 8" /><path d="M8 13v14h18V13" /><line x1="15" y1="27" x2="15" y2="19" /><line x1="19" y1="27" x2="19" y2="19" /></> },
  { ix: "A6", t: "자체 가구 생산 (김포 본점)", d: <>하드웨어를 다루는 손이 직접 가구를 만듭니다. <span style={{ color: "var(--c-ink-cap)" }}>[TODO] 세부</span></>, svg: <><path d="M6 12h22v6H6z" /><path d="M9 18v9M25 18v9M6 22h22" /></> },
];
const TRUST_DELAY = ["", "d1", "d2", "d1", "d2", "d3"];

function Why() {
  return (
    <section
      className="sec-light sec-pad"
      id="why"
      data-section="why"
      data-theme="light"
    >
      <div className="wrap">
        <div className="why__head">
          <div>
            <span className="eyebrow t-mono">06 / 왜 우보냐</span>
            <h2 className="t-head-2 reveal-up">
              그 Blum을, 한국에서{" "}
              <span className="u-accent">독점 에이전트</span>가 책임집니다.
            </h2>
          </div>
          <div className="why__warn reveal-up d1">
            <b>유사품에 주의</b> — 정품 Blum은 한국 독점 에이전트 우보에서.
          </div>
        </div>
        <div className="trust-grid">
          {TRUST.map((c, i) => (
            <div
              key={c.ix}
              className={`trust${c.feature ? " trust--feature" : ""} reveal-up${
                TRUST_DELAY[i] ? " " + TRUST_DELAY[i] : ""
              }`}
            >
              <span className="trust__ix">{c.ix}</span>
              <h4>{c.t}</h4>
              <p>{c.d}</p>
              <span className="trust__mark">
                <svg viewBox="0 0 34 34">{c.svg}</svg>
              </span>
            </div>
          ))}
        </div>
        <div className="multibrand reveal-up">
          <span className="bdg bdg--lead">Blum · 간판</span>
          <span className="bdg">AGOFORM · 독일</span>
          <span className="bdg">Peka · 스위스</span>
          <span>프리미엄 유럽 브랜드 수입 전문 — 페이지 포커스는 Blum 중심</span>
        </div>
      </div>
    </section>
  );
}

/* =========================== PARTNERS (logo wall + roadmap) =========================== */
const ROADMAP = [
  { yr: "Now", t: "독점 에이전트", d: "정품 공식 통로" },
  { yr: "Now", t: "전국 쇼룸", d: "김포·용인·부산" },
  { yr: "Next", t: "체험 확대", d: "핸즈온 데모 강화" },
  { yr: "Next", t: "자체 생산", d: "[TODO]" },
];
const LOGOS = ["제작사 로고", "제작사 로고", "제작사 로고", "제작사 로고", "레퍼런스", "레퍼런스", "[TODO]", "[TODO]"];

function Partners() {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const rmDrawRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrap = roadmapRef.current;
    const draw = rmDrawRef.current;
    if (!wrap) return;
    const steps = Array.from(wrap.querySelectorAll<HTMLElement>(".rm-step"));

    let len = 0;
    const measure = () => {
      if (draw) {
        len = draw.getTotalLength();
        draw.style.strokeDasharray = String(len);
        draw.style.strokeDashoffset = String(len);
      }
    };
    measure();

    const render = (raw: number) => {
      const p = clamp((raw - 0.15) / 0.6, 0, 1);
      if (draw) draw.style.strokeDashoffset = String(len * (1 - p));
      const a = Math.round(p * (steps.length - 1));
      steps.forEach((s, i) => s.classList.toggle("is-on", i <= a));
    };

    if (prefersReduce()) {
      if (draw) draw.style.strokeDashoffset = "0";
      steps.forEach((s) => s.classList.add("is-on"));
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      });
    }, wrap);

    // 모바일 주소창 접힘/펼침은 가로폭은 그대로 두고 세로만 바꾼다.
    // 그때마다 refresh 하면 스크롤이 한 칸 튀므로, 가로폭이 실제로 바뀐 경우만 갱신.
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      measure();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    render(0);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      className="sec-light sec-light-2 sec-pad"
      id="partners"
      data-section="partners"
      data-theme="light"
    >
      <div className="wrap">
        <span className="eyebrow t-mono">07 / 동행</span>
        <h2
          className="t-head-2 reveal-up"
          style={{
            fontSize: "clamp(1.8rem,3.2vw,2.8rem)",
            maxWidth: "20ch",
            marginTop: "18px",
          }}
        >
          한국의 제작 현장·고객과 함께 — 전국 쇼룸으로 더 가까이.
        </h2>
        <div className="logo-wall reveal-up d1">
          {LOGOS.map((l, i) => (
            <div className="logo-cell" key={i} data-ph={l}>
              <span className="ph-cap">{l}</span>
            </div>
          ))}
        </div>
        <div className="roadmap" ref={roadmapRef}>
          <svg preserveAspectRatio="none" aria-hidden>
            <path className="rm-line" d="M0,1 L1200,1" />
            <path className="rm-draw" ref={rmDrawRef} d="M0,1 L1200,1" />
          </svg>
          {ROADMAP.map((s, i) => (
            <div className="rm-step" key={i}>
              <span className="rm-step__dot" />
              <div className="rm-step__yr">{s.yr}</div>
              <h5>{s.t}</h5>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================== SHOWROOM CTA =========================== */
// c 의 지점 카드: 이름·플래그·태그·행(주소/전화) — 디자인 고유 마크업. 데이터는 BRANCHES 와 동일값.
const SHOWROOMS = [
  {
    name: "김포 본점",
    flag: "본점 · 생산",
    tag: "대규모 쇼룸 + 가구 직접 생산",
    rows: [
      { k: "주소", v: "[TODO: 확인]", todo: true },
      { k: "전화", v: "[TODO: 확인]", todo: true },
    ],
  },
  {
    name: "용인점",
    flag: "쇼룸",
    tag: "하드웨어·소재 핸즈온 체험",
    rows: [
      { k: "전화", v: "031-274-4241", todo: false },
      { k: "주소", v: "[TODO: 확인]", todo: true },
    ],
  },
  {
    name: "부산지사",
    flag: "쇼룸",
    tag: "영남권 직접 상담·체험",
    rows: [
      { k: "주소", v: "부산 동래구 안락동 459-29", todo: false },
      { k: "전화", v: "051-323-2532", todo: false },
    ],
  },
];

function Showroom() {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLAnchorElement>(null);

  const drawLine = useCallback(() => {
    const line = lineRef.current;
    if (!line) return;
    line.style.transition = "transform 1.1s var(--ease)";
    line.style.transform = "scaleX(1)";
  }, []);
  useInViewOnce(lineRef, drawLine, { amount: 0.6 });

  const pop = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const el = primaryRef.current;
    if (!el) return;
    el.classList.add("is-pop");
    window.setTimeout(() => el.classList.remove("is-pop"), 260);
  }, []);

  return (
    <section
      className="showroom sec-dark sec-pad"
      id="showroom"
      data-section="showroom"
      data-theme="dark"
    >
      <div className="wrap">
        <span className="eyebrow t-mono" style={{ display: "flex", justifyContent: "center" }}>
          08 / 다음 움직임
        </span>
        <h2 className="t-head showroom__head reveal-up" style={{ marginTop: "18px" }}>
          여정의 다음 장 — 전국 쇼룸에서 직접 만나요.
        </h2>
        <p className="showroom__sub reveal-up d1">
          <b>방문 예약제</b>로 운영합니다.
        </p>
        <div className="showroom-grid">
          {SHOWROOMS.map((s, i) => (
            <div className={`showroom-card reveal-up d${i + 1}`} key={s.name}>
              <div className="showroom-card__top">
                <span className="showroom-card__name">{s.name}</span>
                <span className="showroom-card__flag">{s.flag}</span>
              </div>
              <p className="showroom-card__tag">{s.tag}</p>
              <div className="showroom-card__meta">
                {s.rows.map((r) => (
                  <div className="showroom-card__row" key={r.k}>
                    <span className="k">{r.k}</span>
                    <span className={r.todo ? "showroom-card__todo" : undefined}>
                      {r.v}
                    </span>
                  </div>
                ))}
              </div>
              <a className="showroom-card__book" href={CTA_HREF.booking}>
                방문 예약 <span className="arr">→</span>
              </a>
            </div>
          ))}
        </div>
        <div
          className="showroom__map ph is-dark reveal-up"
          data-ph="전국 지점 인터랙티브 맵(김포·용인·부산)"
        >
          <span className="ph-cap">
            <b>전국 지점 지도</b>김포 · 용인 · 부산 — 인터랙티브 맵 placeholder
          </span>
        </div>
        <div className="showroom__actions">
          <a className="btn btn--primary" href={CTA_HREF.booking} ref={primaryRef} onClick={pop}>
            쇼룸 방문 예약 <span className="arr">→</span>
          </a>
          <a className="btn btn--secondary" href={CTA_HREF.quote}>
            견적·상담 요청
          </a>
          <a className="btn btn--ghost" href={CTA_HREF.catalog}>
            카탈로그 받기
          </a>
        </div>
        <div
          className="close-line"
          ref={lineRef}
          style={reduce ? { transform: "scaleX(1)" } : undefined}
        />
        <div className="showroom__foot reveal-up">
          Woobo · <b>Blum 한국 독점 에이전트</b> · moving ideas
        </div>
      </div>
    </section>
  );
}

/* =========================== PAGE =========================== */
export default function OriginClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="route-origin" ref={rootRef}>
      <SiteHeader
        brand="Woobo"
        sub="Blum 독점 에이전트"
        ctaLabel="방문 예약 →"
        ctaHref="#showroom"
        nav={[
          { label: "헤리티지", href: "#heritage", hideSm: true },
          { label: "왜 우보냐", href: "#why", hideSm: true },
          { label: "쇼룸", href: "#showroom", hideSm: true },
        ]}
      />
      <main>
        <Hero />
        <Heritage />
        <DemoSoftClose />
        <DemoToolFree />
        <DemoTipOn />
        <Why />
        <Partners />
        <Showroom />
      </main>
    </div>
  );
}
