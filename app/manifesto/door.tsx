"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
export function DoorByVariant({ variant: _variant }: { variant: string }) {
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
            <a className="microcta reveal-up d3" href="#showroom">
              전국 쇼룸에서 직접 열어보세요 <span className="arrow">→</span>
            </a>
          </div>
          <div className="reveal-up d1">
            <div className="door__stagewrap">
              <DoorTapPlay src="/videos/door.mp4" />
              <p className="door__phnote">
                ※ AI 가안 영상 — 출시 전 Blum 공식 영상으로 교체 [TODO]
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
