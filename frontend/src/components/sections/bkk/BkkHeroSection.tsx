"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function BkkHeroSection() {
  const { t } = useLanguage();

  return (
    <PageHeroSection
      breadcrumbs={[
        { label: t("nav.programs", "Program"), href: "/program/profil-jurusan" },
        { label: t("bkk.breadcrumb", "BKK"), href: "/program/bkk" },
      ]}
      titlePrefix={t("bkk.heroTitle1", "Bursa Kerja")}
      titleHighlight={t("bkk.heroTitle2", "Khusus (BKK)")}
      titleHighlightColor="text-[#e7000b]"
      titleHighlightClassName="whitespace-nowrap"
      titleClassName="text-3xl sm:text-4xl lg:text-[38px] xl:text-[44px]"
      textColSpan="lg:col-span-7"
      imageColSpan="lg:col-span-5"
      showAccentBar={true}
      description={t(
        "bkk.heroDesc",
        "Menjembatani lulusan SMK Telkom Sidoarjo dengan dunia usaha dan industri melalui informasi lowongan kerja terpercaya, pelatihan kesiapan kerja, serta rekrutmen kampus."
      )}
      studentImage="/images/program/bkk/hero-student-bkk.png"
      studentAlt={`${t("bkk.breadcrumb", "Bursa Kerja Khusus")} SMK Telkom Sidoarjo`}
      ctaText={t("bkk.heroCta", "Jelajahi")}
      ctaHref="#peluang-karier"
      imagePosition="right"
      isIntegratedArtwork={true}
      gridAlignmentClassName="items-center"
      textJustifyClassName="justify-center"
      imageContainerClassName="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] aspect-[1024/1536]"
      imageClassName="drop-shadow-xl"
    />
  );
}
