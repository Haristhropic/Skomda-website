"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function BkkHeroSection() {
  const { t } = useLanguage();

  return (
    <PageHeroSection
      breadcrumbs={[
        { label: t("nav.programs", "Program"), href: "/program/profil-jurusan" },
        { label: "BKK", href: "/program/bkk" },
      ]}
      titlePrefix="Bursa Kerja"
      titleHighlight="Khusus (BKK)"
      titleHighlightColor="text-[#e7000b]"
      titleHighlightClassName="whitespace-nowrap"
      titleClassName="text-3xl sm:text-4xl lg:text-[38px] xl:text-[44px]"
      textColSpan="lg:col-span-7"
      imageColSpan="lg:col-span-5"
      showAccentBar={true}
      description="Bursa Kerja Khusus (BKK) SMK Telkom Sidoarjo hadir sebagai pusat layanan karier terpadu yang menghubungkan siswa dan alumni langsung dengan dunia kerja. Kami memfasilitasi akses lowongan kerja terverifikasi, pelatihan kesiapan kerja seperti simulasi wawancara dan penyusunan portofolio, hingga penyaluran kerja ke puluhan mitra industri terpercaya."
      studentImage="/images/program/bkk/hero-student-bkk.png"
      studentAlt="Bursa Kerja Khusus SMK Telkom Sidoarjo"
      ctaText="Jelajahi"
      ctaHref="#peluang-karier"
      imagePosition="right"
      isIntegratedArtwork={true}
      sectionPaddingClassName="pt-28 sm:pt-32 lg:pt-30 pb-16 lg:pb-24"
      gridAlignmentClassName="items-center"
      textJustifyClassName="justify-center"
      imageContainerClassName="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] aspect-[1024/1536]"
      imageClassName="drop-shadow-xl"
    />
  );
}
