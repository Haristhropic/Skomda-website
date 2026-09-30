"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function HubIndustriHeroSection() {
  const { t } = useLanguage();

  return (
    <PageHeroSection
      breadcrumbs={[
        { label: t("nav.aboutUs", "Tentang Kami"), href: "/tentang-kami/profil-sekolah" },
        { label: t("hubIndustri.breadcrumb", "Hubungan Industri"), href: "/tentang-kami/hub-industri" },
      ]}
      titlePrefix={t("hubIndustri.heroTitle1", "Hubungan")}
      titleHighlight={t("hubIndustri.heroTitle2", "Industri")}
      titleHighlightColor="text-[#e7000b]"
      showAccentBar={true}
      description={t(
        "hubIndustri.heroDesc",
        "Menghubungkan peserta didik dengan ekosistem industri terdepan melalui sinkronisasi kurikulum, program magang intensif, guru tamu praktisi, dan rekrutmen kerja langsung."
      )}
      studentImage="/images/tentang-kami/hub-industri/hero-student-hub-industri.png"
      studentAlt={`${t("hubIndustri.breadcrumb", "Hubungan Industri")} SMK Telkom Sidoarjo`}
      ctaText={t("hubIndustri.heroCta", "Jelajahi")}
      ctaHref="#mitra-industri"
      imagePosition="right"
      isIntegratedArtwork={true}
      imageContainerClassName="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] aspect-[1179/1334]"
      imageClassName="drop-shadow-xl"
    />
  );
}
