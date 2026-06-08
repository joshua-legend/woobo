# Woobo 랜딩 — 빌드 설계 (2026-06-08)

> Next.js(App Router) + TS + Tailwind v4 + GSAP(ScrollTrigger) + Lenis 로 `_designs/a·b·c/index.html`
> 3종 디자인을 라우트로 충실히 포팅. 토큰·공유 컴포넌트는 V2 디자인 시스템 기준 DRY.
> 출처: `_prompts/BRIEF.md`(카피 가드레일) · `_prompts/DESIGN-PROMPT-V2.md`(디자인 시스템) · 5/6/7(섹션 스펙).

## 입력물 실측 결과 (중요)
- `_designs/a-manifesto/index.html` = **문제해결** 내러티브(9섹션, IIFE+`--p` 스크럽, 풀 HANDOFF NOTES). 비핀 데모.
- `_designs/b-problem/index.html` = **문제해결** 내러티브(9섹션, `data-theme`/`data-scrub`, MOTION 주석). **핀(sticky) 데모 + cause 다크→라이트**.
- `_designs/c-origin/index.html` = **기원서사**(8섹션, heritage 핀 타임라인+SVG draw+카운트업+패럴랙스).
- → 프롬프트5(매니페스토) 디자인 파일은 **부재**. a·b 둘 다 문제해결 트리트먼트 2종.

## 결정사항
1. **/manifesto 처리**: 폴더명대로 충실 포팅(a→/manifesto, b→/problem, c→/origin). 게이트웨이 카드 라벨로 보완.
2. **빌드 순서**: 공유 기반 + `/problem`(b, 최고난도) 먼저 → 검수 → 확장.
3. **폰트**: next/font 셀프호스트(Pretendard local + IBM Plex Sans KR/Mono google).

## 라우트
- `/` 게이트웨이 셀렉터(3카드) · `/manifesto`(a) · `/problem`(b) · `/origin`(c).

## 토큰(DRY)
- Tailwind v4 CSS-first `@theme`(globals.css)에 V2 토큰 1회 정의 → CSS 변수 + Tailwind 유틸 동시 생성.
- color(orange/ink/paper/charcoal/line), easing(`--ease` `--ease-tip` `--ease-slam`), font, radius, spacing.

## 스타일 포팅
- 하이브리드: 레이아웃·타이포·간격 = Tailwind 유틸 / 정교한 비주얼(서랍·슬램·힌지3축·heritage) = 컴포넌트별 CSS Module(원본 충실 이식).

## 컴포넌트
- layout: SiteHeader(진행바+shrink+on-dark) · SmoothScrollProvider(Lenis↔ScrollTrigger)
- primitives: Reveal(.up) · MaskReveal · SplitText · Placeholder(.ph) · Eyebrow · Button · Chip · MicroCta
- demos(공유, mode='scrub'|'pinned'): DemoSoftClose · DemoToolFree(힌지3축) · DemoTipOn
- sections(공유): ShowroomSection(김포/용인/부산 카드+지도ph+CTA+closeline) · GatewayCard
- hooks: useReducedMotion · lib: gsap.ts · branches.ts(지점 데이터+TODO)

## 프리미엄 플러그인 대체
- DrawSVG → `strokeDashoffset` 트윈 / SplitText → 마크업 span 분할 / Inertia → 포인터 핸들러+소프트클로즈 스냅(소스에 있을 때만).

## 인터랙션(각 MOTION 주석 1:1 → ScrollTrigger)
- 공통: progress-bar, header-shrink/on-dark, reveal up/mask, closeline scaleX, CTA TIP-ON 팝.
- /problem(b): problem-slam('쾅' 1회), cause 다크→라이트, wordmark float, 핀 데모 3종.
- /origin(c): hero 패럴랙스, 핀 heritage 타임라인(SVG draw+노드 순차+카운트업 2,100/26,000), 데모 3종, roadmap draw.
- /manifesto(a): 비핀 데모 3종, cause path-row, trust 마크 draw.

## 접근성·품질
- prefers-reduced-motion: Lenis off + 최종 정적 상태 + 카운터 최종값.
- 모바일 900px 단일 컬럼, 이미지 전부 `.ph` placeholder.
- ScrollTrigger 누수 cleanup: 컴포넌트별 `gsap.context()` + 언마운트 `ctx.revert()`.

## 카피 가드레일(BRIEF)
- 주역=우보(Blum 한국 독점 에이전트). "우리가 곧 Blum"/"Blum 코리아·본사" 금지.
- 정품/유사품 메시지 활용. Blum 수치="자체 시험 기준". "평생보증" 금지. 하중="최대 약 70kg급".
- 지점값: 용인 031-274-4241 / 부산 동래구 안락동 459-29, 051-323-2532. 김포 전화·예약채널·예약/견적/카탈로그 href = placeholder + [TODO].

## 빌드 순서
0. 스캐폴드(Next/TS/Tailwind v4/GSAP/Lenis/next/font) + `@theme` 토큰 + 프리미티브
1. SmoothScrollProvider + SiteHeader + reveal/reduced-motion
2. /problem(b) 풀 → **검수**
3. /manifesto(a) → 4. /origin(c) → 5. / 게이트웨이
6. QA(리듀스드모션·모바일·cleanup·placeholder/TODO·카피 감사)
