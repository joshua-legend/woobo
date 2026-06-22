"use client";

import { useEffect, useState } from "react";

const ITEMS = [
  { no: "01", t: "Blum 한국 독점 에이전트", d: "정품의 공식 통로 · sole agent", img: "sole-agent-01" },
  { no: "02", t: "정품 보장 (유사품 차단)", d: "A/S · 부품 통로 확보", img: "sole-agent-02" },
  { no: "03", t: "프리미엄 멀티브랜드 수입", d: "유럽 하드웨어 · 소재 전문", img: "sole-agent-03" },
  { no: "04", t: "가구 하드웨어 전문성", d: "제작 현장을 아는 상담", img: "sole-agent-04" },
  { no: "05", t: "전국 쇼룸 직접 체험", d: "실물 확인 · 방문 예약제", img: "sole-agent-05" },
  { no: "06", t: "자체 가구 생산 (김포 본점)", d: "하드웨어부터 완제품까지", img: "sole-agent-06" },
];

const FX = [
  { v: "A", label: "A · 페이드+업", sub: "번호→제목→부제 순차" },
  { v: "B", label: "B · 라인마스크", sub: "제목 줄단위 슬라이드업" },
  { v: "C", label: "C · Ken Burns", sub: "배경 천천히 줌" },
  { v: "D", label: "D · 밑줄 드로잉", sub: "제목 밑줄 좌→우" },
  { v: "E", label: "E · 추천조합", sub: "A + C + D" },
];

export default function Act2Sample() {
  const [fx, setFx] = useState("E");
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setNonce((x) => x + 1), 3600);
    return () => clearInterval(id);
  }, []);
  const item = ITEMS[nonce % ITEMS.length];

  return (
    <div className="a2-wrap">
      <style>{CSS}</style>
      <h1 className="a2-h1">ACT2 슬라이드 전환 효과 — 샘플</h1>
      <p className="a2-note">버튼으로 효과 전환. 항목이 슬라이드로 들어올 때 재생(3.6초마다 다음 항목 자동 반복). ↻로 즉시 다시.</p>
      <div className="a2-btns">
        {FX.map((f) => (
          <button
            key={f.v}
            className={`a2-btn${fx === f.v ? " on" : ""}`}
            onClick={() => {
              setFx(f.v);
              setNonce((x) => x + 1);
            }}
          >
            {f.label}
            <small>{f.sub}</small>
          </button>
        ))}
        <button className="a2-replay" onClick={() => setNonce((x) => x + 1)}>
          ↻ 다시
        </button>
      </div>

      <div className="a2-stage">
        {/* key=nonce 로 리마운트 → 애니메이션 재생 */}
        <div key={nonce} className={`a2-panel fx-${fx}`}>
          <div
            className="bg"
            style={{ backgroundImage: `url(/images/section5/${item.img}.png)` }}
          />
          <div className="scrim" />
          <div className="txt">
            <span className="no">{item.no} / 06</span>
            <span className="ttl-mask">
              <h3 className="ttl">{item.t}</h3>
            </span>
            <span className="ttl-underline" />
            <p className="ds">{item.d}</p>
          </div>
        </div>
      </div>
      <p className="a2-note" style={{ marginTop: 12 }}>
        추천: <b>E (페이드+업 · Ken Burns · 밑줄)</b>. 과하면 개별(A/C/D)로 줄이면 됩니다.
      </p>
    </div>
  );
}

const CSS = `
:root{--or:#ff671f;--e:cubic-bezier(.16,1,.3,1);--tip:cubic-bezier(.34,1.56,.64,1)}
.a2-wrap{min-height:100vh;background:#0c0b09;color:#f4f1ec;font-family:system-ui,'Pretendard',sans-serif;padding:26px 20px 50px;margin:0 auto;max-width:1040px}
.a2-h1{font-size:17px;margin:0 0 6px}.a2-note{color:#9a958a;font-size:13px;margin:0 0 16px}
.a2-btns{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.a2-btn{cursor:pointer;border:1px solid #34322b;background:#16140f;color:#cfc8ba;padding:9px 13px;border-radius:12px;font:600 12.5px/1.2 inherit;text-align:left}
.a2-btn.on{background:var(--or);border-color:var(--or);color:#fff}
.a2-btn small{display:block;font-weight:400;font-size:10px;opacity:.82;margin-top:2px}
.a2-replay{cursor:pointer;border:1px solid #34322b;background:transparent;color:#9a958a;padding:9px 13px;border-radius:12px;font:600 12px inherit}

.a2-stage{position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;background:#000;border:1px solid #23211b}
.a2-panel{position:absolute;inset:0;animation:slideIn .7s var(--e) both}
@keyframes slideIn{from{opacity:0;transform:translateX(6%)}to{opacity:1;transform:none}}
.a2-panel .bg{position:absolute;inset:0;background-size:cover;background-position:center}
.a2-panel .scrim{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,6,4,.86),rgba(6,6,4,.12) 55%,rgba(6,6,4,.4))}
.a2-panel .txt{position:absolute;left:clamp(22px,6%,80px);right:clamp(22px,6%,80px);bottom:clamp(60px,16%,130px)}
.a2-panel .no{display:block;font:700 12px/1 ui-monospace;letter-spacing:.1em;color:var(--or)}
.a2-panel .ttl-mask{display:block;margin:10px 0 0}
.a2-panel .ttl{margin:0;font:800 clamp(26px,4.4vw,50px)/1.12 'Pretendard',sans-serif;word-break:keep-all}
.a2-panel .ttl-underline{display:block;height:3px;width:84px;margin:12px 0 0;background:var(--or);opacity:0;transform-origin:left}
.a2-panel .ds{margin:10px 0 0;font:500 clamp(13px,1.6vw,16px)/1.4 inherit;color:#d9d3c7}

/* A & E — 페이드+업 stagger */
.fx-A .no,.fx-E .no{animation:fadeUp .55s var(--e) .12s both}
.fx-A .ttl-mask,.fx-E .ttl-mask{animation:fadeUp .55s var(--e) .26s both}
.fx-A .ds,.fx-E .ds{animation:fadeUp .55s var(--e) .42s both}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}

/* B — 타이틀 라인마스크 */
.fx-B .ttl-mask{overflow:hidden}
.fx-B .ttl{animation:maskUp .7s var(--e) .2s both}
@keyframes maskUp{from{transform:translateY(110%)}to{transform:translateY(0)}}
.fx-B .no,.fx-B .ds{animation:fade .6s var(--e) .4s both}
@keyframes fade{from{opacity:0}to{opacity:1}}

/* C & E — Ken Burns 줌 */
.fx-C .bg,.fx-E .bg{animation:ken 4.2s ease-out both}
@keyframes ken{from{transform:scale(1.0)}to{transform:scale(1.12)}}

/* D & E — 밑줄 드로잉 */
.fx-D .ttl-underline,.fx-E .ttl-underline{opacity:1;animation:draw .6s var(--e) .46s both}
@keyframes draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
`;
