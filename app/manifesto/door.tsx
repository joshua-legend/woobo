"use client";

import { VideoScrubStage } from "./VideoScrubStage";

/* =========================== [04] 도어 (무공구 + TIP-ON 통합) =========================== */
export function DoorByVariant({ variant: _variant }: { variant: string }) {
  return (
    <section
      className="section section--dark demo door flip"
      id="door"
      data-section="door"
      data-theme="dark"
      data-screen-label="04 도어"
    >
      <div className="inner">
        <div className="grid">
          <div className="demo__copy">
            <span className="eyebrow reveal-up">
              <span className="num">04</span> / 신념 · 문의 완성
            </span>
            <h3 className="reveal-up d1">공구 없이 달고, 손잡이 없이 연다.</h3>
            <p className="lede reveal-up d1">
              무공구 클립으로 딸깍 장착, 톡 누르면 열리는 TIP-ON.{" "}
              <strong>시공도 디자인도 자유롭게.</strong>
            </p>
            <a className="microcta reveal-up d3" href="#showroom">
              전국 쇼룸에서 직접 열어보세요 <span className="arrow">→</span>
            </a>
          </div>
          <div className="reveal-up d1">
            <div className="door__stagewrap">
              <VideoScrubStage
                frames="/videos/door-frames/frame_"
                count={121}
                leftLabel="닫힘"
                rightLabel="열림"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
