"use client";

import { useCallback, useRef, useState } from "react";
import { useScrub } from "@/hooks/useScrub";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { VideoScrubStage } from "./VideoScrubStage";

const setP = (el: HTMLElement | null, v: number) => {
  if (el) el.style.setProperty("--p", v.toFixed(4));
};

/* ---------- click: 무공구 장착(스크롤) + 핸들리스 TIP-ON(클릭) ---------- */
function DoorClick() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const [open, setOpen] = useState(false);

  const onUpdate = useCallback((p: number) => {
    const s = stageRef.current;
    if (!s) return;
    setP(s, p);
    if (!mountedRef.current && p > 0.4) {
      mountedRef.current = true;
      s.classList.add("is-mounted");
    }
    if (mountedRef.current && p < 0.15) {
      mountedRef.current = false;
      s.classList.remove("is-mounted");
    }
  }, []);
  useScrub(stageRef, onUpdate, { start: "top 86%", end: "top 36%" });

  const toggle = () => {
    if (reduce) return;
    setOpen((o) => !o);
  };

  return (
    <div
      className={`demo__stage door-stage door-click${open ? " is-open" : ""}`}
      data-demo="door-click"
      ref={stageRef}
      onClick={toggle}
      style={reduce ? undefined : { cursor: "pointer" }}
    >
      <div className="door-cab" />
      <div className="door-hinge door-hinge--t" />
      <div className="door-hinge door-hinge--b" />
      <div className="door-clip">딸깍 · 무공구 장착</div>
      <div className="door-panel">
        <span className="door-tap">톡 — 눌러서 열기</span>
      </div>
      <div className="stage-meter">
        <span>CLIP</span>
        <span className="track">
          <i />
        </span>
        <span>TIP-ON</span>
      </div>
    </div>
  );
}

/* ---------- hotspots: 호버로 두 기능 탐색 ---------- */
function DoorHotspots() {
  return (
    <div className="demo__stage door-stage door-hotspots" data-demo="door-hotspots">
      <div className="door-cab" />
      <div className="door-panel" />
      <button type="button" className="door-spot door-spot--hinge" aria-label="무공구 힌지">
        <span className="door-spot__dot" />
        <span className="door-spot__tip">
          <b>무공구 CLIP</b>공구 없이 딸깍 장착 · 상하·좌우·깊이 3방향 조절
        </span>
      </button>
      <button
        type="button"
        className="door-spot door-spot--surface"
        aria-label="TIP-ON 표면"
      >
        <span className="door-spot__dot" />
        <span className="door-spot__tip">
          <b>TIP-ON 핸들리스</b>손잡이 없이 톡 누르면 열림 · 더 넓은 디자인 폭
        </span>
      </button>
    </div>
  );
}

/* =========================== [04] 도어 (무공구 + TIP-ON 통합) =========================== */
export function DoorByVariant({ variant }: { variant: string }) {
  return (
    <section
      className="section section--dark door"
      id="door"
      data-section="door"
      data-theme="dark"
      data-screen-label="04 도어"
    >
      <div className="inner door__inner">
        <span className="eyebrow reveal-up">
          <span className="num">04</span> / 신념 · 문의 완성
        </span>
        <h3 className="reveal-up d1">공구 없이 달고, 손잡이 없이 연다.</h3>
        <p className="lede reveal-up d1">
          무공구 클립으로 딸깍 장착, 톡 누르면 열리는 TIP-ON.{" "}
          <strong>시공도 디자인도 자유롭게.</strong>
        </p>
        <div className="chiprow reveal-up d2">
          <span className="chip chip--accent">CLIP top</span>
          <span className="chip">무공구</span>
          <span className="chip chip--accent">TIP-ON</span>
          <span className="chip">핸들리스</span>
        </div>
        <a className="microcta reveal-up d3" href="#showroom">
          전국 쇼룸에서 직접 열어보세요 <span className="arrow">→</span>
        </a>
        <div className="door__stagewrap reveal-up d1">
          {variant === "hotspots" ? (
            <DoorHotspots />
          ) : variant === "scrub" ? (
            <VideoScrubStage src="/videos/door.mp4" />
          ) : (
            <DoorClick />
          )}
        </div>
      </div>
    </section>
  );
}
