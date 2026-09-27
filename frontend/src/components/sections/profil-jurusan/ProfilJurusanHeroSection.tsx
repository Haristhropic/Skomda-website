"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function ProfilJurusanHeroSection() {
  const { t } = useLanguage();

  return (
    <PageHeroSection
      breadcrumbs={[
        { label: t("nav.programs", "Program"), href: "/program/profil-jurusan" },
        { label: "Profil Jurusan", href: "/program/profil-jurusan" },
      ]}
      titlePrefix="Profil"
      titleHighlight="Jurusan"
      titleHighlightColor="text-[#e7000b]"
      showAccentBar={true}
      description="SMK Telkom Sidoarjo menghadirkan dua program keahlian unggulan masa depan: Sistem Informatika, Jaringan, dan Aplikasi (SIJA) serta Teknik Jaringan Akses Telekomunikasi (TJAT). Dengan kurikulum berbasis industri dan sertifikasi internasional, siswa dibimbing menguasai keahlian jaringan tingkat lanjut, rekayasa perangkat lunak, hingga infrastruktur telekomunikasi modern."
      studentImage="/images/program/profil-jurusan/hero-jurusan-student.png"
      studentAlt="Profil Jurusan SMK Telkom Sidoarjo"
      ctaText="Jelajahi"
      ctaHref="#kompetensi"
      imagePosition="right"
      isIntegratedArtwork={true}
      imageContainerClassName="w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[520px] aspect-[1326/1186]"
      imageClassName="drop-shadow-xl"
    />
  );
}
