"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function AkomodasiHeroSection() {
  const { t } = useLanguage();

  return (
    <PageHeroSection
      breadcrumbs={[
        { label: t("nav.aboutUs", "Tentang Kami"), href: "/tentang-kami/profil-sekolah" },
        { label: "Akomodasi", href: "/tentang-kami/akomodasi" },
      ]}
      titleHighlight="Akomodasi"
      titleHighlightColor="text-[#101828]"
      description="SMK Telkom Sidoarjo menyediakan informasi akomodasi dan biaya hidup untuk membantu siswa merencanakan kebutuhan selama bersekolah. Tersedia rekomendasi kos dan kontrakan di sekitar sekolah agar siswa dapat tinggal dengan nyaman, praktis, dan tetap fokus belajar."
      studentImage="/images/tentang-kami/akomodasi/hero-student-akomodasi.png"
      studentAlt="Akomodasi Siswa SMK Telkom Sidoarjo"
      ctaText="Jelajahi"
      ctaHref="#biaya-hidup"
      imagePosition="right"
      isIntegratedArtwork={true}
      sectionPaddingClassName="pt-28 sm:pt-32 lg:pt-30 pb-16 lg:pb-24"
    />
  );
}
