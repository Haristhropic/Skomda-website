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
      titlePrefix={t("profilGuru.heroTitle1", "Profil")}
      titleHighlight={t("profilGuru.heroTitle2", "Guru")}
      titleHighlightColor="text-[#bc0c11]"
      showAccentBar={true}
      description={t(
        "profilGuru.heroDesc",
        "Didukung oleh tenaga pendidik profesional berdedikasi dan instruktur praktisi bersertifikasi industri yang berkomitmen membimbing potensi terbaik setiap siswa."
      )}
      studentImage="/images/tentang-kami/profil-guru/hero-student-guru.png"
      studentAlt={`${t("profilGuru.breadcrumb", "Profil Guru")} SMK Telkom Sidoarjo`}
      ctaText={t("profilGuru.heroCta", "Jelajahi")}
      ctaHref="#kepala-sekolah-section"
      imagePosition="right"
      isIntegratedArtwork={true}
      imageContainerClassName="w-full max-w-[540px] sm:max-w-[600px] lg:max-w-[650px] xl:max-w-[680px] aspect-[16/10]"
    />
  );
}
