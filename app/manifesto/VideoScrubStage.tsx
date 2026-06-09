"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrub } from "@/hooks/useScrub";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const setP = (el: HTMLElement | null, v: number) => {
  if (el) el.style.setProperty("--p", v.toFixed(4));
};
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2);

/**
 * 영상 스크럽 스테이지 — mp4 를 스크롤/마우스 호버로 감기.
 * - 마우스: 호버로 조작(클릭 불필요), 벗어나면 사뿐히 끝까지. 터치: 손가락 드래그.
 * - 단일 rAF 루프 lerp 보간 + seek 코얼레싱(seeking 중 스킵, seeked 에 재개).
 * - 자동재생 차단(autoPlay=false + onPlay→pause). 프레임 없으면 .ph 폴백.
 * src 만 바꾸면 어느 섹션에서나 재사용(soft / door …).
 */
export function VideoScrubStage({ src }: { src: string }) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durRef = useRef(0);
  const readyRef = useRef(false);
  const targetRef = useRef(0);
  const dispRef = useRef(0);
  const runningRef = useRef(false);
  const closeRef = useRef({ active: false, from: 0, t0: 0 });
  const modeRef = useRef<"scrub" | "drag" | "hover" | "closing">("scrub");
  const dragTouchRef = useRef(false);
  const rafRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [showGuide, setShowGuide] = useState(true);

  const tick = useCallback((now: number) => {
    const v = videoRef.current;
    if (!v || !readyRef.current || !durRef.current) {
      runningRef.current = false;
      return;
    }
    if (closeRef.current.active) {
      const k = clamp((now - closeRef.current.t0) / 760, 0, 1);
      targetRef.current =
        closeRef.current.from + (1 - closeRef.current.from) * easeOut(k);
      if (k >= 1) {
        closeRef.current.active = false;
        modeRef.current = "scrub";
      }
    }
    dispRef.current += (targetRef.current - dispRef.current) * 0.14;
    if (Math.abs(targetRef.current - dispRef.current) < 0.0004)
      dispRef.current = targetRef.current;
    setP(stageRef.current, dispRef.current);
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
    const settled =
      !closeRef.current.active &&
      dispRef.current === targetRef.current &&
      !v.seeking;
    if (settled) runningRef.current = false;
    else rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const setTarget = useCallback(
    (p: number) => {
      targetRef.current = clamp(p, 0, 1);
      startLoop();
    },
    [startLoop],
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const markReady = () => {
      if (readyRef.current) return;
      if (v.readyState >= 1 && isFinite(v.duration) && v.duration > 0) {
        durRef.current = v.duration;
        readyRef.current = true;
        setStatus("ready");
        v.pause();
        startLoop();
      }
    };
    const onSeeked = () => startLoop();
    const onErr = () => setStatus("missing");
    v.addEventListener("loadedmetadata", markReady);
    v.addEventListener("loadeddata", markReady);
    v.addEventListener("canplay", markReady);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("error", onErr);
    v.load();
    markReady();
    return () => {
      v.removeEventListener("loadedmetadata", markReady);
      v.removeEventListener("loadeddata", markReady);
      v.removeEventListener("canplay", markReady);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("error", onErr);
      cancelAnimationFrame(rafRef.current);
    };
  }, [startLoop]);

  const onUpdate = useCallback(
    (p: number) => {
      if (modeRef.current !== "scrub") return;
      if (p > 0.02) setShowGuide(false);
      setTarget(p);
    },
    [setTarget],
  );
  useScrub(stageRef, onUpdate, { start: "top 86%", end: "top 32%" });

  const relX = (clientX: number) => {
    const s = stageRef.current;
    if (!s) return 0;
    const r = s.getBoundingClientRect();
    return clamp((clientX - r.left) / r.width, 0, 1);
  };
  const startClose = () => {
    closeRef.current.active = false;
    modeRef.current = "closing";
    closeRef.current = {
      active: true,
      from: targetRef.current,
      t0: performance.now(),
    };
    startLoop();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || !readyRef.current) return;
    if (e.pointerType === "mouse") {
      modeRef.current = "hover";
      setShowGuide(false);
      setTarget(relX(e.clientX));
    } else if (dragTouchRef.current) {
      setShowGuide(false);
      setTarget(relX(e.clientX));
    }
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (reduce || !readyRef.current || e.pointerType === "mouse") return;
    dragTouchRef.current = true;
    modeRef.current = "drag";
    closeRef.current.active = false;
    setShowGuide(false);
    setTarget(relX(e.clientX));
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" && dragTouchRef.current) {
      dragTouchRef.current = false;
      startClose();
      setShowGuide(true);
    }
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (modeRef.current === "hover") startClose();
    setShowGuide(true);
  };

  return (
    <div
      className="demo__stage demo-softvideo"
      data-demo="softvideo"
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerLeave}
      style={reduce ? undefined : { touchAction: "none" }}
    >
      <video
        ref={videoRef}
        className="softvideo__el"
        src={src}
        muted
        playsInline
        preload="auto"
        autoPlay={false}
        onPlay={(e) => e.currentTarget.pause()}
      />
      {status !== "ready" && (
        <div
          className="softseq__ph ph"
          data-ph={status === "missing" ? `영상 대기 — ${src}` : "영상 로딩…"}
        />
      )}
      {status === "ready" && (
        <div
          className={`softvideo__guide${showGuide ? "" : " is-hidden"}`}
          aria-hidden="true"
        >
          <div className="softvideo__guide-box">
            <span className="softvideo__hand">
              <svg viewBox="0 0 48 48">
                <path
                  className="sg-arrow"
                  d="M9 17 H39 M12 14 L9 17 L12 20 M36 14 L39 17 L36 20"
                />
                <path
                  className="sg-hand"
                  d="M21 32 V19 a2.4 2.4 0 0 1 4.8 0 V26 a2.4 2.4 0 0 1 4.8 0 V28 a2.4 2.4 0 0 1 4.8 0 V32 c0 5 -3.4 8.6 -8.6 8.6 h-2.4 c-2.9 0 -4.7 -1.4 -6.1 -4.3 l-3.2 -5.6 a2.5 2.5 0 0 1 4.3 -2.6 l2.4 3.4 Z"
                />
              </svg>
            </span>
            마우스를 올려 좌우로 움직여보세요
          </div>
        </div>
      )}
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
