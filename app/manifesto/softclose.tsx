"use client";

import { VideoScrubStage } from "./VideoScrubStage";

/* =========================== [03] 신념① · 소프트클로즈 (버저닝 래퍼) =========================== */
export function SoftByVariant({ variant: _variant }: { variant: string }) {
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
            <VideoScrubStage
              frames="/videos/soft-close-frames/frame_"
              count={121}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
