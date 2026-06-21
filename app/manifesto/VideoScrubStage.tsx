"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const setP = (el: HTMLElement | null, v: number) => {
  if (el) el.style.setProperty("--p", v.toFixed(4));
};

const PAD = 4; // frame_0001.webp

/**
 * 프레임 시퀀스 스크럽 스테이지 — 좌우 호버(마우스)/드래그(터치)로 감기.
 * - mp4 seek 대신 미리 받은 webp 프레임을 canvas에 그려, 모바일에서도 끊김 없이 양방향 스크럽.
 * - 단일 rAF 루프 lerp 보간. 진행도(0=OPEN, 1=CLOSE)를 프레임 인덱스로 매핑.
 * - 터치: touch-action:pan-y 로 세로 페이지 스크롤은 양보, 가로 드래그만 스크럽.
 * - reduced-motion: 첫 프레임 1장만 정적 표시.
 * frames(번호 앞 prefix) + count 만 바꾸면 어느 섹션에서나 재사용.
 */
export function VideoScrubStage({
  frames,
  count,
  ext = "webp",
  leftLabel = "OPEN",
  rightLabel = "SOFT CLOSE",
}: {
  /** 0패딩 번호 앞까지의 URL prefix. 예: "/videos/soft-close-frames/frame_" */
  frames: string;
  count: number;
  ext?: string;
  /** 진행도 미터 좌/우 라벨(좌=진행0, 우=진행1) */
  leftLabel?: string;
  rightLabel?: string;
}) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgsRef = useRef<HTMLImageElement[]>([]);
  const readyRef = useRef(false);
  const targetRef = useRef(0); // 목표 진행도(0=OPEN, 1=CLOSE)
  const dispRef = useRef(0); // 화면에 보이는 보간된 진행도
  const lastIdxRef = useRef(-1); // 마지막으로 그린 프레임(중복 draw 방지)
  const runningRef = useRef(false);
  const activeRef = useRef(false); // 마우스 호버/터치 드래그 중
  const rafRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [showGuide, setShowGuide] = useState(true);

  const url = useCallback(
    (n: number) => `${frames}${String(n).padStart(PAD, "0")}.${ext}`,
    [frames, ext],
  );

  // canvas 백킹스토어를 표시 박스(×DPR)에 맞춤
  const sizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    const s = stageRef.current;
    if (!c || !s) return;
    const r = s.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(r.width * dpr);
    const h = Math.round(r.height * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
      lastIdxRef.current = -1; // 사이즈 바뀌면 재그림 강제
    }
  }, []);

  // object-fit: cover 로 프레임 그리기
  const drawIdx = useCallback((idx: number) => {
    const c = canvasRef.current;
    const img = imgsRef.current[idx];
    if (!c || !img || !img.complete || !img.naturalWidth) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const cw = c.width;
    const ch = c.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    lastIdxRef.current = idx;
  }, []);

  // 단일 rAF 루프: disp 를 target 으로 부드럽게 수렴 + 인덱스 바뀔 때만 draw
  const tick = useCallback(() => {
    if (!readyRef.current) {
      runningRef.current = false;
      return;
    }
    dispRef.current += (targetRef.current - dispRef.current) * 0.18;
    if (Math.abs(targetRef.current - dispRef.current) < 0.0004)
      dispRef.current = targetRef.current;
    setP(stageRef.current, dispRef.current);
    const idx = clamp(Math.round(dispRef.current * (count - 1)), 0, count - 1);
    if (idx !== lastIdxRef.current) drawIdx(idx);
    if (dispRef.current === targetRef.current) runningRef.current = false;
    else rafRef.current = requestAnimationFrame(tick);
  }, [count, drawIdx]);

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

  // 프리로드: 모든 프레임을 Image 로 받아둠(reduced-motion 은 첫 1장만)
  useEffect(() => {
    let cancelled = false;
    const n = reduce ? 1 : count;
    const imgs: HTMLImageElement[] = new Array(count);
    let loaded = 0;
    const onOne = () => {
      if (cancelled) return;
      loaded++;
      if (lastIdxRef.current < 0) {
        sizeCanvas();
        drawIdx(0); // 첫 장 들어오면 즉시 표시(빈 화면 방지)
      }
      if (loaded >= n) {
        readyRef.current = true;
        setStatus("ready");
      }
    };
    for (let i = 0; i < n; i++) {
      const im = new Image();
      im.decoding = "async";
      im.onload = onOne;
      im.onerror = () => {
        if (!cancelled) setStatus("missing");
      };
      im.src = url(i + 1);
      imgs[i] = im;
    }
    imgsRef.current = imgs;
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [count, reduce, url, sizeCanvas, drawIdx]);

  // 리사이즈 → canvas 재사이즈 + 현재 프레임 재그림
  useEffect(() => {
    const s = stageRef.current;
    if (!s) return;
    const ro = new ResizeObserver(() => {
      const idx = lastIdxRef.current < 0 ? 0 : lastIdxRef.current;
      sizeCanvas();
      drawIdx(idx);
    });
    ro.observe(s);
    return () => ro.disconnect();
  }, [sizeCanvas, drawIdx]);

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
  // 손/마우스를 떼거나 벗어나면(또는 세로 스크롤에 제스처를 뺏기면) 초기(OPEN)로 사뿐히 복귀
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
    >
      <canvas ref={canvasRef} className="softvideo__el" />
      {status !== "ready" && (
        <div
          className="softseq__ph ph"
          data-ph={
            status === "missing" ? `프레임 대기 — ${frames}` : "프레임 로딩…"
          }
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
        <span>{leftLabel}</span>
        <span className="track">
          <i />
        </span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
