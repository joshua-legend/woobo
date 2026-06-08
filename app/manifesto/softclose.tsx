"use client";

import { useCallback, useRef } from "react";
import { useScrub } from "@/hooks/useScrub";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const setP = (el: HTMLElement | null, v: number) => {
  if (el) el.style.setProperty("--p", v.toFixed(4));
};
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2);

/* ---------- scrub (현행) — 스크롤로 닫힘 + 끝 감속 ---------- */
function SoftStageScrub() {
  const stageRef = useRef<HTMLDivElement>(null);
  const onUpdate = useCallback((p: number) => setP(stageRef.current, p), []);
  useScrub(stageRef, onUpdate, { start: "top 86%", end: "top 32%" });

  return (
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
  );
}

/* ---------- throw (던지고 정착) — 드래그로 세게 던져도 항상 사뿐히 ---------- */
function SoftStageThrow() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<"scrub" | "drag" | "closing">("scrub");
  const pRef = useRef(0);
  const dragRef = useRef({ startX: 0, startP: 0 });

  const apply = (p: number) => {
    pRef.current = p;
    setP(stageRef.current, p);
  };

  const onUpdate = useCallback((p: number) => {
    if (modeRef.current !== "scrub") return;
    apply(p);
  }, []);
  useScrub(stageRef, onUpdate, { start: "top 86%", end: "top 32%" });

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduce) return;
    modeRef.current = "drag";
    dragRef.current = { startX: e.clientX, startP: pRef.current };
    if (drawerRef.current) drawerRef.current.style.transition = "none";
    stageRef.current?.classList.add("is-grab");
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (modeRef.current !== "drag") return;
    const w = stageRef.current?.clientWidth || 400;
    const dx = e.clientX - dragRef.current.startX;
    // 오른쪽으로 끌면 열림(p↓), 왼쪽으로 닫힘(p↑)
    apply(clamp(dragRef.current.startP - dx / (w * 0.55), 0, 1));
  };
  const onPointerUp = () => {
    if (modeRef.current !== "drag") return;
    modeRef.current = "closing";
    stageRef.current?.classList.remove("is-grab");
    const d = drawerRef.current;
    if (!d) {
      modeRef.current = "scrub";
      return;
    }
    d.style.transition = "transform 0.75s var(--ease)";
    apply(1); // 아무리 세게 던져도 사뿐히 닫힘
    window.setTimeout(() => {
      d.style.transition = "";
      modeRef.current = "scrub";
    }, 780);
  };

  return (
    <div
      className="demo__stage demo-softclose demo-softthrow"
      data-demo="softthrow"
      ref={stageRef}
    >
      <div className="cab" />
      <div className="runner" />
      <div className="soft">soft-close ·</div>
      <div
        className="drawer"
        ref={drawerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={reduce ? undefined : { cursor: "grab", touchAction: "none" }}
      >
        <div className="face" />
      </div>
      <div className="grabhint">
        {reduce ? "" : "잡고 세게 던져보세요 — 항상 사뿐히 ↩"}
      </div>
      <div className="stage-meter">
        <span>OPEN</span>
        <span className="track">
          <i />
        </span>
        <span>SOFT&nbsp;CLOSE</span>
      </div>
    </div>
  );
}

/* ---------- compare (쾅 vs 사뿐 · 절제) — 일반은 빨리 닫고 미세 범프, 소프트는 감속 ---------- */
function SoftStageCompare() {
  const stageRef = useRef<HTMLDivElement>(null);
  const hardRef = useRef<HTMLDivElement>(null);
  const bumpRef = useRef(false);

  const onUpdate = useCallback((p: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const ph = clamp(p / 0.62, 0, 1); // 일반: 빨리 닫힘
    const ps = easeOut(p); // 소프트: 감속 정착
    stage.style.setProperty("--ph", ph.toFixed(4));
    stage.style.setProperty("--ps", ps.toFixed(4));
    // 절제된 '딱 멈춤' 범프(슬램 이징 없이 미세 반동 1회)
    if (ph > 0.985 && !bumpRef.current) {
      bumpRef.current = true;
      const h = hardRef.current;
      if (h) {
        h.classList.remove("is-bump");
        void h.offsetWidth;
        h.classList.add("is-bump");
      }
    }
    if (ph < 0.9) bumpRef.current = false;
  }, []);
  useScrub(stageRef, onUpdate, { start: "top 86%", end: "top 32%" });

  return (
    <div className="demo__stage sc-compare" data-demo="softcompare" ref={stageRef}>
      <div className="sc-col sc-col--hard">
        <div className="sc-cab" />
        <div className="sc-drawer" ref={hardRef} />
        <div className="sc-cap">// 일반 — ‘쾅’ · 클레임·재방문</div>
      </div>
      <div className="sc-col sc-col--soft">
        <div className="sc-cab" />
        <div className="sc-drawer" />
        <div className="sc-cap">// BLUMOTION — 사뿐 · 클레임 ↓</div>
      </div>
    </div>
  );
}

/* =========================== [03] 신념① · 소프트클로즈 (버저닝 래퍼) =========================== */
export function SoftByVariant({ variant }: { variant: string }) {
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
              이 감각, 전국 쇼룸에서 직접 만져보세요 <span className="arrow">→</span>
            </a>
          </div>
          <div className="reveal-up d1">
            {variant === "throw" ? (
              <SoftStageThrow />
            ) : variant === "compare" ? (
              <SoftStageCompare />
            ) : (
              <SoftStageScrub />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
