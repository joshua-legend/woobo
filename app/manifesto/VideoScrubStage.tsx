"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const setP = (el: HTMLElement | null, v: number) => {
  if (el) el.style.setProperty("--p", v.toFixed(4));
};

/**
 * 영상 스크럽 스테이지 — 좌우 호버(마우스)/드래그(터치)로 감기.
 * - 마우스 올리기 전에는 첫 프레임(초기 OPEN) 유지. 벗어나면 다시 초기로 사뿐히 복귀.
 * - 단일 rAF 루프 lerp 보간 + seek 코얼레싱(seeking 중 스킵)으로 최대한 스무스.
 * - 자동재생 차단(autoPlay=false + onPlay→pause). 프레임 없으면 .ph 폴백.
 * src 만 바꾸면 어느 섹션에서나 재사용(soft / door …).
 */
function SoftVideoScrub({ src }: { src: string }) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durRef = useRef(0);
  const readyRef = useRef(false);
  const targetRef = useRef(0); // 목표 진행도(0=OPEN, 1=CLOSE)
  const dispRef = useRef(0); // 화면에 보이는 보간된 진행도
  const runningRef = useRef(false);
  const activeRef = useRef(false); // 마우스 호버/터치 드래그 중
  const rafRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [showGuide, setShowGuide] = useState(true);

  // 단일 rAF 루프: disp 를 target 으로 부드럽게 수렴 + seek 코얼레싱
  const tick = useCallback(() => {
    const v = videoRef.current;
    if (!v || !readyRef.current || !durRef.current) {
      runningRef.current = false;
      return;
    }
    dispRef.current += (targetRef.current - dispRef.current) * 0.18;
    if (Math.abs(targetRef.current - dispRef.current) < 0.0004)
      dispRef.current = targetRef.current;
    setP(stageRef.current, dispRef.current);
    if (!v.seeking) {
      const t = dispRef.current * durRef.current;
      if (Math.abs(v.currentTime - t) > 0.01) {
        try {
          v.currentTime = t;
        } catch {
          /* seek 무시 */
        }
      }
    }
    const settled = dispRef.current === targetRef.current && !v.seeking;
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
        // 자동재생 차단 + 초기(OPEN) 상태로 고정
        v.pause();
        try {
          v.currentTime = 0;
        } catch {
          /* seek 무시 */
        }
        targetRef.current = 0;
        dispRef.current = 0;
        setP(stageRef.current, 0);
      }
    };
    const onErr = () => setStatus("missing");
    v.addEventListener("loadedmetadata", markReady);
    v.addEventListener("loadeddata", markReady);
    v.addEventListener("canplay", markReady);
    v.addEventListener("error", onErr);
    v.load();
    markReady();
    return () => {
      v.removeEventListener("loadedmetadata", markReady);
      v.removeEventListener("loadeddata", markReady);
      v.removeEventListener("canplay", markReady);
      v.removeEventListener("error", onErr);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const relX = (clientX: number) => {
    const s = stageRef.current;
    if (!s) return 0;
    const r = s.getBoundingClientRect();
    return clamp((clientX - r.left) / r.width, 0, 1);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || !readyRef.current) return;
    if (e.pointerType === "mouse") {
      activeRef.current = true;
      if (showGuide) setShowGuide(false);
      setTarget(relX(e.clientX));
    } else if (activeRef.current) {
      setTarget(relX(e.clientX));
    }
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (reduce || !readyRef.current || e.pointerType === "mouse") return;
    activeRef.current = true;
    setShowGuide(false);
    setTarget(relX(e.clientX));
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  // 손/마우스를 떼거나 벗어나면 초기(OPEN) 상태로 사뿐히 복귀
  const release = () => {
    if (!activeRef.current) return;
    activeRef.current = false;
    setShowGuide(true);
    setTarget(0);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    release();
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    release();
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
      {status === "ready" && !reduce && (
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
            좌우로 움직여보세요 — 터치·마우스
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

/* 모바일(터치)용 — 드래그-스크럽 대신 자동재생 루프. 터치 가로채기 없음 → 페이지 정상 스크롤. */
function SoftVideoLoop({ src }: { src: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="demo__stage demo-softvideo" data-demo="softvideo">
      <video
        className="softvideo__el"
        src={src}
        muted
        loop={!reduce}
        playsInline
        preload="auto"
        autoPlay={!reduce}
      />
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

/* 입력장치에 따라 분기: 터치/coarse = 자동재생 루프(스크롤 정상), 그 외 = 호버 스크럽. */
export function VideoScrubStage({ src }: { src: string }) {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }, []);
  return isTouch ? <SoftVideoLoop src={src} /> : <SoftVideoScrub src={src} />;
}
