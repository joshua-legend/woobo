import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ScrollTrigger 단일 등록 지점. 프리미엄 플러그인(DrawSVG/SplitText/Inertia)은
// 직접 구현으로 대체하므로 등록하지 않는다.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // 모바일 인앱 브라우저(카톡 등) 주소창 접힘/펼침 = 세로 리사이즈만 발생.
  // 그때마다 refresh 하면 sticky 핀 기준점이 어긋나 스크롤이 한 칸 튄다.
  // ignoreMobileResize: 모바일 세로 리사이즈는 무시(가로 변할 때만 refresh).
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
