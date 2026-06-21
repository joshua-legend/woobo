# 섹션5 횡스크롤 대격변 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** manifesto 가안 섹션5(`trust.tsx`)를 핀 고정 횡스크롤 시네마틱 3막(ACT1 오리진 카드 던지기 → ACT2 sole agent 6 풀블리드+노드레일 → ACT3 고객 마무리)으로 전면 교체한다.

**Architecture:** 한 섹션을 길게(약 480svh) 만들어 CSS sticky 트랙으로 핀 고정하고, 기존 `useScrub`(GSAP ScrollTrigger 진행도 0→1)로 진행도 `p`를 읽는다. `p`를 8패널 필름스트립의 연속 위치 `scenePos`(0~7)로 매핑해 트랙을 `translateX`로 가로 이동시킨다. 프레임마다 React 상태를 갱신하지 않고, `onUpdate`에서 **CSS 커스텀 프로퍼티**(`--scene`, `--c1/2/3`, `--sa`, `--a3`)를 ref에 set하여 CSS가 트랜스폼을 구동한다(기존 `identities.tsx`의 `--story-local` 패턴과 동일). ACT2 현재 인덱스만 값이 바뀔 때 `setState`.

**Tech Stack:** Next.js 16 (App Router, RSC + "use client"), React 19, GSAP ScrollTrigger(`@/lib/gsap`), 기존 `hooks/useScrub.ts`, Tailwind v4 + 라우트 스코프 CSS(`app/manifesto/manifesto.css`).

**검증 방식(이 repo 특성):** 단위 테스트 프레임워크 없음. 각 태스크 검증 = ① `npx tsc --noEmit` 타입 에러 0 ② dev 서버(`npm run dev`, 보통 http://localhost:3001/manifesto)에서 육안 확인 ③ commit. dev 서버는 이미 떠 있다고 가정(아니면 `npm run dev`).

---

## File Structure

- **Modify (rewrite):** `app/manifesto/trust.tsx` — 섹션5 컴포넌트 전면 재작성. 한 파일에 데이터(`FACETS` 유지 + `ORIGINS` 신규) + 메인 `Section5Scroll` + 서브컴포넌트(`Act1Stack`, `SoleAgentPanels`, `NodeRail`, `Act3Closing`). 기존 컨벤션(섹션=단일 파일, 예 `identities.tsx`) 따름.
- **Modify (append):** `app/manifesto/manifesto.css` — 섹션5 전용 스타일 블록(`.route-manifesto .s5-*`). 기존 `.trust`/`.tf-*` 구 스타일은 Task 6에서 제거.
- **Modify:** `image-manifest.md` — 이미지 슬롯 등록(Task 5).
- **유지:** `hooks/useScrub.ts`(그대로 사용), `components/layout/SmoothScrollProvider.tsx`(불변).
- **안 건드림:** 다른 섹션 파일, door/softclose/identities 등.

진행도 매핑(전 태스크 공통 상수):
```
ACT1 dwell: p ∈ [0, 0.12] → scenePos = 0 (카드 던지기, local = p/0.12)
sweep:      p ∈ [0.12, 1] → scenePos = lerp(0, 7, (p-0.12)/0.88)
패널 index: 0=ACT1, 1..6=sole-agent 1..6, 7=ACT3
ACT2 item index = clamp(round(scenePos) - 1, 0, 5)  // scenePos 1..6 구간
ACT3 local = clamp((scenePos - 6.2) / 0.8, 0, 1)
```

---

## Task 1: 횡스크롤 엔진 + 8패널 스켈레톤

섹션을 핀 고정하고 8개 빈 패널이 가로로 흐르는 골격을 만든다. (각 막 내용은 이후 태스크)

**Files:**
- Modify (rewrite): `app/manifesto/trust.tsx`
- Modify (append): `app/manifesto/manifesto.css`

- [ ] **Step 1: `trust.tsx` 전면 교체 — 엔진 + 스켈레톤**

`app/manifesto/trust.tsx` 전체를 아래로 교체:

```tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { useScrub } from "@/hooks/useScrub";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const setVar = (el: HTMLElement | null, k: string, v: string) => {
  if (el) el.style.setProperty(k, v);
};

/* 진행도 매핑 상수 */
const A1_DWELL = 0.12; // ACT1 카드 던지기 구간
const PANELS = 8; // 0=ACT1, 1..6=sole-agent, 7=ACT3
const LAST = PANELS - 1;

/* 오리진(ACT1) — 던지는 순서 = 쌓이는 순서, Blum 맨 위·강조 */
const ORIGINS = [
  { name: "AGOFORM", country: "독일", flag: "🇩🇪", img: "agoform", rot: "-11deg" },
  { name: "Peka", country: "스위스", flag: "🇨🇭", img: "peka", rot: "6deg" },
  { name: "Blum", country: "오스트리아", flag: "🇦🇹", img: "blum", rot: "-4deg", flagship: true },
];

/* sole agent 6가지(ACT2) — 기존 콘텐츠 유지 */
const FACETS = [
  { t: "Blum 한국 독점 에이전트", d: "정품의 공식 통로 · sole agent", img: "sole-agent-01" },
  { t: "정품 보장 (유사품 차단)", d: "A/S · 부품 통로 확보", img: "sole-agent-02" },
  { t: "프리미엄 멀티브랜드 수입", d: "유럽 하드웨어 · 소재 전문", img: "sole-agent-03" },
  { t: "가구 하드웨어 전문성", d: "제작 현장을 아는 상담", img: "sole-agent-04" },
  { t: "전국 쇼룸 직접 체험", d: "실물 확인 · 방문 예약제", img: "sole-agent-05" },
  { t: "자체 가구 생산 (김포 본점)", d: "하드웨어부터 완제품까지", img: "sole-agent-06" },
];

function Section5Scroll() {
  const secRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const onUpdate = useCallback((p: number) => {
    const track = trackRef.current;
    const sec = secRef.current;
    // p → scenePos (0..7): ACT1 dwell 후 선형 sweep
    const scene =
      p <= A1_DWELL ? 0 : ((p - A1_DWELL) / (1 - A1_DWELL)) * LAST;
    setVar(track, "--scene", scene.toFixed(4));

    // ACT1 카드 로컬 진행 → 카드별 --c1/--c2/--c3
    const a1 = p <= A1_DWELL ? p / A1_DWELL : 1;
    for (let i = 0; i < ORIGINS.length; i++) {
      const ci = clamp(a1 * ORIGINS.length - i, 0, 1);
      setVar(sec, `--c${i + 1}`, ci.toFixed(4));
    }

    // ACT2 sole-agent 진행(0..6) → 레일 게이지 --sa, 현재 인덱스
    const sa = clamp(scene - 1, 0, 6);
    setVar(sec, "--sa", sa.toFixed(4));

    // ACT3 마무리 reveal
    const a3 = clamp((scene - 6.2) / 0.8, 0, 1);
    setVar(sec, "--a3", a3.toFixed(4));

    const idx = clamp(Math.round(scene) - 1, 0, 5);
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, []);

  useScrub(secRef, onUpdate, { start: "top top", end: "bottom bottom" });

  return (
    <section
      className="section s5"
      data-section="trust"
      data-theme="dark"
      data-screen-label="05 약속"
      ref={secRef}
    >
      <div className="s5__sticky">
        <div className="s5__track" ref={trackRef}>
          {/* ACT1 */}
          <div className="s5-panel s5-act1">
            <span className="s5-label">유럽 제조 · 원산지</span>
          </div>
          {/* ACT2 — sole agent 6 */}
          {FACETS.map((f, i) => (
            <div className="s5-panel s5-sa" key={f.t}>
              <span className="s5-label">{String(i + 1).padStart(2, "0")} / 06</span>
            </div>
          ))}
          {/* ACT3 */}
          <div className="s5-panel s5-act3">
            <span className="s5-label">고객에게</span>
          </div>
        </div>
        {/* 노드 레일(고정 오버레이) — Task 3에서 채움 */}
        <div className="s5-rail" aria-hidden="true" data-active={active} />
      </div>
    </section>
  );
}

/* =========================== [05] 약속 (Trust · 횡스크롤) =========================== */
export function TrustByVariant({ variant: _variant }: { variant: string }) {
  return <Section5Scroll />;
}
```

- [ ] **Step 2: `manifesto.css`에 섹션5 스켈레톤 스타일 append**

`app/manifesto/manifesto.css` 맨 끝에 추가:

```css
/* ========================= [05] 섹션5 횡스크롤 ========================= */
.route-manifesto .s5 {
  position: relative;
  height: 480svh;            /* 가로 이동량 — 실측 튜닝 */
  background: var(--c-charcoal-card);
}
.route-manifesto .s5__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
}
.route-manifesto .s5__track {
  display: flex;
  height: 100%;
  width: 800vw;             /* 8패널 × 100vw */
  will-change: transform;
  transform: translateX(calc(var(--scene, 0) * -100vw));
}
.route-manifesto .s5-panel {
  position: relative;
  flex: 0 0 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.route-manifesto .s5-label {
  position: absolute;
  top: 18px;
  left: 18px;
  font: 600 11px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-orange);
}
.route-manifesto .s5-act1 { background: var(--c-charcoal); }
.route-manifesto .s5-act3 { background: #0d0c09; }
```

- [ ] **Step 3: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 0 (특히 `trust.tsx`).

- [ ] **Step 4: 육안 확인**

dev 서버에서 `/manifesto` 열고 섹션5까지 스크롤. 기대: 섹션이 핀 고정된 채, 세로 스크롤하면 8개 빈 패널(ACT1 검정 → 6개 → ACT3)이 **가로로** 흐른다. 라벨이 좌상단에 보인다. (내용은 아직 비어 있음)

- [ ] **Step 5: 커밋**

```bash
git add app/manifesto/trust.tsx app/manifesto/manifesto.css
git commit -m "feat(5): 섹션5 횡스크롤 엔진 + 8패널 스켈레톤"
```

---

## Task 2: ACT1 — 오리진 카드 던지기·적재(트럼프 더미)

검은 화면에서 카드 3장이 위에서 하나씩 던져져 회전하며 한 더미로 쌓인다.

**Files:**
- Modify: `app/manifesto/trust.tsx` (ACT1 패널 마크업 + `Act1Stack` 서브컴포넌트)
- Modify (append): `app/manifesto/manifesto.css`

- [ ] **Step 1: `trust.tsx`에 `Act1Stack` 추가 + ACT1 패널 교체**

`Section5Scroll` 위에 서브컴포넌트 추가:

```tsx
function Act1Stack() {
  return (
    <div className="s5-deck">
      {ORIGINS.map((o, i) => (
        <div
          key={o.name}
          className={`s5-deckcard${o.flagship ? " is-flag" : ""}`}
          style={
            {
              "--ci": `var(--c${i + 1})`,
              "--rot": o.rot,
              zIndex: i + 1,
            } as React.CSSProperties
          }
        >
          <div className="s5-deckcard__img" data-ph={o.img} />
          <div className="s5-deckcard__meta">
            <b>{o.name}</b>
            <span>
              {o.flag} {o.country}
              {o.flagship ? " · 간판" : ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

`Section5Scroll`의 ACT1 패널을 교체:

```tsx
          {/* ACT1 */}
          <div className="s5-panel s5-act1">
            <span className="s5-label">유럽 제조 · 원산지</span>
            <Act1Stack />
          </div>
```

- [ ] **Step 2: `manifesto.css`에 ACT1 카드 스타일 append**

```css
/* ACT1 카드 더미 */
.route-manifesto .s5-deck {
  position: relative;
  width: min(78vw, 360px);
  height: 300px;
}
.route-manifesto .s5-deckcard {
  position: absolute;
  left: 50%;
  top: 38%;
  width: 240px;
  height: 150px;
  margin-left: -120px;
  border-radius: 14px;
  background: var(--c-paper);
  border: 1px solid var(--c-line);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* 던지기: --ci 0→1 동안 위(-130%)→제자리 + 회전 0→--rot, 투명→불투명 */
  opacity: var(--ci, 0);
  transform: translateY(calc(-130% * (1 - var(--ci, 0))))
    rotate(calc(var(--rot) * var(--ci, 0)));
  transition: none;
}
.route-manifesto .s5-deckcard.is-flag {
  border-color: var(--c-orange);
}
.route-manifesto .s5-deckcard__img {
  flex: 1;
  border-radius: 8px;
  background: repeating-linear-gradient(
    45deg,
    #ece7dd 0 10px,
    #e3ddd1 10px 20px
  );
}
.route-manifesto .s5-deckcard__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-family: var(--font-mono);
}
.route-manifesto .s5-deckcard__meta b {
  font: 700 14px/1 var(--font-sans);
  color: var(--c-ink);
}
.route-manifesto .s5-deckcard__meta span {
  font-size: 10px;
  color: var(--c-caption);
}
```

- [ ] **Step 3: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 0.

- [ ] **Step 4: 육안 확인**

`/manifesto` 섹션5 진입부에서 천천히 스크롤. 기대: 검은 화면에서 AGOFORM → Peka → Blum(간판, 주황 테두리, 맨 위) 순으로 카드가 위에서 떨어지며 각기 다른 각도로 회전해 한 더미로 쌓인다. 스크롤 되감으면 역으로 풀린다.

- [ ] **Step 5: 커밋**

```bash
git add app/manifesto/trust.tsx app/manifesto/manifesto.css
git commit -m "feat(5): ACT1 오리진 카드 던지기·트럼프 더미 적재"
```

---

## Task 3: ACT2 — sole agent 6 풀블리드 + 노드 레일

각 항목이 풀블리드 배경 이미지 슬롯 + 스크림 텍스트로, 가로로 한 개씩 통과. 하단 노드 레일이 누적 점등.

**Files:**
- Modify: `app/manifesto/trust.tsx` (ACT2 패널 마크업 + `NodeRail`)
- Modify (append): `app/manifesto/manifesto.css`

- [ ] **Step 1: `trust.tsx` — ACT2 패널 마크업 교체 + `NodeRail` 추가**

ACT2 매핑 부분 교체:

```tsx
          {/* ACT2 — sole agent 6 */}
          {FACETS.map((f, i) => (
            <div className="s5-panel s5-sa" key={f.t}>
              <div className="s5-sa__bg" data-ph={f.img} />
              <div className="s5-sa__scrim" />
              <div className="s5-sa__txt">
                <span className="s5-sa__no">
                  {String(i + 1).padStart(2, "0")} / 06
                </span>
                <h3 className="s5-sa__ttl">{f.t}</h3>
                <p className="s5-sa__ds">{f.d}</p>
              </div>
            </div>
          ))}
```

`NodeRail` 서브컴포넌트 추가:

```tsx
function NodeRail({ active }: { active: number }) {
  return (
    <div className="s5-rail" aria-hidden="true">
      <span className="s5-rail__track">
        <i className="s5-rail__fill" />
      </span>
      {FACETS.map((_f, i) => (
        <span
          key={i}
          className={`s5-rail__node${i <= active ? " is-lit" : ""}${i === active ? " is-cur" : ""}`}
        >
          {i + 1}
        </span>
      ))}
    </div>
  );
}
```

`Section5Scroll`의 기존 `<div className="s5-rail" .../>` placeholder를 교체:

```tsx
        <NodeRail active={active} />
```

- [ ] **Step 2: `manifesto.css` — ACT2 + 레일 스타일 append**

```css
/* ACT2 sole agent 풀블리드 */
.route-manifesto .s5-sa__bg {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    #23211b 0 14px,
    #1b1915 14px 28px
  );
}
.route-manifesto .s5-sa__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(8, 9, 7, 0.86) 0%,
    rgba(8, 9, 7, 0.15) 50%,
    rgba(8, 9, 7, 0.4) 100%
  );
}
.route-manifesto .s5-sa__txt {
  position: absolute;
  left: clamp(22px, 6vw, 80px);
  right: clamp(22px, 6vw, 80px);
  bottom: clamp(96px, 16vh, 150px);
  color: var(--c-paper);
}
.route-manifesto .s5-sa__no {
  font: 700 12px/1 var(--font-mono);
  letter-spacing: 0.1em;
  color: var(--c-orange);
}
.route-manifesto .s5-sa__ttl {
  font: 700 clamp(26px, 5vw, 52px) / 1.12 var(--font-sans);
  margin: 10px 0 6px;
  word-break: keep-all;
}
.route-manifesto .s5-sa__ds {
  font: 500 clamp(13px, 1.6vw, 16px) / 1.4 var(--font-sans);
  color: #d9d3c7;
}
/* 노드 레일(고정 오버레이) */
.route-manifesto .s5-rail {
  position: absolute;
  left: clamp(22px, 6vw, 80px);
  right: clamp(22px, 6vw, 80px);
  bottom: clamp(48px, 9vh, 80px);
  display: flex;
  align-items: center;
  z-index: 5;
}
.route-manifesto .s5-rail__track {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.22);
}
.route-manifesto .s5-rail__fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: calc(var(--sa, 0) / 5 * 100%);
  background: var(--c-orange);
}
.route-manifesto .s5-rail__node {
  position: relative;
  z-index: 1;
  width: 26px;
  height: 26px;
  margin-right: auto;
  border-radius: 50%;
  background: #16140f;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.5);
  font: 700 10px/1 var(--font-mono);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s var(--ease), border-color 0.35s var(--ease),
    color 0.35s var(--ease), background 0.35s var(--ease);
}
.route-manifesto .s5-rail__node:last-child { margin-right: 0; }
.route-manifesto .s5-rail__node.is-lit {
  border-color: var(--c-orange);
  background: var(--c-orange);
  color: #fff;
}
.route-manifesto .s5-rail__node.is-cur { transform: scale(1.25); }
```

- [ ] **Step 3: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 0.

- [ ] **Step 4: 육안 확인**

`/manifesto` 섹션5에서 ACT1 이후 계속 스크롤. 기대: 6개 풀블리드 패널이 하나씩 가로로 들어오고, 각 패널 좌하단에 번호·제목·부제. 하단 노드 레일이 패널 넘어갈 때마다 점등 + 주황 게이지 누적, 현재 노드 확대.

- [ ] **Step 5: 커밋**

```bash
git add app/manifesto/trust.tsx app/manifesto/manifesto.css
git commit -m "feat(5): ACT2 sole agent 6 풀블리드 + 노드 레일"
```

---

## Task 4: ACT3 — 고객 마무리

마지막 패널에 마무리 카피 + 쇼룸 CTA, 진입 시 reveal.

**Files:**
- Modify: `app/manifesto/trust.tsx` (ACT3 패널 + `Act3Closing`)
- Modify (append): `app/manifesto/manifesto.css`

- [ ] **Step 1: `trust.tsx` — `Act3Closing` 추가 + ACT3 패널 교체**

```tsx
function Act3Closing() {
  return (
    <div className="s5-closing">
      <p className="s5-closing__eyebrow">한국 독점 에이전트 · sole agent</p>
      <h2 className="s5-closing__head">당신의 공간에 정품의 기준을.</h2>
      <p className="s5-closing__sub">Blum 한국 독점 에이전트, 우보브랜드샵.</p>
      <a className="s5-closing__cta" href="#showroom">
        전국 쇼룸 방문 예약 <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
```

ACT3 패널 교체:

```tsx
          {/* ACT3 */}
          <div className="s5-panel s5-act3">
            <span className="s5-label">고객에게</span>
            <Act3Closing />
          </div>
```

- [ ] **Step 2: `manifesto.css` — ACT3 스타일 append**

```css
/* ACT3 마무리 */
.route-manifesto .s5-closing {
  max-width: 640px;
  padding: 0 24px;
  text-align: center;
  color: var(--c-paper);
  /* --a3 0→1 동안 아래→제자리 + 페이드 */
  opacity: var(--a3, 0);
  transform: translateY(calc(28px * (1 - var(--a3, 0))));
}
.route-manifesto .s5-closing__eyebrow {
  font: 700 12px/1 var(--font-mono);
  letter-spacing: 0.1em;
  color: var(--c-orange);
  margin-bottom: 18px;
}
.route-manifesto .s5-closing__head {
  font: 700 clamp(30px, 6vw, 64px) / 1.12 var(--font-sans);
  word-break: keep-all;
  margin: 0 0 16px;
}
.route-manifesto .s5-closing__sub {
  font: 500 clamp(14px, 2vw, 18px) / 1.5 var(--font-sans);
  color: #cfc8bb;
  margin: 0 0 32px;
}
.route-manifesto .s5-closing__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 26px;
  border-radius: 999px;
  background: var(--c-orange);
  color: #fff;
  font: 700 14px/1 var(--font-sans);
  text-decoration: none;
}
```

- [ ] **Step 3: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 0.

- [ ] **Step 4: 육안 확인**

섹션5 끝까지 스크롤. 기대: 마지막 패널에서 "당신의 공간에 정품의 기준을." 헤드라인 + 부제 + 주황 "전국 쇼룸 방문 예약 →" 버튼이 아래에서 떠오르며 나타난다. CTA 클릭 시 `#showroom`으로 이동.

- [ ] **Step 5: 커밋**

```bash
git add app/manifesto/trust.tsx app/manifesto/manifesto.css
git commit -m "feat(5): ACT3 고객 마무리 카피 + 쇼룸 CTA"
```

---

## Task 5: 이미지 슬롯 등록 (image-manifest.md)

생성형 이미지 슬롯을 매니페스트에 등록. 코드는 이미 `data-ph`로 placeholder를 렌더하므로 마크업 변경 없음. (실 에셋은 추후 교체)

**Files:**
- Modify (append): `image-manifest.md`

- [ ] **Step 1: `image-manifest.md`에 섹션5 슬롯 append**

`image-manifest.md` 맨 끝에 추가(기존 표/포맷이 있으면 그 포맷에 맞춰 변환):

```markdown
## 섹션5 (횡스크롤 약속)

| id | section | 비율 | intent | prompt(가안) | alt |
|---|---|---|---|---|---|
| origin-blum | s5-act1 | 3:2 | Blum 오스트리아 제조 무드(하드웨어·정밀) | (작성 예정) | Blum 오스트리아 제조 |
| origin-agoform | s5-act1 | 3:2 | AGOFORM 독일 제조 무드 | (작성 예정) | AGOFORM 독일 제조 |
| origin-peka | s5-act1 | 3:2 | Peka 스위스 제조 무드 | (작성 예정) | Peka 스위스 제조 |
| sole-agent-01 | s5-act2 | 풀패널 | 독점 에이전트/공인 무드 | (작성 예정) | 독점 에이전트 |
| sole-agent-02 | s5-act2 | 풀패널 | 정품 보장/방패 무드 | (작성 예정) | 정품 보장 |
| sole-agent-03 | s5-act2 | 풀패널 | 멀티브랜드 수입 무드 | (작성 예정) | 멀티브랜드 수입 |
| sole-agent-04 | s5-act2 | 풀패널 | 하드웨어 전문성 무드 | (작성 예정) | 하드웨어 전문성 |
| sole-agent-05 | s5-act2 | 풀패널 | 전국 쇼룸 무드 | (작성 예정) | 전국 쇼룸 |
| sole-agent-06 | s5-act2 | 풀패널 | 자체 생산(김포) 무드 | (작성 예정) | 자체 생산 |
| closing | s5-act3 | 풀패널 | 고객 전달/마무리 무드(선택) | (작성 예정) | 마무리 |

> 전부 생성형 = 무드 가안. 실 에셋 생성 후 `data-ph`를 실제 `<img>`/배경으로 교체. AI 합성 제품을 '정품'으로 표기 금지.
```

- [ ] **Step 2: 육안 확인(문서)**

`image-manifest.md` 표가 깨지지 않고 섹션5 슬롯 10개가 추가됐는지 확인.

- [ ] **Step 3: 커밋**

```bash
git add image-manifest.md
git commit -m "docs(5): 섹션5 이미지 슬롯 매니페스트 등록"
```

---

## Task 6: reduced-motion 폴백 + 구 스타일 정리

reduced-motion에서 핀/가로이동 없이 3막을 세로 정적 나열. 구 `.tf-*` 스타일 제거.

**Files:**
- Modify (append): `app/manifesto/manifesto.css`
- Modify: `app/manifesto/manifesto.css` (구 `.trust`/`.tf-*` 블록 제거)

- [ ] **Step 1: reduced-motion 폴백 스타일 append**

`useScrub`은 reduce에서 `onUpdate(1)`을 1회 호출 → `--scene≈7`, `--c*=1`, `--a3=1` 최종형이 됨. 가로 트랙을 세로 스택으로 전환:

```css
@media (prefers-reduced-motion: reduce) {
  .route-manifesto .s5 { height: auto; }
  .route-manifesto .s5__sticky {
    position: static;
    height: auto;
    overflow: visible;
  }
  .route-manifesto .s5__track {
    flex-direction: column;
    width: 100%;
    transform: none !important;
  }
  .route-manifesto .s5-panel {
    flex: none;
    width: 100%;
    min-height: 80svh;
  }
  /* 카드는 최종 쌓인 상태(--c*=1), ACT3는 보임(--a3=1) — 트랜스폼 안전화 */
  .route-manifesto .s5-deckcard,
  .route-manifesto .s5-closing { transform: none; opacity: 1; }
  .route-manifesto .s5-rail { display: none; }
}
```

- [ ] **Step 2: 구 트러스트 스타일 제거**

`app/manifesto/manifesto.css`에서 더 이상 쓰지 않는 구 섹션5 블록 제거: `.route-manifesto .tf-hybrid`, `.tf-end`, `.tf-pipe`, `.tf-hub`, `.tf-tag`, `.tf-cards`, `.tf-card`, `.tf-icon`, `.route-manifesto .trust .brands`, `.footnote`(섹션5 전용일 경우) 등 `tf-`/구 trust 관련 규칙. (Grep으로 `tf-`/`.trust ` 확인 후 제거. 다른 섹션이 공유하는 `.footnote`·`.brands`는 남길 것 — 사용처 grep으로 확인.)

Run(확인): `git grep -n "tf-" app/manifesto/` 및 `git grep -n "brands\\|footnote" app/manifesto/`로 공유 여부 점검 후 섹션5 전용만 삭제.

- [ ] **Step 3: 타입체크 + 빌드**

Run: `npx tsc --noEmit` → 에러 0
Run: `npm run build` → 성공(CSS 문법 오류 없음)

- [ ] **Step 4: 육안 확인**

① 일반: `/manifesto` 섹션5 전 구간 정상 동작.
② reduced-motion: OS/브라우저에서 "동작 줄이기" 켠 뒤 새로고침 → 섹션5가 핀 없이 세로로 ACT1(쌓인 더미)→6항목→마무리가 정적으로 나열되는지.

- [ ] **Step 5: 커밋**

```bash
git add app/manifesto/manifesto.css
git commit -m "feat(5): reduced-motion 세로 폴백 + 구 trust 스타일 제거"
```

---

## Task 7: 실측 튜닝 + WORKLOG

체류감/스텝감 실측 튜닝(섹션 높이·dwell·이징) 후 기록.

**Files:**
- Modify: `app/manifesto/manifesto.css` (`.s5` height 등) / `trust.tsx` (`A1_DWELL`)
- Modify (append): `WORKLOG.md`

- [ ] **Step 1: 데스크탑/모바일에서 스크롤 체감 튜닝**

`/manifesto` 섹션5를 데스크탑 + 모바일(DevTools 터치 또는 실기기)에서 스크롤하며:
- ACT1 카드 던지기가 너무 빠르면 `A1_DWELL`↑(예 0.16), 느리면 ↓.
- 막 전체가 너무 빨리/느리게 지나가면 `.s5 { height }` 조정(예 420~560svh).
- 한 번에 하나씩 넘어가는 스텝감이 필요하면 `useScrub` snap 적용 검토(섹션2와 동일 패턴: coarse에서만 scene 경계값으로 snap). *주의:* normalizeScroll 구간이라 GSAP snap 사용(CSS scroll-snap 금지).

값만 바꾸는 수술적 수정. 코드 구조 변경 없음.

- [ ] **Step 2: 타입체크**

Run: `npx tsc --noEmit` → 에러 0.

- [ ] **Step 3: `WORKLOG.md` 한 칸 append**

`WORKLOG.md` 템플릿 블록 아래(최신순 맨 위)에 섹션5 횡스크롤 작업 엔트리 추가(한 일/산출물/결정/막힘/다음/확인요청 칸).

- [ ] **Step 4: 커밋**

```bash
git add app/manifesto/manifesto.css app/manifesto/trust.tsx WORKLOG.md
git commit -m "tune(5): 섹션5 스크롤 체감 튜닝 + WORKLOG"
```

---

## Self-Review (작성자 체크 결과)

- **스펙 커버리지:** ACT1 카드 던지기·더미(Task2) / ACT2 풀블리드+레일(Task3) / ACT3 새 카피(Task4) / 핀 횡스크롤 엔진(Task1) / 이미지 슬롯(Task5) / 모바일 가로 유지(Task1 100vw + Task7 튜닝) / reduced-motion 폴백(Task6) — 모두 태스크 존재. ✅
- **플레이스홀더:** 코드 단계는 실제 코드 포함. 이미지 prompt만 "(작성 예정)" — 이는 스펙상 의도된 미확정(생성형 에셋 추후). ✅
- **타입/이름 일관성:** `--c1/2/3`(ORIGINS 3개), `--sa`/`--scene`/`--a3`, `active`/`activeRef`, `NodeRail({active})`, `FACETS[].img`/`ORIGINS[].rot` — 태스크 간 일치. ✅
```
```
