"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function ProfilJurusanHeroSection() {
  const { t } = useLanguage();

  return (
    <PageHeroSection
      breadcrumbs={[
        { label: t("nav.programs", "Program"), href: "/program/profil-jurusan" },
        { label: t("profilJurusan.breadcrumb", "Profil Jurusan"), href: "/program/profil-jurusan" },
      ]}
      titlePrefix={t("profilJurusan.heroTitle1", "Profil")}
      titleHighlight={t("profilJurusan.heroTitle2", "Jurusan")}
      titleHighlightColor="text-[#e7000b]"
      showAccentBar={true}
      description={t(
        "profilJurusan.heroDesc",
        "Mempersiapkan siswa menjadi praktisi handal di era digital melalui 2 kompetensi keahlian unggulan: Sistem Informasi, Jaringan, dan Aplikasi (SIJA) serta Teknik Jaringan Akses Telekomunikasi (TJAT)."
      )}
      studentImage="/images/program/profil-jurusan/hero-jurusan-student.png"
      studentAlt={`${t("profilJurusan.breadcrumb", "Profil Jurusan")} SMK Telkom Sidoarjo`}
      ctaText={t("profilJurusan.heroCta", "Jelajahi")}
      ctaHref="#kompetensi"
      imagePosition="right"
      isIntegratedArtwork={true}
      imageContainerClassName="w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[520px] aspect-[1326/1186]"
      imageClassName="drop-shadow-xl"
    />
  );
}
