"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/* ---------- tap: 누르면 자동 개방, 다시 누르면 역재생 닫힘(TIP-ON) ---------- */
function DoorTapPlay({ src }: { src: string }) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const durRef = useRef(0);
  const readyRef = useRef(false);
  const dispRef = useRef(0); // 0=닫힘 .. 1=열림
  const targetRef = useRef(0);
  const runningRef = useRef(false);
  const lastTsRef = useRef(0);
  const rafRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [interacted, setInteracted] = useState(false);

  const SPEED = 1.8; // 클립 대비 배속(클수록 빠름)

  const tick = useCallback((ts: number) => {
    const v = videoRef.current;
    if (!v || !readyRef.current || !durRef.current) {
      runningRef.current = false;
      return;
    }
    const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0;
    lastTsRef.current = ts;
    const step = (dt * SPEED) / durRef.current;
    if (targetRef.current > dispRef.current)
      dispRef.current = Math.min(targetRef.current, dispRef.current + step);
    else dispRef.current = Math.max(targetRef.current, dispRef.current - step);
    if (!v.seeking) {
      const t = dispRef.current * durRef.current;
      if (Math.abs(v.currentTime - t) > 0.012) {
        try {
          v.currentTime = t;
        } catch {
          /* seek 무시 */
        }
      }
    }
    if (dispRef.current === targetRef.current && !v.seeking) {
      runningRef.current = false;
      lastTsRef.current = 0;
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => {
      if (readyRef.current) return;
      if (isFinite(v.duration) && v.duration > 0) {
        durRef.current = v.duration;
        readyRef.current = true;
        setStatus("ready");
        v.pause();
        // reduced-motion: 최종(열림) 정지 · 기본: 첫 프레임(닫힘) 대기
        dispRef.current = reduce ? 1 : 0;
        targetRef.current = dispRef.current;
        try {
          v.currentTime = reduce ? v.duration : 0;
        } catch {
          /* seek 무시 */
        }
      }
    };
    const onSeeked = () => {
      if (runningRef.current) start();
    };
    const onErr = () => setStatus("missing");
    v.addEventListener("loadedmetadata", onReady);
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("error", onErr);
    v.load();
    return () => {
      v.removeEventListener("loadedmetadata", onReady);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("error", onErr);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduce, start]);

  // 탭 = 열림↔닫힘 토글(닫힘은 역재생). 진행 중 탭하면 즉시 반대로.
  const toggle = () => {
    if (reduce || !readyRef.current) return;
    setInteracted(true);
    targetRef.current = targetRef.current > 0.5 ? 0 : 1;
    start();
  };

  return (
    <div
      className="demo__stage door-tapstage"
      data-demo="door-tap"
      onClick={toggle}
      style={reduce ? undefined : { cursor: "pointer" }}
    >
      <video
        ref={videoRef}
        className="softvideo__el"
        src={src}
        muted
        playsInline
        preload="auto"
        autoPlay={false}
      />
      {status !== "ready" && (
        <div
          className="softseq__ph ph"
          data-ph={status === "missing" ? `영상 대기 — ${src}` : "영상 로딩…"}
        />
      )}
      {status === "ready" && !interacted && !reduce && (
        <div className="door-tap-cue" aria-hidden="true">
          <span className="door-tap-cue__dot" />톡 — 눌러서 열기
        </div>
      )}
    </div>
  );
}

/* =========================== [04] 도어 (무공구 + TIP-ON 통합) =========================== */
export function DoorByVariant({ variant }: { variant: string }) {
  return (
    <section
      className="section section--dark demo door flip"
      id="door"
      data-section="door"
      data-theme="dark"
      data-screen-label="04 도어"
    >
      <div className="inner">
        <div className="grid">
          <div className="demo__copy">
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
          </div>
          <div className="reveal-up d1">
            <div className="door__stagewrap">
              {variant === "hotspots" ? (
                <DoorHotspots />
              ) : variant === "scrub" ? (
                <>
                  <VideoScrubStage src="/videos/door.mp4" />
                  <p className="door__phnote">
                    ※ AI 가안 영상 — 출시 전 Blum 공식 영상으로 교체 [TODO]
                  </p>
                </>
              ) : variant === "tap" ? (
                <>
                  <DoorTapPlay src="/videos/door.mp4" />
                  <p className="door__phnote">
                    ※ AI 가안 영상 — 출시 전 Blum 공식 영상으로 교체 [TODO]
                  </p>
                </>
              ) : (
                <DoorClick />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
