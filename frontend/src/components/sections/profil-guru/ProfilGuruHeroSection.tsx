"use client";

import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";

export default function ProfilGuruHeroSection() {
  const { t } = useLanguage();

  return (
    <PageHeroSection
      breadcrumbs={[
        { label: t("nav.aboutUs", "Tentang Kami"), href: "/tentang-kami/profil-sekolah" },
        { label: "Profil Guru", href: "/tentang-kami/profil-guru" },
      ]}
      titleHighlight="Profil Guru"
      titleHighlightColor="text-[#101828]"
      description="Mengenal jajaran tenaga pendidik dan instruktur profesional SMK Telkom Sidoarjo yang memiliki sertifikasi keahlian di bidang akademik dan teknologi industri. Dengan dedikasi tinggi, para pendidik tidak hanya mentransfer ilmu pengetahuan terkini, tetapi juga membimbing karakter, disiplin, dan mentalitas juara setiap siswa menuju masa depan yang sukses."
      studentImage="/images/tentang-kami/profil-guru/hero-student-guru.png"
      studentAlt="Profil Guru SMK Telkom Sidoarjo"
      ctaText="Jelajahi"
      ctaHref="#kepala-sekolah-section"
      imagePosition="right"
      isIntegratedArtwork={true}
      sectionPaddingClassName="pt-28 sm:pt-32 lg:pt-30 pb-16 lg:pb-24"
    />
  );
}
