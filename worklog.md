# 우보 랜딩 — 작업 로그 (WORKLOG)

> **이 파일 = 기록용(raw).** 매 작업 세션/하루 끝에 아래 "기록"에 한 칸씩 **최신순(위로)** 추가.
> 주말에 이 로그를 굴리면 → `우보_랜딩_주간보고_회고_N주차.md`(보고용)가 된다.
>
> **칸 = 보고서 섹션 매핑** (이대로 적으면 그냥 합쳐서 보고서가 됨)
> | 로그 칸 | → 보고서 섹션 |
> |---|---|
> | 한 일 | 2. 이번 주에 한 일 |
> | 산출물 | 3. 산출물 |
> | 결정 | 4. 회고 · 의사결정 기록 |
> | 막힘/배운 점 | 4. 회고 · 배운 점 |
> | 다음 | 5. 다음 주 계획 |
> | 확인요청 | 6. 사장님 확인 요청 |
>
> **AI 활용:** 작업 끝에 → "오늘 한 거 로그 칸 형식으로 맨 위에 추가해줘."
> 주말에 → "이번 주 로그 엔트리들 모아서 주간보고 형식으로 굴려줘."

---

## 기록 (최신순)

<!-- ↓ 이 블록을 복사해서 매번 맨 위에 새로 추가 -->
### [YYYY-MM-DD] 세션 N — ［한 줄 요약］
- **한 일:**
  -
- **산출물:**
  -
- **결정:**
  -
- **막힘/배운 점:**
  -
- **다음:**
  -
- **확인요청(사장님):**
  -
<!-- ↑ 템플릿 -->

---

### [2026-06-21] 세션 — 섹션05 약속 대격변: 횡스크롤 3막
- **한 일:**
  - 브레인스토밍(비주얼 컴패니언 목업) → 스펙 → 7태스크 계획 → 서브에이전트 주도 구현(태스크별 스펙+코드품질 2단계 리뷰).
  - 섹션5(`trust.tsx`)를 세로 팝업 → **핀 횡스크롤 시네마틱 3막**으로 전면 교체. 엔진: `useScrub` 진행도 → `--scene`(트랙 translateX) 외 `--c1/2/3`·`--sa`·`--a3` CSS변수로 CSS가 구동(프레임마다 setState 없음).
  - **ACT1** 검은 화면서 오리진 카드(AGOFORM·Peka·Blum) 위에서 던져져 트럼프 더미로 회전 적재. **ACT2** sole agent 6 풀블리드 배경+스크림 텍스트, 스크롤 1스텝=1항목, 하단 노드 레일 누적 점등. **ACT3** "당신의 공간에 정품의 기준을." + 쇼룸 CTA(--a3 reveal).
  - 이미지 슬롯 10개 `image-manifest.md` 등록 + 빗금 placeholder 캡션. reduced-motion 세로 폴백. 구 `tf-*` 죽은 CSS 539줄 제거(.footnote 등 공유 보존).
- **산출물:** `app/manifesto/trust.tsx`(재작성), `app/manifesto/manifesto.css`(s5 스타일+정리), `image-manifest.md`, 스펙/플랜 문서(`docs/superpowers/`). 커밋 6e7b32b~f5c67ab.
- **결정:** 모바일도 가로 유지(normalizeScroll와 동작). 이미지=생성형 가안(슬롯, src 교체식). ACT1 통합 한 더미. ACT3 카피 "(나)"안.
- **막힘/배운 점:** 컴패니언 서버가 Windows 백그라운드서 자주 죽어 포트 재할당 반복. 슬롯 id(origin-*) vs data-ph 불일치를 리뷰가 잡음.
- **다음:** **실기기/데스크탑 실측 튜닝** — `.s5` height(480svh)·`A1_DWELL`(0.12)·이징, 필요시 스텝 snap(섹션2 패턴). 생성형 이미지 실제 에셋 제작·교체. ACT2 이미지 없을 때 가독성 점검.
- **확인요청(사장님):** 섹션5 횡스크롤 전반 체감(막별 체류·스텝감), ACT3 카피·CTA, 이미지 무드 방향.
- **한 일:**
  - 원인 진단: `.identity--story` 높이가 220svh **데스크탑·모바일 공용** → 5챕터 ÷ = 챕터당 44svh(화면 절반 미만)라 모바일 스와이프 1회에 1~2챕터가 휙 지나감.
  - **1단계** `manifesto.css`: 모바일(≤900px) `.identity--story` 높이 220→**500svh**(챕터당 100svh)로 늘려 빨리 넘어가는 느낌 제거. 옛 CSS scroll-snap 주석 블록 정리.
  - **2단계** `useScrub.ts`: ScrubOptions에 `snap` 추가, **coarse 포인터에서만** ScrollTrigger `snap` 적용(중앙값 정렬, duration 0.2~0.5·ease power1.inOut). `identities.tsx`: `STORY_SNAP=[0.1,0.3,0.5,0.7,0.9]`(챕터 중앙) 전달.
- **산출물:** `hooks/useScrub.ts`, `app/manifesto/identities.tsx`, `app/manifesto/manifesto.css`
- **결정:** 모바일은 Lenis가 아니라 `normalizeScroll(true)`라 **CSS scroll-snap은 충돌·미동작** → GSAP ScrollTrigger snap이 정석(이게 과거 CSS 스냅이 꺼졌던 진짜 이유). 변경은 모바일 한정, 데스크탑 불변.
- **막힘/배운 점:** normalizeScroll 구간에서 네이티브 스냅 불가 → 스크롤 엔진과 같은 레이어(GSAP)에서 스냅해야 함.
- **다음:** **실기기에서 스냅 모멘텀/타이밍 튜닝**(duration·delay), 필요시 directional 조정.
- **확인요청(사장님):** 모바일 섹션02가 한 챕터씩 멈추는 느낌이 적절한지(너무 끈적/너무 헐거운지).

---

### [2026-06-21] 세션 — 섹션04 도어 영상 → 프레임 시퀀스 + 좌우 드래그 스크럽
- **한 일:**
  - `videos/door.mp4`(1660×1244·24fps·121f)를 ffmpeg로 **webp 프레임 121장** 추출(`public/videos/door-frames/frame_0001~0121.webp`, 1280폭·q80, 총 2.85MB < 원본 4.43MB).
  - 1차로 `DoorTapPlay`(탭 토글)를 프레임+canvas로 옮겼다가, **사장님 결정으로 인터랙션을 좌우 드래그 스크럽으로 변경** → `DoorTapPlay` 통째 제거하고 섹션03의 `VideoScrubStage` 재사용.
  - `VideoScrubStage`에 미터 라벨 prop(`leftLabel`/`rightLabel`) 추가 → door는 "닫힘↔열림"(좌=닫힘, 우=열림). 다크 섹션 미터 텍스트 가독성 보정(`section--dark .stage-meter` color).
- **산출물:** `app/manifesto/door.tsx`(VideoScrubStage 사용으로 축소), `VideoScrubStage.tsx`(라벨 prop), `manifesto.css`(다크 미터 색), `public/videos/door-frames/*`(121장)
- **결정:** 도어도 섹션03과 동일 좌우 스크럽으로 통일. 두 스테이지 모두 `.demo__stage` 1:1이라 비율 동일. mp4 원본 삭제 안 함.
- **막힘/배운 점:** 컨셉상 TIP-ON(손잡이 없이 톡)엔 탭이 더 맞다고 의견 냈으나, 제스처 통일 우선으로 드래그 채택. → **카피 "톡 누르면/손잡이 없이 연다"가 드래그와 어긋남, 추후 문구 재검토 필요.**
- **다음:** 섹션03·04 둘 다 **실기기 터치 검증** + 섹션04 카피 톤 재검토.
- **확인요청(사장님):** 도어 좌우 드래그 개폐 감 + 카피 수정 여부.

---

### [2026-06-21] 세션 — 섹션03 소프트클로즈 영상 → 프레임 시퀀스 스크럽
- **한 일:**
  - `videos/soft-close.mp4`(24fps·5초·121f)를 ffmpeg로 **webp 프레임 121장** 추출(`public/videos/soft-close-frames/frame_0001~0121.webp`, 1280폭·q80, 총 3.06MB < 원본 5.1MB). ffmpeg는 winget으로 설치.
  - `VideoScrubStage.tsx` 재작성: mp4 `currentTime` seek → **canvas + 사전 프리로드 프레임 `drawImage`**. 모바일 seek 끊김 원인 제거.
  - 데스크탑/터치 분기 통합(기존 터치 autoplay 루프 폐기) → **양쪽 다 좌우 스크럽**. rAF+lerp·가이드·OPEN/CLOSE 미터(`--p`)는 그대로 재활용.
  - 터치 세로스크롤 충돌은 `touch-action: pan-y`로 해결(가로만 스크럽, 세로는 페이지 양보). DPR·리사이즈는 ResizeObserver.
- **산출물:** `app/manifesto/VideoScrubStage.tsx`(재작성), `app/manifesto/softclose.tsx`(prop 교체), `app/manifesto/manifesto.css`(pan-y), `public/videos/soft-close-frames/*`(121장)
- **결정:** 렌더는 `<img>` 교체 대신 canvas(깜빡임 방지). 프레임은 전량 프리로드(단순). mp4 원본은 삭제 안 함(참조만 제거).
- **막힘/배운 점:** 모바일 mp4 scrub이 끊긴 건 브라우저 seek 디코드 코얼레싱 탓 → 프레임 시퀀스가 정석.
- **다음:** **실기기(iOS Safari) 터치 검증** — pan-y+pointerCapture 조합 동작 확인, 안 되면 수동 축 판별로 폴백.
- **확인요청(사장님):** 모바일에서 좌우 감기 + 세로 스크롤 둘 다 자연스러운지.

---

### [2026-06-12] 세션 — 섹션07 모바일 레이아웃 간격/정렬 정리
- **한 일:**
  - **섹션07 모바일(≤900px) 레이아웃 수정**(`manifesto.css` 내 미디어쿼리): 알약(레이아웃 선택) ↔ 지도 간격 확대(`.sr-stage` gap `clamp(32px,7vw,44px)`), 지도 ↔ 상세 간격 확대(`.sr-map` gap `clamp(28px,6vw,36px)`).
  - 지도 크기·중앙정렬 정리(`.sr-map__geo` `max-width:300px`/`max-height:360px`/중앙), 상세 패널 모바일 좌측 정렬+위 정렬(`.sr-detail`), 하단 CTA 상단 여백(`.actions margin-top`).
- **산출물:** `app/manifesto/manifesto.css` (모바일 미디어쿼리만)
- **결정:** 알약은 지금처럼 지도 위 유지, 간격만 확대(사장님 선택).
- **막힘/배운 점:** —
- **다음:** 실기기 모바일 확인 후 미세 튜닝.
- **확인요청(사장님):** 모바일 간격감 적절한지.

### [2026-06-11] 세션 — 섹션07 전국 우보브랜드샵(실데이터) + 06 인-섹션 picker
- **한 일:**
  - **섹션07 재구성**(`showrooms.tsx` 신규): placeholder 3개 → **전국 우보브랜드샵 10개 실데이터**(주소·전화). 4 레이아웃(지도/지도+리스트/카드/지점찾기) + 섹션 우측 picker(사장님 선택용). 기존 CTA·closeline·signoff 이관.
  - **한국 지도**(`public/korea-map.svg`): popong SK provinces SVG 다크 톤 가공, 10핀 호버/클릭 → 우측 상세. (핀 좌표 시각 튜닝 필요)
  - 가드레일: 본점(김포)/직영지사(부산)/브랜드샵/**파트너샵(청주 가구철물닷컴·제주 루미채)** type 배지로 구분. 카카오맵 링크(새창), 임베드는 후순위 [TODO].
  - **06 브랜드**: grid·marquee 삭제(5종), **검수용 VariantSwitcher 제거**, 06 우측에 레이아웃 picker(사장님 선택). reveal-up 전환 버그 수정(버튼 전환 시 안 보이던 문제).
- **산출물:** `app/manifesto/showrooms.tsx`, `public/korea-map.svg`, `brands.tsx`/`ManifestoClient.tsx`/`manifesto.css` 갱신
- **결정:** 07도 06처럼 사장님이 picker로 1개 고르는 방식. 지도는 실 SVG 가공(유럽맵과 동일 패턴).
- **막힘/배운 점:** 월드맵의 한국은 13점짜리라 부적합 → 전용 SK SVG 사용. 핀 좌표는 투영 계산이 까다로워 지리 추정값 + 시각 튜닝.
- **다음:** 한국 지도 핀 위치 스크린샷 보고 튜닝. 06·07 각 1개 레이아웃 확정 → 정리.
- **확인요청(사장님):** 06·07 레이아웃 선택, 지점 정보 최신 여부, 카카오맵 임베드 필요 여부.

### [2026-06-11] 세션 — 섹션06 브랜드 포트폴리오 신설 + 변주 총정리(확정안만 잔존)
- **한 일:**
  - **섹션06 신설**: 기존 가짜 후기 placeholder(`SocialProof`) → **정식 수입 브랜드 포트폴리오**(`brands.tsx`). 5개 브랜드(Blum·AGOFORM·Peka·BekaertDeslee·PWG) 실제 콘텐츠 + 가드레일 프레임(우보=공식 통로). 7개 레이아웃 변주(flagship/rows/grid/map/showcase/bands/marquee).
  - **AI 무드 이미지** 5종 슬롯 연결(`public/brands/*.png`) — 워드마크는 CSS, 배경은 가안 이미지 + "가안" 태그. 프롬프트 `brand-image-prompts.md`.
  - **유럽 지도(map 변주)**: `flekschas/simple-world-map`(CC BY-SA) 크롭 → `public/europe-map.svg`, 4개국 점 호버 → 우측 포커스 전환(독일 2점).
  - **도어(04)**: 탭→자동 1회 재생 + **다시 탭=역재생 토글**(rAF currentTime 구동, 배속 1.8).
  - **약속(05) hybrid**: 독점 에이전트 허브 **네온 보더**(점화 플리커+빛줄기+글로우, 톤다운), 끝노드 미니멀 텍스트화, **모바일 3그리드 축소판** 유지.
  - **변주 총정리**: 확정안만 잔존 — hero=slot · identity=pin · idStage=story · soft=video · door=tap · trust=hybrid (brands는 7종 유지). 죽은 변주 컴포넌트·옵션·CSS(약 1,120줄) 폐기.
- **산출물:**
  - `app/manifesto/brands.tsx`(신규), `europe-map.svg`, `public/brands/`(5), `brand-image-prompts.md`
  - 변주 축소: `lib/variants.ts`. 정리: heroes/identities/softclose/door/trust + `manifesto.css`
- **결정:**
  - 도어/브랜드 이미지는 **AI=가안까지만**(정품 메시지 충돌 회피), 출시 전 실물·공식 영상 교체 전제. 06 로고도 실제 로고 확보 시 교체.
  - CSS 정리: hybrid가 fusion/pillars의 클래스(`.tf-hub/.tf-cards/.tf-card/.tf-pipe/.tf-tag`)를 재사용 → **인터리브된 블록은 보존**, 격리된 죽은 블록만 제거(나머지는 무해 orphan).
- **막힘/배운 점:**
  - 실제 브랜드 로고가 사이트에 잘 안 나와 AI 무드 이미지로 대체. 유럽 지도는 월드 SVG를 viewBox 크롭 + 좌표 계산으로 점 배치(시각 미세조정 필요).
- **다음:**
  - 06 브랜드 레이아웃 1개 확정 → 나머지 정리. 지도 점 위치/크롭 시각 튜닝. 실제 로고·Blum 공식 영상 수급.
- **확인요청(사장님):**
  - 06 레이아웃 선택, 브랜드 카피/표기 확정, 로고·제품 영상 자산.

### [2026-06-11] 세션 — 영상 인터랙션 정비 + 섹션4 레이아웃을 섹션3과 통일
- **한 일:**
  - `VideoScrubStage` 정비: 자동재생 무조건 차단(준비 시 `pause`+`currentTime 0`), 스크롤 스크럽 제거 → **좌우 호버(마우스)/드래그(터치)** 스크럽으로 교체. 마우스 올리기 전엔 첫 프레임(OPEN) 유지, 벗어나면 초기로 사뿐히 복귀. 단일 rAF lerp(0.18)+seek 코얼레싱으로 버벅임 최소화. 가운데 "좌우로 움직여보세요 — 터치·마우스" 가이드.
  - 섹션5(trust) fusion **독점 에이전트 허브 카드 스태커**: 전용 IntersectionObserver(rootMargin 하단 +12%)로 전역(-10%)보다 조금 더 일찍 발동.
  - **섹션4(door) 레이아웃을 섹션3(soft)과 동일한 2단으로** — `.door__inner` 센터 단일컬럼 → `.demo .grid`. dark 테마 유지 + `.flip`(거울 지그재그: copy 우/영상 좌). 센터 정렬 CSS 제거, stagewrap/phnote 좌측 정렬.
- **산출물:** 수정 `VideoScrubStage.tsx`·`trust.tsx`·`door.tsx`·`manifesto.css`. 검증: `tsc --noEmit` 통과. 반응형(≤900px) `.demo .grid` 단일컬럼·`.flip order:0` 자동 상속.
- **결정:** door는 light 통일 대신 **dark 유지**(03 light→04 dark→05 light 명암 리듬). 03↔04 **지그재그(.flip)** 배치로 시선 환기. 영상 복귀 지점은 OPEN(0).
- **다음:** door.mp4 실제 영상으로 좌우 스크럽 감 확인(키프레임 간격 따라 seek 버벅이면 `-g 1` 재인코딩 검토). 영상 기본 변주 `scrub` 채택 여부.
- **확인요청(사장님):** 섹션4 2단(거울) 레이아웃 OK? 영상 벗어났을 때 OPEN 복귀 vs 닫힘 복귀 선호?

### [2026-06-09] 세션 — 섹션 4+5 통합 "도어" + 영상 플레이어 공용화
- **한 일:**
  - 04(무공구 힌지)+05(TIP-ON) → **"도어" 한 섹션**(`?door=`)으로 통합, 좌우분할 → **가운데 단일 컬럼**. 카피 "공구 없이 달고, 손잡이 없이 연다."
  - 변주 3종: `click`(문 클릭→TIP-ON 열림 + 무공구 장착 라벨)·`hotspots`(호버 핫스팟 2개)·`scrub`(도어 영상, `/videos/door.mp4`).
  - 섹션3 영상 플레이어를 **`VideoScrubStage`(src prop)로 공용 추출** → soft·door 둘 다 재사용.
  - 번호 재정렬(8→7섹션): 도어=04 → 약속05 → 함께06 → CTA07.
- **산출물:** 신규 `VideoScrubStage.tsx`·`door.tsx`. 수정 `softclose.tsx`(공용 플레이어 사용)·`ManifestoClient.tsx`(DemoHinge/TipOn 제거+재번호)·`lib/variants.ts`·`heroes.tsx`·`manifesto.css`. 검증: tsc·build 통과, 도어 3변주 렌더·섹션3 무회귀·/problem·/origin 200.
- **결정:** 기본 `door=click`(영상 없이 동작). 도어 영상 들어오면 기본 `scrub`로 플립.
- **다음:** 사장님 Kling으로 **도어 영상**(무공구 장착→TIP-ON 열림) 뽑아 `public/videos/door.mp4`. 3변주 비교 후 채택.
- **확인요청(사장님):** 도어 통합 OK? 변주 방향?

### [2026-06-08] 세션 — 섹션3(소프트클로즈) throw·compare 버저닝
- **한 일:**
  - 신념① 소프트클로즈를 `?soft=` 버저닝으로: `scrub`(현행)·`throw`(드래그로 세게 던져도 항상 사뿐히 릴리즈 스냅)·`compare`(일반 vs BLUMOTION 대비, **절제** — 슬램 이징 안 쓰고 미세 범프만).
  - 인라인 DemoSoftClose → `app/manifesto/softclose.tsx`로 추출+3변주.
- **산출물:** 신규 `softclose.tsx`, 수정 `lib/variants.ts`(soft 키)·`ManifestoClient.tsx`·`manifesto.css`(softthrow·sc-compare). 검증: tsc·build 통과, 3변주 렌더·스위처 노출.
- **결정:** compare는 '쾅' 슬램 토큰 미사용(절제). throw 포인터+touchAction none(모바일 드래그).
- **확인요청(사장님):** throw 던짐 감도/compare 대비 강도 OK? 신념①도 최종 1안 선택.

### [2026-06-08] 세션 — story 페이즈+커튼 와이프 전환
- **한 일:**
  - story를 **연속 팬 → 페이즈(챕터) 방식**으로: 각 페이즈에서 스크롤하면 진행바(`--story-local`)가 차고, 다 차면 **커튼 와이프(오른쪽→왼쪽)**로 다음 페이지처럼 넘어감(active 키 변경마다 1회). 텍스트 정중앙.
  - 패럴럭스는 페이즈 내부 미세 드리프트로 유지(far/near/씬 켄번즈), 씬은 스택+페이드(커튼이 전환 가림).
- **산출물:** 수정 `identities.tsx`(phase/local·씬 스택·커튼)·`manifesto.css`(커튼 와이프·스택·reduced). 검증: tsc·build 통과, 커튼·씬·비트 렌더, reduced-motion 정적.
- **확인요청(사장님):** 커튼 속도/색·페이즈당 스크롤 길이 OK?

### [2026-06-08] 세션 — story 패럴럭스+스토리텔링 강화
- **한 일:**
  - story에 **패럴럭스 3층**(far 글로우 느림 / world 씬 중간 / near 스피드라인 빠름) → 게임 같은 깊이감.
  - 챕터 텍스트 **스태거 비트 등장**(번호→헤드→proof, 진행 방향에서 슬라이드인) → 스토리텔링감.
  - **씬별 배경 틴트 5색**(스크롤 진행 시 색 미묘 변화) + 스크림 약간 따뜻하게.
- **산출물:** 수정 `identities.tsx`(far/near 레이어·SCENE_TINTS·story-beat)·`manifesto.css`. 검증: tsc·build 통과, far/near·beat·틴트 렌더, reduced-motion 정적.
- **확인요청(사장님):** 패럴럭스 강도·팬 방향·색 변화폭 OK?

### [2026-06-08] 세션 — story 재정의: 풀블리드 사이드스크롤(가운데 텍스트+뒷배경 팬)
- **한 일(개정):**
  - story를 우측 필름스트립 → **풀블리드 사이드스크롤**로 갈아엎음. **텍스트는 가운데 고정**, 세로 스크롤하면 **뒷배경 5씬이 횡으로 팬**(사이드스크롤 게임처럼) + 챕터별 가운데 텍스트(키워드/번호/proof) 교체 + 하단 진행바. 배경 = card 이미지 재사용(.ph 대신 charcoal 폴백).
  - 기존 pin-story(필름스트립) 코드·CSS 제거.

### [2026-06-08] 세션 — 정체성 우측 story(가로 필름스트립) 추가
- **한 일:**
  - idStage에 `story` 변주 추가: 세로 스크롤(--story 0→1)에 맞춰 우측 5패널이 **우→좌 연속 팬**하는 가로 스토리텔링. 패널=이미지(card 재사용)+챕터번호/타이틀 텍스트 혼합 + 하단 진행바. 좌측 키워드 동기.
- **산출물:**
  - 수정 `lib/variants.ts`(story 옵션)·`identities.tsx`(StageStory + rightRef로 --story 연속 세팅)·`manifesto.css`(pin-story + reduced-motion 세로 스택).
  - 검증: tsc·build 통과, story 5패널·트랙·진행바·챕터라벨 렌더, card 이미지 재사용(.ph 폴백), reduced-motion 세로 정적.
- **결정:**
  - 흐름=연속 팬, 내용=이미지+텍스트 혼합(사장님 선택). 이미지는 card용 재사용(새 생성 0).
- **다음:**
  - 정체성 우측 후보 = card·demo·story(+image·diagram). 사장님 최종 1안 선택 대기.
- **확인요청(사장님):**
  - story 팬 속도/패널 비율 OK?

---

### [2026-06-08] 세션 — 정체성 우측 card·demo 디벨롭 (2안 확정)
- **한 일:**
  - 사장님 **card·demo 채택** → 디벨롭. card = 아이콘 → **이미지 카드**(4:5 풀카드+하단 텍스트, `.ph` 해치 폴백). demo = **셀렉티브 폴리시**: 지도를 실제 한국 SVG+김포·용인·부산 핀 순차 점등으로, 로고는 워드마크 유지, 나머지 모션 정교화.
  - card 이미지 프롬프트 5종 발행(`identity-card-1~5`, 4:5).
- **산출물:**
  - 수정 `app/manifesto/identities.tsx`(StageCard 이미지화·map SVG)·`manifesto.css`(card·map 스타일+reduced)·`image-manifest.md`(card 슬롯).
  - 검증: tsc·build 통과, card 이미지 경로/오버레이·demo 한국 SVG/핀 렌더, 이미지 404 시 `.ph` 폴백.
- **결정:**
  - 브랜드 로고 = 워드마크(텍스트) — 실제 로고 사용권 이슈 회피. card 이미지 폴더 `public/images/identity/`.
- **다음:**
  - 사장님이 `identity-card-1~5.png` 생성 → 끼우면 카드 완성. demo 미세조정(핀 위치·속도) 피드백 반영.
- **확인요청(사장님):**
  - card 이미지 5장 / 한국 지도 핀 위치 정확도 OK?

---

### [2026-06-08] 세션 — 정체성 pin 우측 동기 스테이지 4안 버저닝
- **한 일:**
  - pin을 **좌우 분할 스크롤리텔링**으로: 좌=키워드, 우=키워드와 동기되는 스테이지(우→좌 슬라이드인).
  - 우측 스테이지 **4안**을 버저닝 새 축(`?idStage=`)으로 추가: `card`(아이콘 카드)·`demo`(항목별 미니 인터랙션 5종)·`image`(사진 패널 .ph)·`diagram`(SVG draw).
- **산출물:**
  - 수정 `app/manifesto/identities.tsx`(IdentityPin 분할+state 동기 + PinStage/StageCard/StageDemo/StageDiagram)·`lib/variants.ts`(idStage 키)·`ManifestoClient.tsx`·`manifesto.css`(분할 그리드+스테이지 4종+reduced-motion)·`image-manifest.md`(identity-1~5 슬롯).
  - 검증: tsc·build 통과, 4안 SSR 렌더·split·demo 5종·image 캡션·파라미터 조합 보존 확인.
- **결정:**
  - 우측 스테이지는 pin 전용(stamp/marquee 미적용). 활성 인덱스를 state로 승격해 좌/우 동기. 기본 `card`.
- **다음:**
  - 사장님 4안 비교 → 1안 채택. image안 채택 시 `identity-1~5` 이미지 생성.
- **확인요청(사장님):**
  - 우측 4안 중 방향 / demo 미니데모 수준 OK / image안 갈지(이미지 5장 필요).

---

### [2026-06-08] 세션 — 섹션2(정체성) 변주 2종 추가 + 히어로 이미지 연결
- **한 일:**
  - 히어로 slot 배경 4장·aperture 배경 3장(=a/b/c 비교용) 실제 PNG 연결(`public/images/hero/`).
  - **섹션2(정체성)에 변주 2종 추가**: `stamp`(자격 도장·SVG draw+팝) / `marquee`(흐르는 키워드 띠) — 현행 `pin`과 함께 `?identity=`로 스위처 비교.
- **산출물:**
  - 신규 `app/manifesto/identities.tsx`(pin/stamp/marquee+셀렉터). 수정 `lib/variants.ts`(identity 키)·`ManifestoClient.tsx`·`manifesto.css`(stamp·marquee 스타일).
  - 검증: tsc·build 통과, 3변주 SSR 렌더, 스위처 정체성 줄 노출·hero↔identity 파라미터 상호 보존.
- **결정:**
  - 정체성 변주는 이미지 0(stamp=SVG 씰, marquee=타이포). 공용 버저닝이 섹션 늘려도 그대로 확장됨을 실증(레지스트리 키만 추가).
- **다음:**
  - 사장님 히어로(5)·정체성(3) 비교 → 각 1안 채택 → 스위처 제거·정적 복귀. 필요 시 섹션3~ 변주.
- **확인요청(사장님):**
  - 히어로/정체성 각각 어느 안? marquee 영문 라벨(OFFICIAL CHANNEL 등) 표기 OK?

---

### [2026-06-08] 세션 — 공용 섹션 버저닝 + 히어로 3안 (검수 비교용)
- **한 일:**
  - 전 섹션 공용 **버저닝 메커니즘** 구축: URL 쿼리(`?hero=...`)로 변주 선택 + 우하단 검수용 스위처. 새 섹션은 레지스트리 키만 추가.
  - 히어로(01) **3안** 빌드(이미지는 `.ph`): `kinetic`(현행+미세 드리프트) / `slot`(단어↔배경 교체, 사장님 아이디어) / `aperture`(글자=조리개 스크럽).
  - 이미지 안 정리 파일 2개 생성: `docs/interaction-concepts.md`(섹션별 인터랙션 메뉴) · `image-manifest.md`(슬롯별 생성 프롬프트 완성형).
- **산출물:**
  - 신규: `lib/variants.ts`(레지스트리)·`components/lab/VariantSwitcher.tsx`(+css)·`app/manifesto/heroes.tsx`(3안+셀렉터)
  - 수정: `app/manifesto/page.tsx`(searchParams→변주)·`ManifestoClient.tsx`·`manifesto.css`(변주 스타일)
  - 검증: tsc·next build 통과(/manifesto 동적), 3안 SSR 렌더·스위처·잘못된 값→kinetic 폴백 확인, /problem·/origin 회귀 없음.
- **결정:**
  - 비교 방식 = 페이지 분리 ❌ → **공용 버저닝 토글** ✅(다른 섹션도 추후 변주 예정). 핵심 제약: `useReveal`가 마운트 시점만 관찰 → 변주는 로드 시점 결정, 스위처는 풀 리로드.
  - 기본 변주 = `kinetic`(안전). 이미지는 사장님이 GPT/허깅페이스로 직접 생성 → 슬롯만 교체.
- **막힘/배운 점:**
  - `searchParams` 사용 시 라우트가 정적→동적 전환. 변주 확정·스위처 제거하면 정적 복귀.
- **다음:**
  - 사장님 3안 비교 → 1안 채택 → 이미지 슬롯 실물 교체 → 스위처 제거(정적 복귀).
- **확인요청(사장님):**
  - 히어로 3안 중 어느 방향 / 슬롯안 교체 단어(움직임·정밀·정품·디테일) OK?

---

### [2026-06-08] 세션 — /manifesto 선언형 매니페스토로 재구축 (라운드1)
- **한 일:**
  - `/manifesto`를 문제해결 포팅 → DESIGN-PROMPT-5 기반 **선언형 8섹션**으로 갈아엎음
  - 신규: [01] 다크 히어로 "우리는 움직임을 믿습니다"(‘움직임’만 --ease-tip 톡-팝) / [02] 정체성 핀(sticky + useScrub 키워드 5종 1:1 소프트클로즈 교체) / [07] 사회적 증거(placeholder)
  - 재사용(신규 생성 0): 데모 3종(softclose/hinge/tipon, 비핀 스크럽)·Trust·Showroom 제자리 재사용, 카피만 신념화
  - 제거: 슬램도어 Problem('쾅')·Cause·Solve → 문제 프레이밍·슬램 모션 삭제
- **산출물:**
  - `app/manifesto/ManifestoClient.tsx`(9→8섹션 재구성)·`manifesto.css`(히어로 다크화+핀+소셜, 죽은 CSS 정리)
  - 검증: `tsc --noEmit` 통과 / `next build` 통과(전 라우트 prerender) / dev SSR 카피 확인 / /problem·/origin 회귀 없음(200)
- **결정:**
  - 히어로 = 다크 풀블리드(스펙대로) / 정체성 = 스티키 핀 + 스크럽 키워드 교체 (사용자 확정)
  - 데모/쇼룸은 export 모듈이 아니라 라우트별 인라인 복사본 → "제자리 재사용"이 가장 수술적
- **막힘/배운 점:**
  - reduced-motion: 핀 해제 + 키워드 정적 리스트로 graceful degrade 처리
- **다음:**
  - 라운드1 피드백 반영 → 이미지 슬롯(.ph) 실물 교체 / 정체성 핀 미세 타이밍
- **확인요청(사장님):**
  - 사회적 증거 레퍼런스·후기 문구 / 김포 주소·전화·예약채널 (현재 [TODO] placeholder)

---

### [2026-06-08] 세션 — Next.js 마이그레이션 완료 + 디벨롭 준비
- **한 일:**
  - 가안 A·B·C(애니메이션 포함)를 Next.js 페이지로 마이그레이션, 3종 동작 확인
  - 디벨롭 방식 확정: 규칙 3종(모션·카피·이미지) → 섹션 수직 슬라이스
  - 작업 환경 정리: Superpowers/Karpathy 등 코드 스킬 검토
- **산출물:**
  - Next.js 가안 3종(동작), 킥오프 제안서(v6, 11슬라이드)
- **결정:**
  - 인터랙션 코어 = 단독+plan / 이미지·문구초안·감사 = 서브에이전트 병렬
  - AI 이미지는 가안·무드까지만, 실물(Blum 제품샷)은 출시 전 교체
- **막힘/배운 점:**
  - 전제(클라 정체성)가 v4→v6로 3번 바뀜 → 0단계(정체성) 못 박기가 최대 리스크 관리
  - 방법론·플레이북은 전제 무관 설계라 안 흔들림 = 체계화의 가치 실증
- **다음:**
  - CLAUDE.md + 프로젝트 스킬 4종 세팅 → 공용 스크롤 엔진 → 히어로부터 섹션별 디벨롭
- **확인요청(사장님):**
  - '독점 에이전트' 표기 / A/S 범위 / 김포 전화·예약채널 / 우보 연혁 / KPI / 랜딩 포커스(Blum vs 멀티)

---

## 주차 롤업 (주 1회)

1. 이번 주 엔트리 전부 모은다.
2. 칸별로 합친다 — 한 일은 묶어 요약, 산출물은 목록, 결정·막힘은 회고로, 다음은 계획으로, 확인요청은 사장님 섹션으로.
3. `우보_랜딩_주간보고_회고_N주차.md` 로 출력 → 사장님/내부용으로 전달.
4. 보고서로 옮긴 엔트리는 이 로그에 그대로 두되, 다음 주 새 엔트리부터 다시 쌓는다.
