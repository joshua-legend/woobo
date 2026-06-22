"use client";

import { Fragment, useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const GEO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/* 가라오케 문구 — flag=원산지 강조, br=줄바꿈, c=해당 나라 id */
const WORDS: { t: string; flag?: string; br?: boolean; c?: string }[] = [
  { t: "Made" }, { t: "in" }, { t: "Europe" }, { t: "—", br: true },
  { t: "authentic" }, { t: "to" }, { t: "the" }, { t: "origin.", br: true },
  { t: "Blum", flag: "🇦🇹", c: "at" }, { t: "·" }, { t: "AGOFORM", flag: "🇩🇪", c: "de" },
  { t: "·" }, { t: "Peka", flag: "🇨🇭", c: "ch", br: true },
  { t: "원산지" }, { t: "그대로," }, { t: "one" }, { t: "trusted" }, { t: "channel." },
];
const N = WORDS.length;
const at = (i: number) => (i / (N - 1)) * 0.85;
/* 브랜드 단어 인덱스 → 나라 임계값 */
const COUNTRY_AT: Record<string, number> = {};
WORDS.forEach((w, i) => {
  if (w.c) COUNTRY_AT[w.c] = at(i);
});

const COUNTRIES = [
  { id: "at", name: "Blum · 오스트리아", code: "AT", coord: [14.3, 47.6] },
  { id: "de", name: "AGOFORM · 독일", code: "DE", coord: [10.0, 51.0] },
  { id: "ch", name: "Peka · 스위스", code: "CH", coord: [8.2, 46.8] },
] as const;

const GEO_STYLE = {
  default: { fill: "#16130d", stroke: "#2c2920", strokeWidth: 0.4, outline: "none" },
  hover: { fill: "#1d1a12", stroke: "#2c2920", strokeWidth: 0.4, outline: "none" },
  pressed: { fill: "#1d1a12", outline: "none" },
} as const;

const PERIOD = 6600;
const FILL = 3600;
const FLY_AT = 4400;

export default function MapSample() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x + 70) % PERIOD), 70);
    return () => clearInterval(id);
  }, []);

  const a1 = Math.min(t / FILL, 1);
  const fly = t >= FLY_AT;

  return (
    <div className="ms-wrap">
      <style>{CSS}</style>
      <h1 className="ms-h1">ACT1 — 유럽맵 + 가라오케 결합 샘플</h1>
      <p className="ms-note">
        문장이 채워지다 <b>브랜드 단어</b>가 켜지면 그 나라에 <b>도장</b>이 찍히고, 다
        차면 <b>비행기</b>가 한국으로 → ACT2. 자동 반복.
      </p>

      <div className="ms-stage">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [11, 50], scale: 1000 }}
          width={960}
          height={540}
          className="ms-map"
        >
          <Geographies geography={GEO}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} style={GEO_STYLE} />
              ))
            }
          </Geographies>

          {COUNTRIES.map((c) => (
            <Marker
              key={c.id}
              coordinates={c.coord as [number, number]}
              className={a1 >= COUNTRY_AT[c.id] ? "ms-on" : ""}
            >
              <text className="ms-lbl" y={-24} textAnchor="middle">
                {c.name}
              </text>
              <circle r={4.5} className="ms-dot" />
              <g className="ms-stamp">
                <circle r={17} className="ms-ring" />
                <circle r={17} className="ms-ring ms-ring--inner" />
                <text className="ms-code" dy="4" textAnchor="middle">
                  {c.code}
                </text>
              </g>
            </Marker>
          ))}
        </ComposableMap>

        <div className="ms-scrim" />

        <div className={`ms-plane${fly ? " fly" : ""}`} aria-hidden>
          ✈️
        </div>
        <div className={`ms-korea${fly ? " show" : ""}`}>→ 한국 · ACT2</div>

        <div className="ms-kara">
          <p>
            {WORDS.map((w, i) => {
              const lit = a1 >= at(i);
              return (
                <Fragment key={i}>
                  <span className={`ms-w${w.flag ? " b" : ""}${lit ? " lit" : ""}`}>
                    {w.t}
                    {w.flag ? <span className="fl"> {w.flag}</span> : null}{" "}
                  </span>
                  {w.br ? <br /> : null}
                </Fragment>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

const CSS = `
:root{--or:#ff671f;--tip:cubic-bezier(.34,1.56,.64,1);--e:cubic-bezier(.16,1,.3,1)}
.ms-wrap{min-height:100vh;background:#0c0b09;color:#f4f1ec;font-family:system-ui,'Pretendard',sans-serif;padding:26px 20px 50px;margin:0 auto;max-width:1040px}
.ms-h1{font-size:17px;margin:0 0 6px}
.ms-note{color:#9a958a;font-size:13px;margin:0 0 18px}
.ms-stage{position:relative;border-radius:16px;overflow:hidden;border:1px solid #23211b;background:radial-gradient(120% 100% at 50% 25%,#121009,#000 75%)}
.ms-map{width:100%;height:auto;display:block}

.ms-lbl{fill:#cfc8ba;font:600 12px sans-serif;opacity:0;transition:opacity .3s var(--e)}
.ms-on .ms-lbl{opacity:1}
.ms-dot{fill:#3a382f;transition:fill .3s var(--e)}
.ms-on .ms-dot{fill:var(--or)}
.ms-stamp{opacity:0;transform:scale(1.7) rotate(-13deg);transform-box:fill-box;transform-origin:center;transition:none}
.ms-on .ms-stamp{opacity:1;transform:scale(1) rotate(-6deg);transition:transform .42s var(--tip),opacity .25s linear}
.ms-ring{fill:none;stroke:var(--or);stroke-width:2}
.ms-ring--inner{r:13;stroke-width:1;opacity:.55}
.ms-code{fill:var(--or);font:800 11px sans-serif;letter-spacing:.04em}

.ms-scrim{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,6,4,.92),rgba(6,6,4,.05) 52%);pointer-events:none;z-index:2}

.ms-plane{position:absolute;left:44%;top:46%;font-size:28px;opacity:0;transform:translate(0,0) rotate(10deg);transition:none;z-index:4;filter:drop-shadow(0 4px 8px rgba(0,0,0,.5))}
.ms-plane.fly{opacity:1;transform:translate(56vw,-13vh) rotate(16deg);transition:transform 1.5s var(--e),opacity .35s linear}
.ms-korea{position:absolute;right:18px;top:38%;font:800 14px sans-serif;color:var(--or);opacity:0;transform:translateX(12px);transition:opacity .5s var(--e) .3s,transform .5s var(--e) .3s;z-index:4}
.ms-korea.show{opacity:1;transform:translateX(0)}

.ms-kara{position:absolute;left:clamp(20px,5%,52px);right:clamp(20px,5%,52px);bottom:clamp(22px,7%,48px);max-width:700px;z-index:3}
.ms-kara p{margin:0;font:800 clamp(19px,2.7vw,36px)/1.32 'Pretendard',sans-serif;word-break:keep-all}
.ms-w{color:#3c3930;opacity:.45;transition:color .3s var(--e),opacity .3s var(--e)}
.ms-w.lit{color:#f4f1ec;opacity:1}
.ms-w.b{font-weight:800}
.ms-w.b.lit{color:var(--or);text-shadow:0 0 16px rgba(255,103,31,.35)}
.ms-w .fl{font-size:.72em;opacity:0;transition:opacity .3s}
.ms-w.b.lit .fl{opacity:1}
`;
