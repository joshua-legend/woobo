import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ScrollTrigger 단일 등록 지점. 프리미엄 플러그인(DrawSVG/SplitText/Inertia)은
// 직접 구현으로 대체하므로 등록하지 않는다.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
