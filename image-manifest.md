# 이미지 매니페스트 — 우보 랜딩

> 슬롯 단위로 이미지를 관리. **AI 생성 = 가안·무드까지만**, 실물(Blum 제품샷)은 출시 전 교체.
> placeholder는 `.ph`(빗금+모노 캡션)로 자리·비율만 잡고 `src`만 갈아끼움.
> 스키마: `{ id, section, 비율, intent, prompt, alt }` · 상태: `후보 / 채택 / 생성됨 / 실물교체`

## 공통 스타일 스파인 (모든 히어로 이미지 패밀리 일관성)
- 팔레트: 차콜 `#16140f`(주) / 페이퍼웜 `#f4f1ec`(미세 필) / 잉크 `#1c1a17` / **오렌지 `#ff671f` = 림라이트 액센트 한 줄만, 면적 금지**.
- 톤: cinematic editorial product mood, matte premium finish, soft volumetric light, fine film grain, shallow depth of field.
- 레이아웃: **대형 한글 헤드라인 들어갈 다크 네거티브 스페이스 확보**.
- 비율: 데스크탑 `16:9` 1차, 모바일 `4:5` 크롭 별도 권장.
- 네거티브(전 슬롯 공통): `no text, no logos, no brand markings, no readable labels, no watermark`.
- ⚠️ 가드레일: **합성 제품을 "정품"이라 캡션·표기 금지**(정품 메시지와 충돌). 히어로는 제품 라벨이 아니라 **소재·움직임·공간·손**의 무드로.

---

## SECTION 01 · 히어로 (선언) — 변주별 후보

### 1안 `hero-slot` — 슬롯 단어 ↔ 배경 교체 (단어 수만큼 N장)

> 파일: `public/images/hero/<id>.png` → slot 히어로 배경에 연결됨.

| id | 비율 | intent | 상태 |
|---|---|---|---|
| `hero-bg-motion` | 16:9 / 4:5 | '움직임' | 연결됨(png) |
| `hero-bg-precision` | 16:9 / 4:5 | '정밀' | 연결됨(png) |
| `hero-bg-authentic` | 16:9 / 4:5 | '정품'(무드만) | 연결됨(png) |
| `hero-bg-detail` | 16:9 / 4:5 | '디테일/손끝' | 연결됨(png) |

**`hero-bg-motion`**
- prompt: `Extreme macro side-section of a soft-close cabinet drawer caught mid-motion, subtle motion blur trailing the drawer face, machined runner visible, deep charcoal void #16140f, a single thin warm orange #ff671f rim-light tracing the leading edge, cinematic editorial lighting, shallow depth of field, matte premium surfaces, fine film grain, generous dark negative space on the left for a Korean headline, 16:9 --ar 16:9` + 공통 네거티브
- alt: `닫히는 서랍의 측단면 — 부드럽게 감속하는 움직임의 순간 (가안 이미지, 실물 교체 예정)`

**`hero-bg-precision`**
- prompt: `Cold macro close-up of a precision furniture hinge and clip mechanism, brushed steel with crisp machined edges and micro-adjust screws, reflective metal catching a cool key light, deep charcoal background, one restrained orange #ff671f accent glint, engineering elegance, shallow DOF, matte-vs-metal contrast, fine grain, dark negative space, --ar 16:9` + 공통 네거티브
- alt: `정밀 가공된 메탈 힌지 클로즈업 — 정밀에 대한 신념 (가안 이미지)`

**`hero-bg-authentic`** *(특정 제품 아님 · '정품' 단정 금지, 무드만)*
- prompt: `Abstract macro of fine laser-engraved lines on dark anodized metal (no readable text, no brand), a subtle holographic seal shimmer at a grazing angle, a sense of authenticity and verification, deep charcoal palette, single orange #ff671f glint, serious premium tone, shallow DOF, fine grain, dark negative space, --ar 16:9` + 공통 네거티브
- alt: `각인된 메탈 표면의 추상 매크로 — 정품의 신뢰를 암시하는 무드 (가안 이미지, 특정 제품 아님)`

**`hero-bg-detail`**
- prompt: `Intimate macro of a fingertip gently pressing a handleless cabinet surface at the instant a push-to-open drawer releases, warm skin tone against deep charcoal cabinetry, soft warm light, the faint orange #ff671f line of the opening gap, tactile premium mood, shallow DOF, fine grain, dark negative space, --ar 16:9` + 공통 네거티브
- alt: `핸들리스 표면을 누르는 손끝 — 손끝의 감각 (가안 이미지)`

### 2안 `hero-kinetic` — 순수 타이포 (기본 무이미지)

| id | 비율 | intent | 상태 |
|---|---|---|---|
| `hero-tex-grain` *(옵션)* | 16:9 | 질감 배경(거의 안 보임) | 후보 |

**`hero-tex-grain`** *(옵션 — 안 써도 됨)*
- prompt: `Barely-visible fine paper and concrete grain texture, near-black charcoal #16140f with extremely subtle paper-warm #f4f1ec fibers, flat even matte surface, almost imperceptible, pure mood backdrop with no focal subject, --ar 16:9` + 공통 네거티브
- alt: `거의 보이지 않는 미세 질감 배경 (2안 옵션)`

### 3안 `hero-aperture` — 단어=조리개 (단일 와이드 컷 1장, 무드 3택1)

| id | 비율 | intent | 상태 |
|---|---|---|---|
| `hero-bg-aperture-a` | 16:9 | 쇼룸 | 연결됨(png) — `?hero=aperture-a` |
| `hero-bg-aperture-b` | 16:9 | 자체생산(김포) | 연결됨(png) — `?hero=aperture-b` |
| `hero-bg-aperture-c` | 16:9 | 손·작업 | 연결됨(png) — `?hero=aperture-c` |

> 3안은 글자 녹아웃 뒤에 깔리고 **차콜 80% 오버레이** 전제 → 미드톤이 약간 밝아도 됨.

**`hero-bg-aperture-a`**
- prompt: `Wide cinematic shot of a minimal premium furniture showroom, natural daylight raking across cabinetry and exposed hardware details, calm negative space, deep charcoal shadows, paper-warm walls, one subtle orange #ff671f object accent, architectural depth suitable for a text-knockout reveal, slightly brighter midtones, --ar 16:9` + 공통 네거티브
- alt: `미니멀 프리미엄 쇼룸 와이드 — 조리개 너머 드러날 공간 (가안 이미지)`

**`hero-bg-aperture-b`**
- prompt: `Wide shot of an artisan furniture production floor, workbenches, machinery, raw timber and hardware, warm industrious light, craftsmanship atmosphere, charcoal-and-amber palette, layered depth for a headline reveal, documentary realism, --ar 16:9` + 공통 네거티브
- alt: `자체 가구 생산 현장 와이드 — 자체생산 메시지와 호응 (가안 이미지)`

**`hero-bg-aperture-c`**
- prompt: `Wide detail of skilled hands assembling cabinet hardware, focused craftsmanship, warm directional light, deep charcoal background falling to shadow, tactile realism, layered depth, --ar 16:9` + 공통 네거티브
- alt: `하드웨어를 조립하는 손 — 현장감 와이드 (가안 이미지)`

---

## SECTION 02 · 정체성 pin — 채택 진행: **card + demo**

### card 변주 이미지 (`?identity=pin&idStage=card`) — 채택, 이미지 필요
> 파일: `public/images/identity/identity-card-<n>.png`. 4:5 풀카드 + 하단 텍스트 오버레이. 현재 `.ph` 해치 폴백.

| id | 비율 | intent | 상태 |
|---|---|---|---|
| `identity-card-1` | 4:5 | 독점 에이전트 — 스포트라이트 단독 하드웨어 | 프롬프트 발행 |
| `identity-card-2` | 4:5 | 정품의 공식 통로 — 정품 씰/개봉 무드 | 프롬프트 발행 |
| `identity-card-3` | 4:5 | 전국 오프라인 쇼룸 — 미니멀 쇼룸 컷 | 프롬프트 발행 |
| `identity-card-4` | 4:5 | 멀티브랜드 수입 — 큐레이션 플랫레이 | 프롬프트 발행 |
| `identity-card-5` | 4:5 | 자체 생산(김포) — 작업대 디테일 | 프롬프트 발행 |

- 프롬프트: `WORKLOG`/채팅 발행분 참조(공통 스파인 + 4:5 + 하단 텍스트 여백 + 정품 단정 금지).

### story 변주 (`?identity=pin&idStage=story`) — 풀블리드 감성 배경 (아래→위 덮기)
> 파일: `public/images/identity/identity-card-<n>.png` (현재 1~4 적용됨, 5 미생성→색 틴트 폴백). **감성 무드.**
> 주의: story·card 변주가 같은 `identity-card-N` 파일 공유(분리 원하면 경로 다시 나눔).

| id | 비율 | intent | 상태 |
|---|---|---|---|
| `identity-story-1` | 16:9 | 독점 에이전트 — 전문 대리인이 하드웨어를 직접 다룸 | 프롬프트 발행 |
| `identity-story-2` | 16:9 | 정품의 공식 통로 — 정품의 부드러운 손맛(소프트클로즈 서랍) | 프롬프트 발행 |
| `identity-story-3` | 16:9 | 전국 쇼룸 — 골든아워 쇼룸 진열·방문객 | 프롬프트 발행 |
| `identity-story-4` | 16:9 | 멀티브랜드 수입 — 여러 브랜드 하드웨어 라인업 | 프롬프트 발행 |
| `identity-story-5` | 16:9 | 자체 생산(김포) — 스마트 팩토리 내부(로봇암·CNC, 밝은 톤) | 프롬프트 발행 |

### demo 변주 (`?identity=pin&idStage=demo`) — 채택, 이미지 0
- 셀렉티브 폴리시: ③지도=실제 한국 SVG+핀 · ④로고=워드마크(텍스트) · ①②⑤=추상+모션. AI 이미지 불필요.

## SECTION 03~08 · (추후 슬롯 추가)
- 03~05 데모 / 06 약속 / 07 사회적 증거(로고월·후기) / 08 쇼룸(지점 지도) — 현재 전부 `.ph` placeholder. 디벨롭 진행하며 슬롯 등재.
---

## SECTION 05 · 약속 (횡스크롤 3막)

> ACT1 원산지 카드(3) · ACT2 sole agent 풀블리드(6) · ACT3 마무리(1). 전부 **생성형 = 가안·무드까지만**.
> 코드 연결: `data-ph` 슬롯(빗금 placeholder) → 실 에셋 생성 후 배경/`<img>`로 교체.
> ⚠️ 합성 제품을 "정품"이라 표기 금지 — 소재·공정·공간·손의 무드로. 공통 스파인(차콜·오렌지 림 한 줄·다크 네거티브) 따름.

### ACT1 — 원산지 카드 (`public/images/section5/<id>.png`, 3:2)
| id | 비율 | intent | 상태 |
|---|---|---|---|
| `origin-blum` | 3:2 | Blum 오스트리아 — 정밀 하드웨어 공정 | 후보 |
| `origin-agoform` | 3:2 | AGOFORM 독일 — 엔지니어링·소재 | 후보 |
| `origin-peka` | 3:2 | Peka 스위스 — 정밀·정돈 | 후보 |

- **`origin-blum`** · prompt: `Cinematic macro of precision Austrian furniture hardware, brushed steel runner with machined edges, deep charcoal background, a single thin warm orange #ff671f rim-light, matte premium finish, shallow DOF, fine grain, no text no logo no watermark, --ar 3:2` · alt: `오스트리아 정밀 하드웨어 공정 무드 (가안 이미지)`
- **`origin-agoform`** · prompt: `Cinematic macro of German furniture engineering components, drawer system parts in matte steel and dark polymer, deep charcoal background, one restrained orange #ff671f accent glint, premium editorial light, shallow DOF, fine grain, no text no logo, --ar 3:2` · alt: `독일 엔지니어링·소재 무드 (가안 이미지)`
- **`origin-peka`** · prompt: `Cinematic macro of Swiss precision storage hardware, clean machined fittings, ordered and exact, deep charcoal background, single orange #ff671f rim-light, matte premium, shallow DOF, fine grain, no text no logo, --ar 3:2` · alt: `스위스 정밀·정돈 무드 (가안 이미지)`

### ACT2 — sole agent 풀블리드 (`public/images/section5/<id>.png`, 풀패널 16:9 · 모바일 4:5)
| id | 비율 | intent | 상태 |
|---|---|---|---|
| `sole-agent-01` | 16:9 / 4:5 | 한국 독점 에이전트 · 공인 | 후보 |
| `sole-agent-02` | 16:9 / 4:5 | 정품 보장 · 유사품 차단 | 후보 |
| `sole-agent-03` | 16:9 / 4:5 | 프리미엄 멀티브랜드 수입 | 후보 |
| `sole-agent-04` | 16:9 / 4:5 | 가구 하드웨어 전문성 | 후보 |
| `sole-agent-05` | 16:9 / 4:5 | 전국 쇼룸 직접 체험 | 후보 |
| `sole-agent-06` | 16:9 / 4:5 | 자체 가구 생산 (김포) | 후보 |

- **`sole-agent-01`** · prompt: `Cinematic dark editorial mood of an official sole-agent channel — a single authenticated pathway, abstract corridor of light over matte metal, deep charcoal, one orange #ff671f rim accent, dark negative space for Korean headline at bottom-left, no text no logo, --ar 16:9` · alt: `한국 독점 에이전트 무드 (가안)`
- **`sole-agent-02`** · prompt: `Cinematic macro suggesting genuine-part protection, a sealed precision component under cool key light vs blurred imitation behind, deep charcoal, restrained orange #ff671f glint, dark negative space, no text no logo, --ar 16:9` · alt: `정품 보장·유사품 차단 무드 (가안)`
- **`sole-agent-03`** · prompt: `Cinematic arrangement of premium European furniture hardware and materials from multiple makers, matte metals and fine surfaces, deep charcoal, single orange #ff671f accent, editorial light, dark negative space, no text no logo, --ar 16:9` · alt: `프리미엄 멀티브랜드 수입 무드 (가안)`
- **`sole-agent-04`** · prompt: `Cinematic close-up of expert hands and machined furniture hardware on a workbench, sense of craft and field knowledge, deep charcoal, one orange #ff671f rim-light, shallow DOF, dark negative space, no text no logo, --ar 16:9` · alt: `가구 하드웨어 전문성 무드 (가안)`
- **`sole-agent-05`** · prompt: `Cinematic premium showroom interior in low warm light, cabinetry surfaces and shadow, inviting and tactile, deep charcoal palette, single orange #ff671f accent, dark negative space for headline, no text no logo, --ar 16:9` · alt: `전국 쇼룸 직접 체험 무드 (가안)`
- **`sole-agent-06`** · prompt: `Cinematic mood of an in-house furniture workshop in Gimpo, sawdust light beams, raw and finished pieces, deep charcoal, one orange #ff671f accent, editorial grain, dark negative space, no text no logo, --ar 16:9` · alt: `자체 가구 생산(김포) 무드 (가안)`

### ACT3 — 마무리 (`public/images/section5/closing.png`, 풀패널, 선택)
| id | 비율 | intent | 상태 |
|---|---|---|---|
| `closing` | 16:9 / 4:5 | 고객 공간에 정품의 기준 | 후보(선택) |

- **`closing`** · prompt: `Cinematic premium living space at golden hour, refined cabinetry with soft-close detail implied, calm and aspirational, deep charcoal-to-warm palette, single orange #ff671f accent, generous dark negative space for centered Korean headline, no text no logo, --ar 16:9` · alt: `고객 공간에 정품의 기준 — 마무리 무드 (가안)`

> 전부 생성형 = 무드 가안. 실 에셋 생성 후 코드의 `data-ph` 슬롯을 실제 배경/`<img>`로 교체.
