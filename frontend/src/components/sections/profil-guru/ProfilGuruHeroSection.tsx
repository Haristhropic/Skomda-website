"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function ProfilGuruHeroSection() {
  const { t } = useLanguage();

  return (
    <PageHeroSection
      breadcrumbs={[
        { label: t("nav.aboutUs", "Tentang Kami"), href: "/tentang-kami/profil-sekolah" },
        { label: t("profilGuru.breadcrumb", "Profil Guru"), href: "/tentang-kami/profil-guru" },
      ]}
      titleHighlight={t("profilGuru.heroTitle1", "Profil Guru")}
      titleHighlightColor="text-[#101828]"
      description={t("profilGuru.heroDesc")}
      studentImage="/images/tentang-kami/profil-guru/hero-student-guru.png"
      studentAlt={`${t("profilGuru.breadcrumb", "Profil Guru")} SMK Telkom Sidoarjo`}
      ctaText={t("profilGuru.heroCta", "Jelajahi")}
      ctaHref="#kepala-sekolah-section"
      imagePosition="right"
      isIntegratedArtwork={true}
      imageContainerClassName="w-full max-w-[520px] sm:max-w-[580px] lg:max-w-[620px] aspect-[1.12/1]"
      sectionPaddingClassName="pt-28 sm:pt-32 lg:pt-30 pb-16 lg:pb-24"
    />
  );
}
