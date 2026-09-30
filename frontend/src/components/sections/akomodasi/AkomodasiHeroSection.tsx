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
      titleHighlight={t("akomodasi.heroTitle1", "Akomodasi")}
      titleHighlightColor="text-[#101828]"
      description={t("akomodasi.heroDesc")}
      studentImage="/images/tentang-kami/akomodasi/hero-student-akomodasi.png"
      studentAlt={`${t("akomodasi.breadcrumb", "Akomodasi")} SMK Telkom Sidoarjo`}
      ctaText={t("akomodasi.heroCta", "Jelajahi")}
      ctaHref="#biaya-hidup"
      imagePosition="right"
      isIntegratedArtwork={true}
      sectionPaddingClassName="pt-28 sm:pt-32 lg:pt-32 pb-16 lg:pb-24"
    />
  );
}
