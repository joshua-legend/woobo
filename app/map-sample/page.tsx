"use client";

import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const GEO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COUNTRIES = [
  { id: "at", name: "Blum · 오스트리아", code: "AT", coord: [14.3, 47.6], order: 1 },
  { id: "de", name: "AGOFORM · 독일", code: "DE", coord: [10.0, 51.0], order: 2 },
  { id: "ch", name: "Peka · 스위스", code: "CH", coord: [8.2, 46.8], order: 3 },
] as const;

const GEO_STYLE = {
  default: { fill: "#16130d", stroke: "#2c2920", strokeWidth: 0.4, outline: "none" },
  hover: { fill: "#1d1a12", stroke: "#2c2920", strokeWidth: 0.4, outline: "none" },
  pressed: { fill: "#1d1a12", outline: "none" },
} as const;

export default function MapSample() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 6), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ms-wrap">
      <style>{CSS}</style>
      <h1 className="ms-h1">ACT1 지도 샘플 — react-simple-maps (유럽만)</h1>
      <p className="ms-note">
        나라별로 점등 + <b>도장</b>이 찍히고, 다 찍히면 <b>비행기</b>가 우측(한국)으로
        날아가며 ACT2로 핸드오프. 자동 반복(1.2s 스텝).
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
              className={step >= c.order ? "ms-on" : ""}
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

        <div className={`ms-plane${step >= 4 ? " fly" : ""}`} aria-hidden>
          ✈️
        </div>
        <div className={`ms-korea${step >= 4 ? " show" : ""}`}>
          → 한국 · ACT2
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
.ms-stage{position:relative;border-radius:16px;overflow:hidden;border:1px solid #23211b;
  background:radial-gradient(120% 100% at 50% 30%,#121009,#000 75%)}
.ms-map{width:100%;height:auto;display:block}

/* 마커 */
.ms-lbl{fill:#cfc8ba;font:600 12px sans-serif;opacity:0;transition:opacity .3s var(--e)}
.ms-on .ms-lbl{opacity:1}
.ms-dot{fill:#3a382f;transition:fill .3s var(--e)}
.ms-on .ms-dot{fill:var(--or)}
/* 도장 */
.ms-stamp{opacity:0;transform:scale(1.7) rotate(-13deg);transform-box:fill-box;transform-origin:center;transition:none}
.ms-on .ms-stamp{opacity:1;transform:scale(1) rotate(-6deg);transition:transform .42s var(--tip),opacity .25s linear}
.ms-ring{fill:none;stroke:var(--or);stroke-width:2}
.ms-ring--inner{r:13;stroke-width:1;opacity:.55}
.ms-code{fill:var(--or);font:800 11px sans-serif;letter-spacing:.04em}

/* 비행기 + 한국 라벨 */
.ms-plane{position:absolute;left:44%;top:48%;font-size:28px;opacity:0;transform:translate(0,0) rotate(10deg);transition:none;filter:drop-shadow(0 4px 8px rgba(0,0,0,.5))}
.ms-plane.fly{opacity:1;transform:translate(58vw,-12vh) rotate(16deg);transition:transform 1.5s var(--e),opacity .35s linear}
.ms-korea{position:absolute;right:18px;top:50%;transform:translateY(-50%) translateX(12px);font:800 14px sans-serif;color:var(--or);opacity:0;transition:opacity .5s var(--e) .3s,transform .5s var(--e) .3s}
.ms-korea.show{opacity:1;transform:translateY(-50%) translateX(0)}
`;
