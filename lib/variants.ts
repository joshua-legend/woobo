// 공용 섹션 버저닝 레지스트리 (단일 소스).
// 섹션마다 여러 인터랙션 변주 후보를 두고, URL 쿼리로 하나를 선택해 보여준다.
// 검수 단계 도구 — 변주 확정 시 스위처만 제거하면 됨. 새 섹션은 키만 추가.

export type SectionConfig = {
  label: string; // 스위처에 표시될 한글 라벨
  options: readonly string[]; // 변주 키 목록 (첫 항목/ default 가 기본)
  default: string;
};

export const SECTION_VARIANTS = {
  hero: {
    label: "히어로",
    options: ["kinetic", "slot", "aperture-a", "aperture-b", "aperture-c"],
    default: "kinetic",
  },
  identity: {
    label: "정체성",
    options: ["pin", "stamp", "marquee"],
    default: "pin",
  },
  idStage: {
    label: "정체성 우측(pin)",
    options: ["card", "demo", "image", "diagram", "story"],
    default: "card",
  },
  soft: {
    label: "신념① 소프트",
    options: ["video", "scrub", "throw", "compare", "sequence"],
    default: "video",
  },
  door: {
    label: "도어(4+5)",
    options: ["click", "hotspots", "scrub"],
    default: "click",
  },
  trust: {
    label: "약속(신뢰)",
    options: ["fusion", "flow", "stamp", "grid"],
    default: "fusion",
  },
  // fusion 효과 on/off 토글 (퓨전일 때만 적용)
  fxLine: { label: "fx·선draw", options: ["on", "off"], default: "on" },
  fxNodes: { label: "fx·노드점등", options: ["off", "on"], default: "off" },
  fxStagger: { label: "fx·스태거", options: ["on", "off"], default: "on" },
  fxHover: { label: "fx·호버", options: ["on", "off"], default: "on" },
  fxDraw: { label: "fx·아이콘draw", options: ["off", "on"], default: "off" },
  fxGlow: { label: "fx·허브글로우", options: ["on", "off"], default: "on" },
  fxPin: { label: "fx·핀", options: ["off", "on"], default: "off" },
  fxNeon: { label: "fx·네온", options: ["on", "off"], default: "on" },
} as const satisfies Record<string, SectionConfig>;

export type SectionKey = keyof typeof SECTION_VARIANTS;
export type Variants = { [K in SectionKey]: string };

type RawParams = Record<string, string | string[] | undefined>;

/** searchParams → 검증된 변주 맵(잘못된 값은 default 로 폴백). */
export function resolveVariants(searchParams: RawParams): Variants {
  const out = {} as Variants;
  for (const key of Object.keys(SECTION_VARIANTS) as SectionKey[]) {
    const cfg = SECTION_VARIANTS[key];
    const raw = searchParams[key];
    const val = Array.isArray(raw) ? raw[0] : raw;
    out[key] =
      val && (cfg.options as readonly string[]).includes(val)
        ? val
        : cfg.default;
  }
  return out;
}
