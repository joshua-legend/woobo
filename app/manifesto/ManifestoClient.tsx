"use client";

import { useRef } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useReveal } from "@/hooks/useReveal";
import type { Variants } from "@/lib/variants";
import { HeroByVariant } from "./heroes";
import { IdentityByVariant } from "./identities";
import { SoftByVariant } from "./softclose";
import { DoorByVariant } from "./door";
import { TrustByVariant } from "./trust";
import { BrandsByVariant } from "./brands";
import { ShowroomSection } from "./showrooms";
import { HeroIntro } from "./HeroIntro";
import "./manifesto.css";

/* =========================== PAGE =========================== */
export default function ManifestoClient({ variants }: { variants: Variants }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="route-manifesto" ref={rootRef}>
      <HeroIntro />
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
        <TrustByVariant variant={variants.trust} />
        <BrandsByVariant variant={variants.brands} />
        <ShowroomSection />
      </main>
    </div>
  );
}
