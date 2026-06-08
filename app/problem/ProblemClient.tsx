"use client";

import { useCallback, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useReveal } from "@/hooks/useReveal";
import { useScrub } from "@/hooks/useScrub";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BRANCHES, CTA_HREF } from "@/lib/branches";
import "./problem.css";

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

/* =========================== HERO =========================== */
function Hero() {
  return (
    <section
      id="hero"
      className="hero section"
      data-section="hero"
      data-theme="light"
    >
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-text">
            <p className="label reveal-up">
              <span className="bar" />
              01 / 현장
            </p>
            <h1 className="h1">
              <span className="reveal-mask d1">
                <span>당신은 1mm까지</span>
              </span>
              <br />
              <span className="reveal-mask d2">
                <span>맞췄습니다.</span>
              </span>
              <br />
              <span className="reveal-mask d3">
                <span>그런데 클레임은 늘</span>
              </span>
              <br />
              <span className="reveal-mask d3">
                <span>
                  <span className="u-orange">하드웨어</span>에서 옵니다.
                </span>
              </span>
            </h1>
            <p className="sub hero-sub reveal-up d2">
              병행수입·유사품 하자, 직접 못 보고 사는 불안, 정보부족 — 더는
              떠안지 마세요.
            </p>
            <div className="hero-actions reveal-up d3">
              <a href="#solution" className="btn btn--primary">
                해결을 보다 <span className="arr">→</span>
              </a>
              <a href="#problem" className="btn btn--ghost">
                왜 이런 일이 생길까 ↓
              </a>
            </div>
            <div className="hero-meta reveal-up d4">
              <div className="m">
                <span className="k">Operator</span>
                <span className="v">우보인터내셔날 주식회사</span>
              </div>
              <div className="m">
                <span className="k">Position</span>
                <span className="v">프리미엄 하드웨어·소재 수입 전문</span>
              </div>
              <div className="m">
                <span className="k">Channel</span>
                <span className="v">전국 오프라인 쇼룸</span>
              </div>
            </div>
          </div>
          <div
            className="hero-art ph reveal-up d3"
            data-ph="현장 — 시공된 가구 클로즈업 · 4:5"
          >
            <span className="cap">// 현장 — 시공된 가구 클로즈업 (placeholder)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== PROBLEM (slam) =========================== */
function Problem() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const doorRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const fireSlam = useCallback(() => {
    const door = doorRef.current;
    const flash = flashRef.current;
    const stage = stageRef.current;
    const label = labelRef.current;
    if (!door || !stage) return;
    door.style.transition = "transform .13s var(--ease-slam)";
    door.classList.add("is-shut");
    flash?.animate?.(
      [{ opacity: 0 }, { opacity: 0.5, offset: 0.12 }, { opacity: 0 }],
      { duration: 260, easing: "cubic-bezier(0.72,0,1,1)" },
    );
    stage.animate?.(
      [
        { transform: "translate(0,0)" },
        { transform: "translate(2px,-2px)", offset: 0.15 },
        { transform: "translate(-2px,1px)", offset: 0.3 },
        { transform: "translate(0,0)" },
      ],
      { duration: 300, easing: "ease-out" },
    );
    window.setTimeout(() => {
      if (!label) return;
      label.classList.add("is-shown");
      label.style.transition = "transform .4s var(--ease-soft),opacity .3s";
      label.style.transform = "translateY(0)";
    }, 160);
  }, []);

  useInViewOnce(stageRef, fireSlam, { amount: 0.55 });

  return (
    <section
      id="problem"
      className="problem section section--pad is-dark"
      data-section="problem"
      data-theme="dark"
    >
      <div className="wrap">
        <div className="problem-grid">
          <div className="problem-text">
            <p className="label reveal-up">
              <span className="bar" />
              02 / 문제
            </p>
            <h2 className="h2 reveal-up d1">
              출처가 불분명하고
              <br />
              직접 못 보면, 품질도
              <br />
              책임도 흔들립니다.
            </h2>
            <p className="sub reveal-up d2">
              병행수입·<strong>유사품</strong>·정보부족·실물 미확인은
              위조·A/S 불가·부품 단종 리스크가 따라옵니다.{" "}
              <strong className="u-orange">유사품에 주의하십시오.</strong>
            </p>
            <div className="chips chips--spaced reveal-up d3">
              <span className="chip">위조 리스크</span>
              <span className="chip">A/S 불가</span>
              <span className="chip">부품 단종</span>
            </div>
          </div>
          <div className="problem-demo">
            <div className="slam-stage" ref={stageRef}>
              <div className="slam-frame" />
              <div
                className={`slam-door${reduce ? " is-shut" : ""}`}
                ref={doorRef}
              />
              <div className="slam-flash" ref={flashRef} />
              <div className="slam-label" ref={labelRef}>
                // 쾅 — 이것이 나쁜 경험입니다
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== CAUSE (dark → light) =========================== */
function Cause() {
  const reduce = useReducedMotion();
  const secRef = useRef<HTMLElement>(null);

  const lit = useCallback(() => {
    const el = secRef.current;
    if (!el) return;
    el.classList.add("is-lit");
    el.setAttribute("data-theme", "light");
  }, []);

  useInViewOnce(secRef, lit, { amount: 0, rootMargin: "0px 0px -45% 0px" });

  return (
    <section
      id="cause"
      ref={secRef}
      className={`cause section section--pad is-dark${reduce ? " is-lit" : ""}`}
      data-section="cause"
      data-theme={reduce ? "light" : "dark"}
    >
      <div className="wrap">
        <div className="cause-inner">
          <p className="label reveal-up">
            <span className="bar" />
            03 / 원인
          </p>
          <p className="cause-lead reveal-up d1">
            문제의 뿌리는 제품이 아니라
            <br />
            <strong className="u-orange">‘어디서 샀고, 직접 확인했는가’</strong>
            입니다.
          </p>
          <p className="sub cause-sub reveal-up d2">
            병행수입·유사품 경로엔 정품 통로가 없습니다 — 정품 Blum은{" "}
            <strong>한국 독점 에이전트</strong> 한 곳을 거칩니다.
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================== SOLUTION (wordmark) =========================== */
function Solution() {
  const reduce = useReducedMotion();
  const floatRef = useRef<HTMLSpanElement>(null);

  const afloat = useCallback(() => {
    floatRef.current?.classList.add("is-afloat");
  }, []);

  useInViewOnce(floatRef, afloat, { amount: 0.5 });

  return (
    <section
      id="solution"
      className="solution section"
      data-section="solution"
      data-theme="light"
    >
      <div className="wrap">
        <p className="label solution-tagline reveal-up">
          <span className="bar" />
          04 / 해결 · Blum 한국 독점 에이전트 · 프리미엄 하드웨어 수입 전문
        </p>
        <div className="giant">
          <span className="reveal-mask">
            <span className={`float${reduce ? "" : ""}`} ref={floatRef}>
              Woobo
            </span>
          </span>
        </div>
        <h2 className="h2 solution-declare reveal-up d1">
          그래서, 정품의 공식 통로
          <br />— <span className="u-orange">Blum 한국 독점 에이전트 Woobo</span>
          에서
          <br />
          직접 보고 사세요.
        </h2>
        <p className="sub solution-sub reveal-up d2">
          정품 보장(유사품 차단)·A/S는 기본,{" "}
          <strong>전국 쇼룸에서 직접 확인하고 상담</strong>까지.
        </p>
        <div className="reveal-up d3">
          <span className="solution-minilabel">
            우보인터내셔날 주식회사 — 프리미엄 가구 하드웨어·소재 수입 전문
          </span>
        </div>
      </div>
    </section>
  );
}

/* =========================== DEMO A · soft-close =========================== */
function DemoSoftClose() {
  const reduce = useReducedMotion();
  const secRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const damperRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  const onUpdate = useCallback((p: number) => {
    const drawer = drawerRef.current;
    const damper = damperRef.current;
    const tag = tagRef.current;
    if (!drawer) return;
    const eased = easeOutExpo(p);
    drawer.style.transform = `translateX(${(1 - eased) * 70}%)`;
    if (damper) damper.style.width = `${clamp((p - 0.62) / 0.38, 0, 1) * 7}%`;
    if (tag) {
      if (p > 0.92) {
        tag.textContent = "// BLUMOTION — 사뿐히, 끝까지 닫힘";
        tag.style.color = "var(--color-orange)";
      } else if (p > 0.2) {
        tag.textContent = "// 닫는 중 — 감속이 시작됩니다";
        tag.style.color = "";
      } else {
        tag.textContent = "// 스크롤로 서랍을 닫아보세요";
        tag.style.color = "";
      }
    }
  }, []);

  useScrub(secRef, onUpdate);

  return (
    <section
      id="softclose"
      ref={secRef}
      className="demo section"
      data-section="proof-softclose"
      data-theme="light"
      data-scrub={reduce ? undefined : ""}
    >
      <div className="demo-sticky">
        <div className="wrap">
          <div className="demo-grid">
            <div className="demo-copy">
              <p className="label reveal-up">
                <span className="bar" />
                05 / 증거 · 하자 제로
              </p>
              <h3 className="h3 reveal-up d1">
                닫힘의 끝까지
                <br />
                책임집니다.
              </h3>
              <p className="sub reveal-up d2">
                세게 닫아도 사뿐히.{" "}
                <strong>클레임·재방문을 없앱니다.</strong>
              </p>
              <div className="chips reveal-up d3">
                <span className="chip chip--accent">BLUMOTION</span>
                <span className="chip">클레임 ↓</span>
                <span className="chip">쇼룸에서 직접 체험</span>
              </div>
              <p className="demo-micro reveal-up d4">
                이 감각, 전국 쇼룸에서 직접 만져보세요 →
              </p>
            </div>
            <div className="demo-stage">
              <div
                className="softclose-cab"
                data-ph="제품 마크로 — 서랍+BLUMOTION 댐퍼 (현재 CSS 모형)"
              >
                <div className="scrub-hint">
                  <span className="dotpulse" />
                  scroll
                </div>
                <div className="carcass" />
                <div className="rail" />
                <div className="damper" ref={damperRef} />
                <div className="drawer" ref={drawerRef} />
                <div className="gap-tag" ref={tagRef}>
                  // 스크롤로 서랍을 닫아보세요
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== DEMO B · tool-free hinge =========================== */
function DemoToolFree() {
  const reduce = useReducedMotion();
  const secRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const armRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const burstFired = useRef(false);

  const onUpdate = useCallback(
    (p: number) => {
      const plate = plateRef.current;
      const arm = armRef.current;
      const burst = burstRef.current;
      if (!plate) return;
      plate.style.transform = `translateY(-50%) scale(${clamp(p / 0.22, 0, 1)})`;
      if (arm) arm.style.width = `${clamp((p - 0.05) / 0.25, 0, 1) * 16}%`;
      if (
        p > 0.27 &&
        !burstFired.current &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        burstFired.current = true;
        burst?.animate?.(
          [
            { transform: "translate(-50%,-50%) scale(0)", opacity: 1 },
            { transform: "translate(-50%,-50%) scale(2.4)", opacity: 0 },
          ],
          { duration: 520, easing: "cubic-bezier(0.34,1.56,0.64,1)" },
        );
      }
      if (p < 0.2) burstFired.current = false;

      const targets = [50, 64, 42];
      const starts = [0.4, 0.55, 0.7];
      const rows = rowsRef.current?.querySelectorAll<HTMLElement>(".axis-row");
      rows?.forEach((row, i) => {
        const on = p > starts[i];
        row.classList.toggle("is-on", on);
        const knob = row.querySelector<HTMLElement>(".knob");
        if (knob) knob.style.left = on ? `${targets[i]}%` : "0%";
      });
    },
    [reduce],
  );

  useScrub(secRef, onUpdate);

  return (
    <section
      id="toolfree"
      ref={secRef}
      className="demo section"
      data-section="proof-toolfree"
      data-theme="light"
      data-scrub={reduce ? undefined : ""}
    >
      <div className="demo-sticky">
        <div className="wrap">
          <div className="demo-grid">
            <div className="demo-copy">
              <p className="label reveal-up">
                <span className="bar" />
                06 / 증거 · 시공 효율
              </p>
              <h3 className="h3 reveal-up d1">공구 없이, 딸깍.</h3>
              <p className="sub reveal-up d2">
                끼우고 상하·좌우·깊이 3방향 조절.{" "}
                <strong>시공 시간·재작업 ↓.</strong>
              </p>
              <div className="chips reveal-up d3">
                <span className="chip chip--accent">CLIP top</span>
                <span className="chip">무공구</span>
                <span className="chip">3방향</span>
              </div>
              <p className="demo-micro reveal-up d4">
                쇼룸에서 직접 조절하고, 견적까지 상담하세요 →
              </p>
            </div>
            <div className="demo-stage">
              <div
                className="toolfree-cab"
                data-ph="제품 마크로 — CLIP top 힌지 장착 + 3축 조절 (현재 CSS 모형)"
              >
                <div className="scrub-hint">
                  <span className="dotpulse" />
                  scroll
                </div>
                <div className="side" />
                <div className="door" />
                <div className="hinge-arm" ref={armRef} />
                <div className="hinge-plate" ref={plateRef} />
                <div className="click-burst" ref={burstRef} />
                <div className="axis-panel" ref={rowsRef}>
                  <div className="axis-row" data-axis="0">
                    <div className="ax-k">
                      <span>좌우 · SIDE</span>
                      <b>±2mm</b>
                    </div>
                    <div className="axis-track">
                      <div className="knob" />
                    </div>
                  </div>
                  <div className="axis-row" data-axis="1">
                    <div className="ax-k">
                      <span>상하 · HEIGHT</span>
                      <b>±2mm</b>
                    </div>
                    <div className="axis-track">
                      <div className="knob" />
                    </div>
                  </div>
                  <div className="axis-row" data-axis="2">
                    <div className="ax-k">
                      <span>깊이 · DEPTH</span>
                      <b>±2mm</b>
                    </div>
                    <div className="axis-track">
                      <div className="knob" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== DEMO C · TIP-ON =========================== */
function DemoTipOn() {
  const reduce = useReducedMotion();
  const secRef = useRef<HTMLElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const pushRef = useRef<HTMLDivElement>(null);
  const forced = useRef<boolean | null>(null);

  const setOpen = useCallback((open: boolean) => {
    faceRef.current?.classList.toggle("is-open", open);
    if (pushRef.current) pushRef.current.style.display = open ? "none" : "";
  }, []);

  const onUpdate = useCallback(
    (p: number) => {
      if (reduce) {
        setOpen(true);
        return;
      }
      if (forced.current !== null) return;
      setOpen(p > 0.42 && p < 0.95);
    },
    [reduce, setOpen],
  );

  useScrub(secRef, onUpdate);

  // reduced-motion: 최종상태(열림) 고정
  useEffect(() => {
    if (reduce) setOpen(true);
  }, [reduce, setOpen]);

  const onClick = useCallback(() => {
    const open = !faceRef.current?.classList.contains("is-open");
    forced.current = open;
    setOpen(open);
  }, [setOpen]);

  return (
    <section
      id="tipon"
      ref={secRef}
      className="demo section is-dark"
      data-section="proof-tipon"
      data-theme="dark"
      data-scrub={reduce ? undefined : ""}
    >
      <div className="demo-sticky">
        <div className="wrap">
          <div className="demo-grid">
            <div className="demo-copy">
              <p className="label reveal-up">
                <span className="bar" />
                07 / 증거 · 디자인 자유
              </p>
              <h3 className="h3 reveal-up d1">손잡이 없이, 톡.</h3>
              <p className="sub reveal-up d2">
                핸들리스 미니멀, 더 넓은 제안 폭.
              </p>
              <div className="chips reveal-up d3">
                <span className="chip chip--accent">TIP-ON</span>
                <span className="chip">핸들리스</span>
              </div>
              <p className="demo-micro reveal-up d4">
                전국 쇼룸에서 실물의 완성도를 확인하세요 →
              </p>
            </div>
            <div className="demo-stage">
              <div
                className="tipon-cab"
                data-ph="제품 마크로 — TIP-ON 핸들리스 서랍 (현재 CSS 모형)"
              >
                <div className="frame" />
                <div className="tip-face" ref={faceRef} onClick={onClick} />
                <div className="tip-push" ref={pushRef}>
                  // 눌러 보세요
                </div>
                <div className="tip-hint">
                  // 핸들리스 — 면을 톡 누르면 열립니다
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================== TRUST =========================== */
const TRUST = [
  { n: "01", t: "Blum 한국 독점 에이전트", d: "정품의 공식 통로. 본사를 거치는 단 하나의 채널.", accent: true },
  { n: "02", t: "정품 보장", d: "유사품 차단. 위조·미인증 부품의 유입을 막습니다." },
  { n: "03", t: "프리미엄 멀티브랜드 수입", d: "유럽 프리미엄 하드웨어·소재를 직접 수입·공급." },
  { n: "04", t: "가구 하드웨어 전문성", d: "제작 현장을 아는 상담. 스펙부터 시공까지." },
  { n: "05", t: "전국 쇼룸 직접 체험", d: "실물을 보고, 만지고, 결정합니다." },
  { n: "06", t: "자체 가구 생산", d: "김포 본점 — 하드웨어를 가장 잘 쓰는 곳에서." },
];
const TRUST_DELAY = ["", "d1", "d2", "d1", "d2", "d3"];

function Trust() {
  return (
    <section
      id="trust"
      className="trust section section--pad"
      data-section="trust"
      data-theme="light"
    >
      <div className="wrap">
        <p className="label reveal-up">
          <span className="bar" />
          08 / 안심
        </p>
        <h2 className="h2 reveal-up d1">
          독점 에이전트라,
          <br />
          끝까지 안심.
        </h2>
        <p className="sub reveal-up d2">
          <strong className="u-orange">유사품에 주의</strong> — 정품 Blum은 한국
          독점 에이전트 우보에서.
        </p>
        <div className="trust-grid">
          {TRUST.map((c, i) => (
            <div
              key={c.n}
              className={`trust-cell${c.accent ? " trust-cell--accent" : ""} reveal-up${
                TRUST_DELAY[i] ? " " + TRUST_DELAY[i] : ""
              }`}
            >
              <div className="num">{c.n}</div>
              <div>
                <h4>{c.t}</h4>
                <p>{c.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="brand-badge reveal-up d2">
          <span>프리미엄 유럽 브랜드 수입 전문</span>
          <span className="b b--lead">Blum</span>
          <span className="b">AGOFORM · 독일</span>
          <span className="b">Peka · 스위스</span>
          <span style={{ color: "var(--color-caption)" }}>외</span>
        </div>
      </div>
    </section>
  );
}

/* =========================== CTA / SHOWROOMS =========================== */
function Cta() {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const showLine = useCallback(() => {
    lineRef.current?.classList.add("is-in");
  }, []);
  useInViewOnce(lineRef, showLine, { amount: 0.5 });

  const pop = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const el = ctaRef.current;
      if (!el || reduce) return;
      el.classList.remove("is-pop");
      void el.offsetWidth;
      el.classList.add("is-pop");
    },
    [reduce],
  );

  return (
    <section
      id="cta"
      className="cta section is-dark"
      data-section="cta"
      data-theme="dark"
    >
      <div className="wrap">
        <p className="label label--center reveal-up">09 / 다음 움직임</p>
        <h2 className="h2 reveal-up d1">
          직접 보고 결정하세요
          <br />— 전국 쇼룸에서.
        </h2>
        <p className="sub cta-sub reveal-up d2">
          <strong>방문 예약제</strong>로 운영합니다.
        </p>

        <div className="showroom-grid">
          {BRANCHES.map((b, i) => (
            <div
              key={b.id}
              className={`showroom-card reveal-up${i ? " d" + i : ""}`}
            >
              <div className="card-tag">{b.name}</div>
              <h3>{b.city}</h3>
              <p className="card-desc">{b.desc}</p>
              <div className="card-meta">
                {b.address ? (
                  b.address
                ) : (
                  <>
                    주소 <span className="todo">[TODO: 확인]</span>
                  </>
                )}
                <br />
                전화{" "}
                {b.phone ? b.phone : <span className="todo">[TODO: 확인]</span>}
              </div>
              <a href={CTA_HREF.booking} className="card-link">
                방문 예약 <span className="arr">→</span>
              </a>
            </div>
          ))}
        </div>

        <div
          className="map-ph ph reveal-up"
          data-ph="전국 지점 지도 · 16:5 (김포·용인·부산)"
        >
          <span className="cap">
            // 전국 지점 지도 (placeholder) — 김포 · 용인 · 부산
          </span>
        </div>

        <div className="cta-actions reveal-up">
          <a
            href={CTA_HREF.booking}
            className="btn btn--primary"
            ref={ctaRef}
            onClick={pop}
          >
            쇼룸 방문 예약 <span className="arr">→</span>
          </a>
          <a href={CTA_HREF.quote} className="btn btn--secondary">
            견적·상담 요청
          </a>
          <a href={CTA_HREF.catalog} className="btn btn--ghost">
            카탈로그 받기 ↓
          </a>
        </div>
      </div>

      <div className={`close-line${reduce ? " is-in" : ""}`} ref={lineRef} />
      <div className="wrap">
        <div className="foot">
          <div className="f-mark">
            Woobo<span className="dot">.</span>
          </div>
          <div className="f-note">Blum 한국 독점 에이전트 · moving ideas</div>
        </div>
      </div>
    </section>
  );
}

/* =========================== PAGE =========================== */
export default function ProblemClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="route-problem" ref={rootRef}>
      <SiteHeader
        brand="Woobo"
        sub="Blum 한국 독점 에이전트"
        ctaLabel="쇼룸 방문 예약"
        ctaHref="#cta"
      />
      <main>
        <Hero />
        <Problem />
        <Cause />
        <Solution />
        <DemoSoftClose />
        <DemoToolFree />
        <DemoTipOn />
        <Trust />
        <Cta />
      </main>
    </div>
  );
}
