"use client";

import TefaOverviewHero from "./TefaOverviewHero";
import TefaAboutSection from "./TefaAboutSection";
import TefaPillarsSection from "./TefaPillarsSection";
import TefaPartnersSection from "./TefaPartnersSection";
import TefaCtaBanner from "./TefaCtaBanner";

export default function TefaOverviewClient() {
  return (
    <>
      {/* 1. Hero Overview */}
      <TefaOverviewHero />

      {/* 2. Tentang TEFA (Gedung & Quote) */}
      <TefaAboutSection />

      {/* 3. 4 Pilar Keunggulan TEFA */}
      <TefaPillarsSection />

      {/* 4. Mitra Industri (Logos Grid) */}
      <TefaPartnersSection />

      {/* 5. CTA Banner Konsultasi Proyek */}
      <TefaCtaBanner />
    </>
  );
}
