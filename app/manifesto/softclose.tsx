"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrub } from "@/hooks/useScrub";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const setP = (el: HTMLElement | null, v: number) => {
  if (el) el.style.setProperty("--p", v.toFixed(4));
};
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2);

// 이미지 시퀀스 규격 — docs/section3-sequence-spec.md 와 1:1 (디자인팀 에셋 오면 여기만 수정)
const SEQ = { dir: "/images/soft/", prefix: "close-", count: 48, pad: 3, ext: "webp" };
const frameSrc = (i: number) =>
  `${SEQ.dir}${SEQ.prefix}${String(i + 1).padStart(SEQ.pad, "0")}.${SEQ.ext}`;

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

/* ---------- sequence (이미지 시퀀스 스크럽) — 실물 3D 렌더 프레임 교체용 ---------- */
function SoftStageSequence() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const readyRef = useRef(false);
  const curRef = useRef(0);
  const modeRef = useRef<"scrub" | "drag" | "closing">("scrub");
  const dragRef = useRef({ startX: 0, startF: 0 });
  const rafRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  const drawFrame = useCallback((idx: number) => {
    const c = canvasRef.current;
    const img = framesRef.current[idx];
    if (!c || !img || !img.complete || !img.naturalWidth) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const cw = c.width;
    const ch = c.height;
    const ir = img.naturalWidth / img.naturalHeight;
    let w = cw;
    let h = ch;
    if (ir > cw / ch) h = cw / ir;
    else w = ch * ir;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    curRef.current = idx;
    setP(stageRef.current, idx / (SEQ.count - 1)); // 미터 연동
  }, []);

  const sizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    const s = stageRef.current;
    if (!c || !s) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(s.clientWidth * dpr);
    c.height = Math.round(s.clientHeight * dpr);
    if (readyRef.current) drawFrame(curRef.current);
  }, [drawFrame]);

  useEffect(() => {
    let alive = true;
    let loaded = 0;
    let failed = false;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < SEQ.count; i++) {
      const img = new Image();
      img.onload = () => {
        if (!alive || failed) return;
        loaded += 1;
        if (loaded === SEQ.count) {
          readyRef.current = true;
          setStatus("ready");
          sizeCanvas();
          drawFrame(0);
        }
      };
      img.onerror = () => {
        if (!alive) return;
        failed = true;
        setStatus("missing");
      };
      img.src = frameSrc(i);
      imgs[i] = img;
    }
    framesRef.current = imgs;
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    const raf = rafRef;
    return () => {
      alive = false;
      window.removeEventListener("resize", sizeCanvas);
      cancelAnimationFrame(raf.current);
    };
  }, [drawFrame, sizeCanvas]);

  const onUpdate = useCallback(
    (p: number) => {
      if (modeRef.current !== "scrub" || !readyRef.current) return;
      drawFrame(Math.round(clamp(p, 0, 1) * (SEQ.count - 1)));
    },
    [drawFrame],
  );
  useScrub(stageRef, onUpdate, { start: "top 86%", end: "top 32%" });

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduce || !readyRef.current) return;
    modeRef.current = "drag";
    cancelAnimationFrame(rafRef.current);
    dragRef.current = { startX: e.clientX, startF: curRef.current };
    stageRef.current?.classList.add("is-grab");
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (modeRef.current !== "drag") return;
    const w = stageRef.current?.clientWidth || 400;
    const dx = e.clientX - dragRef.current.startX;
    // 왼쪽 드래그 = 닫힘(프레임 증가)
    drawFrame(
      clamp(
        Math.round(dragRef.current.startF - (dx / w) * (SEQ.count - 1)),
        0,
        SEQ.count - 1,
      ),
    );
  };
  const onPointerUp = () => {
    if (modeRef.current !== "drag") return;
    modeRef.current = "closing";
    stageRef.current?.classList.remove("is-grab");
    const from = curRef.current;
    const to = SEQ.count - 1;
    const dur = 760;
    let t0: number | null = null;
    const step = (t: number) => {
      if (t0 === null) t0 = t;
      const k = clamp((t - t0) / dur, 0, 1);
      drawFrame(Math.round(from + (to - from) * easeOut(k)));
      if (k < 1) rafRef.current = requestAnimationFrame(step);
      else modeRef.current = "scrub";
    };
    rafRef.current = requestAnimationFrame(step);
  };

  return (
    <div
      className="demo__stage demo-softseq"
      data-demo="softseq"
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={reduce ? undefined : { touchAction: "none" }}
    >
      <canvas ref={canvasRef} className="softseq__canvas" />
      {status !== "ready" && (
        <div
          className="softseq__ph ph"
          data-ph={
            status === "missing"
              ? "프레임 시퀀스 대기 — /images/soft/close-001~048.webp"
              : "시퀀스 로딩…"
          }
        />
      )}
      <div className="grabhint">
        {reduce ? "" : "스크롤·드래그 = 서랍 / 손 떼면 사뿐히"}
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

/* ---------- video (영상 스크럽) — mp4 1개를 스크롤로 감기 ---------- */
const VIDEO_SRC = "/videos/soft-close.mp4";

function SoftStageVideo() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durRef = useRef(0);
  const readyRef = useRef(false);
  const targetRef = useRef(0); // 원하는 진행도 0..1
  const dispRef = useRef(0); // 화면에 보이는(부드럽게 따라오는) 진행도
  const runningRef = useRef(false);
  const closeRef = useRef({ active: false, from: 0, t0: 0 });
  const modeRef = useRef<"scrub" | "drag" | "closing">("scrub");
  const dragRef = useRef({ startX: 0, startP: 0 });
  const rafRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [showGuide, setShowGuide] = useState(true);

  // 단일 rAF 루프: disp 를 target 으로 lerp 보간(부드럽게) + seek 코얼레싱(seeking 중엔 스킵)
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
    dispRef.current += (targetRef.current - dispRef.current) * 0.25;
    if (Math.abs(targetRef.current - dispRef.current) < 0.0006)
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
    const onSeeked = () => startLoop(); // seek 끝나면 루프가 밀린 위치 이어서 적용
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

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduce || !readyRef.current) return;
    modeRef.current = "drag";
    closeRef.current.active = false;
    setShowGuide(false);
    dragRef.current = { startX: e.clientX, startP: targetRef.current };
    stageRef.current?.classList.add("is-grab");
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (modeRef.current !== "drag") return;
    const w = stageRef.current?.clientWidth || 400;
    const dx = e.clientX - dragRef.current.startX;
    setTarget(dragRef.current.startP - dx / w);
  };
  const onPointerUp = () => {
    if (modeRef.current !== "drag") return;
    stageRef.current?.classList.remove("is-grab");
    modeRef.current = "closing";
    closeRef.current = {
      active: true,
      from: targetRef.current,
      t0: performance.now(),
    };
    startLoop();
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
      style={reduce ? undefined : { touchAction: "none" }}
    >
      <video
        ref={videoRef}
        className="softvideo__el"
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        autoPlay={false}
        onPlay={(e) => e.currentTarget.pause()}
      />
      {status !== "ready" && (
        <div
          className="softseq__ph ph"
          data-ph={
            status === "missing"
              ? "영상 대기 — /public/videos/soft-close.mp4"
              : "영상 로딩…"
          }
        />
      )}
      {status === "ready" && (
        <div
          className={`softvideo__guide${showGuide ? "" : " is-hidden"}`}
          aria-hidden="true"
        >
          <span className="softvideo__guide-arrows">↔</span>
          좌우로 드래그 · 스크롤
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
            ) : variant === "sequence" ? (
              <SoftStageSequence />
            ) : variant === "video" ? (
              <SoftStageVideo />
            ) : (
              <SoftStageScrub />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
