"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function TefaOverviewHero() {
  const { lang, language } = useLanguage();
  const isEn = lang === "EN" || language === "en";

  return (
    <PageHeroSection
      breadcrumbs={[
        {
          label: "Teaching Factory",
          href: "/tefa",
        },
        {
          label: "Overview",
          href: "/tefa/overview",
        },
      ]}
      titlePrefix="Teaching"
      titleHighlight="Factory"
      titleHighlightColor="text-[#bc0c11]"
      description={
        isEn
          ? "Teaching Factory at SMK Telkom Sidoarjo bridges vocational education with industrial standards. Students engage directly in real-world software development, network infrastructure services, and commercial digital solutions under professional supervision."
          : "Teaching Factory di SMK Telkom Sidoarjo menjadi jembatan nyata antara kurikulum sekolah dan standar industri. Siswa terlibat langsung dalam pengembangan produk perangkat lunak, instalasi infrastruktur jaringan, serta solusi digital komersial di bawah bimbingan praktisi profesional."
      }
      studentImage="/images/tefa/tefa-hero-banner.png"
      studentAlt={
        isEn
          ? "Teaching Factory Student SMK Telkom Sidoarjo"
          : "Siswa Teaching Factory SMK Telkom Sidoarjo"
      }
      ctaText={isEn ? "Explore Products & Services" : "Jelajahi Produk & Jasa"}
      ctaHref="/tefa/produk"
      imagePosition="right"
      isIntegratedArtwork={true}
    />
  );
}

