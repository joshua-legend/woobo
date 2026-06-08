// 전국 쇼룸 지점 데이터 (단일 소스). 카드 마크업은 디자인별로 다르나 데이터는 공유.
// 미확정값은 null + todo 플래그 → UI 에서 [TODO: 확인] placeholder 로 렌더.

export type Branch = {
  id: string;
  name: string; // 김포 본점
  city: string; // 김포
  tag: string; // FLAGSHIP / SHOWROOM
  desc: string;
  address: string | null;
  phone: string | null;
  addressTodo?: boolean;
  phoneTodo?: boolean;
};

export const BRANCHES: Branch[] = [
  {
    id: "gimpo",
    name: "김포 본점",
    city: "김포",
    tag: "FLAGSHIP",
    desc: "대규모 쇼룸 + 가구 직접 생산. 하드웨어의 쓰임을 가장 가까이서 확인.",
    address: null,
    phone: null,
    addressTodo: true, // 경기 김포시 양촌읍 유현삭시로120번길 100 (표기 확인 필요)
    phoneTodo: true,
  },
  {
    id: "yongin",
    name: "용인점",
    city: "용인",
    tag: "SHOWROOM",
    desc: "수도권 남부 쇼룸. 실물 확인과 제작 상담.",
    address: null,
    phone: "031-274-4241",
    addressTodo: true, // 고매로253번길 4 (전체 주소 확인 필요)
  },
  {
    id: "busan",
    name: "부산지사",
    city: "부산",
    tag: "SHOWROOM",
    desc: "영남권 거점. 정품 하드웨어 직접 체험.",
    address: "부산 동래구 안락동 459-29",
    phone: "051-323-2532",
  },
];

// 미확정 CTA 채널(예약/견적/카탈로그) — 실제 폼·링크 연결 전 placeholder.
// TODO: 확인 — 예약/상담/카탈로그 실제 채널.
export const CTA_HREF = {
  booking: "#", // TODO
  quote: "#", // TODO
  catalog: "#", // TODO
} as const;
