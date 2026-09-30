"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";
import K3SopLabsSection from "@/components/sections/k3/K3SopLabsSection";
import K3DocumentsListSection from "@/components/sections/k3/K3DocumentsListSection";
import K3ApdSection from "@/components/sections/k3/K3ApdSection";
import K3EmergencySection from "@/components/sections/k3/K3EmergencySection";

export default function PenerapanK3Client() {
  const { isEn, t } = useLanguage();

  return (
    <>
      <PageHeroSection
        breadcrumbs={[
          { label: t("nav.information", "Informasi"), href: "/informasi/berita" },
          { label: t("informasi.k3Breadcrumb", "Penerapan K3"), href: "/informasi/penerapan-k3" },
        ]}
        titleHighlight={t("informasi.k3Title1", "Penerapan K3")}
        titleHighlightColor="text-[#101828]"
        description={t("informasi.k3Desc")}
        studentImage="/images/informasi/penerapan-k3/hero-student-k3.png"
        studentAlt={`${t("informasi.k3Breadcrumb", "Penerapan K3")} SMK Telkom Sidoarjo`}
        ctaText={t("informasi.k3Cta", "Jelajahi")}
        ctaHref="#berkas-k3"
        imagePosition="right"
        isIntegratedArtwork={true}
      />

      <K3DocumentsListSection />
      <K3SopLabsSection />
      <K3ApdSection />
      <K3EmergencySection />
    </>
  );
}
