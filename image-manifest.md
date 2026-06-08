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

## SECTION 02~08 · (추후 슬롯 추가)
- 02 정체성 핀 / 03~05 데모 / 06 약속 / 07 사회적 증거(로고월·후기) / 08 쇼룸(지점 지도) — 현재 전부 `.ph` placeholder. 디벨롭 진행하며 슬롯 등재.
