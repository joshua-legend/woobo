"use client";

import { useCallback, useRef } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useReveal } from "@/hooks/useReveal";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CTA_HREF } from "@/lib/branches";
import type { Variants } from "@/lib/variants";
import { VariantSwitcher } from "@/components/lab/VariantSwitcher";
import { HeroByVariant } from "./heroes";
import { IdentityByVariant } from "./identities";
import { SoftByVariant } from "./softclose";
import { DoorByVariant } from "./door";
import { TrustByVariant } from "./trust";
import "./manifesto.css";

/* =========================== [06] 사회적 증거 (placeholder) =========================== */
function SocialProof() {
  return (
    <section
      className="section social"
      data-section="social"
      data-theme="light"
      data-screen-label="06 함께"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">06</span> / 함께
        </span>
        <h2 className="reveal-up d1">
          이미 많은 제작사와 고객이 Woobo와 함께합니다.
        </h2>
        <p className="lede reveal-up d1">
          현장에서 검증된 신뢰.{" "}
          <span className="todoinline">[TODO: 확인 — 레퍼런스·후기]</span>
        </p>
        <div
          className="social__logos ph reveal-up"
          data-ph="제작사 · 고객 로고월 — placeholder (실물 교체)"
        />
        <div className="social__quotes">
          <blockquote className="social__quote reveal-up d1">
            <p>“[TODO: 확인 — 고객/제작사 후기 문구]”</p>
            <cite>제작사 OO · [TODO]</cite>
          </blockquote>
          <blockquote className="social__quote reveal-up d2">
            <p>“[TODO: 확인 — 고객/제작사 후기 문구]”</p>
            <cite>고객 OO · [TODO]</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/* =========================== [07] 전국 쇼룸 (CTA) =========================== */
type ShowroomCard = {
  delay: string;
  name: string;
  tag: string;
  meta: React.ReactNode;
};

const SHOWROOM_CARDS: ShowroomCard[] = [
  {
    delay: "d1",
    name: "김포 본점",
    tag: "FLAGSHIP",
    meta: (
      <>
        대규모 쇼룸 + 가구 직접 생산
        <br />
        <span className="todo">[TODO: 확인 — 김포 주소·전화]</span>
      </>
    ),
  },
  {
    delay: "d2",
    name: "용인점",
    tag: "SHOWROOM",
    meta: (
      <>
        <span className="ph-line">T. 031-274-4241</span>
        <br />
        <span className="todo">[TODO: 확인 — 용인 주소]</span>
      </>
    ),
  },
  {
    delay: "d3",
    name: "부산지사",
    tag: "SHOWROOM",
    meta: (
      <>
        부산 동래구 안락동 459-29
        <br />
        <span className="ph-line">T. 051-323-2532</span>
      </>
    ),
  },
];

function Showroom() {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const showLine = useCallback(() => {
    lineRef.current?.classList.add("in");
  }, []);
  useInViewOnce(lineRef, showLine, { amount: 0.5 });

  const pop = useCallback(() => {
    const el = ctaRef.current;
    if (!el || reduce) return;
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }, [reduce]);

  return (
    <section
      className="section section--dark showroom"
      id="showroom"
      data-section="showroom"
      data-theme="dark"
      data-screen-label="07 CTA"
    >
      <div className="inner">
        <span className="eyebrow reveal-up">
          <span className="num">07</span> / 다음 움직임
        </span>
        <h2 className="reveal-up d1">직접 만져보고 결정하세요 — 전국 쇼룸에서.</h2>
        <p className="lede reveal-up d1">
          <strong>방문 예약제</strong>로 운영합니다.
        </p>

        <div className="branches">
          {SHOWROOM_CARDS.map((c) => (
            <div key={c.name} className={`showroom-card reveal-up ${c.delay}`}>
              <div className="bh">
                <span className="name">{c.name}</span>
                <span className="tag">{c.tag}</span>
              </div>
              <div className="meta">{c.meta}</div>
              <a className="book" href={CTA_HREF.booking}>
                방문 예약 <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </div>

        <div
          className="ph map reveal-up"
          data-ph="전국 지점 지도 · 16:9 (지도 임베드/이미지 교체)"
        />

        <div className="actions reveal-up">
          <a
            className="btn btn--primary"
            data-cta="book"
            href={CTA_HREF.booking}
            ref={ctaRef}
            onClick={pop}
          >
            쇼룸 방문 예약 <span className="arrow">→</span>
          </a>
          <a className="btn btn--secondary" href={CTA_HREF.quote}>
            견적·상담 요청
          </a>
          <a className="btn btn--ghost" href={CTA_HREF.catalog}>
            카탈로그 받기 ↓
          </a>
        </div>

        <div className={`closeline${reduce ? " in" : ""}`} ref={lineRef}>
          <i />
        </div>
        <p className="signoff">
          <b>Woobo</b> · Blum 한국 독점 에이전트 · moving ideas
        </p>
      </div>
    </section>
  );
}

/* =========================== PAGE =========================== */
export default function ManifestoClient({ variants }: { variants: Variants }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="route-manifesto" ref={rootRef}>
      <SiteHeader
        brand="우보"
        sub="Blum 한국 독점 에이전트"
        ctaLabel="쇼룸 방문 예약 →"
        ctaHref="#showroom"
      />
      <main id="top">
        <HeroByVariant variant={variants.hero} />
        <IdentityByVariant variant={variants.identity} stage={variants.idStage} />
        <SoftByVariant variant={variants.soft} />
        <DoorByVariant variant={variants.door} />
        <TrustByVariant
          variant={variants.trust}
          fx={{
            line: variants.fxLine === "on",
            nodes: variants.fxNodes === "on",
            stagger: variants.fxStagger === "on",
            hover: variants.fxHover === "on",
            draw: variants.fxDraw === "on",
            glow: variants.fxGlow === "on",
            pin: variants.fxPin === "on",
            neon: variants.fxNeon === "on",
          }}
        />
        <SocialProof />
        <Showroom />
      </main>
      <VariantSwitcher current={variants} />
    </div>
  );
}
