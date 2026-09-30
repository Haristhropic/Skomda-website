"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function AkomodasiHeroSection() {
  const { t } = useLanguage();

  return (
    <PageHeroSection
      breadcrumbs={[
        { label: t("nav.aboutUs", "Tentang Kami"), href: "/tentang-kami/profil-sekolah" },
        { label: t("akomodasi.breadcrumb", "Akomodasi"), href: "/tentang-kami/akomodasi" },
      ]}
      titlePrefix={t("akomodasi.heroTitle1", "Akomodasi")}
      titleHighlight={t("akomodasi.heroTitle2", "Siswa")}
      titleHighlightColor="text-[#bc0c11]"
      showAccentBar={true}
      description={t(
        "akomodasi.heroDesc",
        "Informasi akomodasi dan estimasi biaya hidup siswa SMK Telkom Sidoarjo secara transparan. Rekomendasi kos, asrama, dan hunian aman serta nyaman di sekitar lingkungan sekolah."
      )}
      studentImage="/images/tentang-kami/akomodasi/hero-student-akomodasi.png"
      studentAlt={`${t("akomodasi.breadcrumb", "Akomodasi")} SMK Telkom Sidoarjo`}
      ctaText={t("akomodasi.heroCta", "Jelajahi")}
      ctaHref="#biaya-hidup"
      imagePosition="right"
      isIntegratedArtwork={true}
    />
  );
}
