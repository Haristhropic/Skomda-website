import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfilHeroSection from "@/components/sections/profil/ProfilHeroSection";
import VisiMisiSection from "@/components/sections/profil/VisiMisiSection";
import AkreditasiSection from "@/components/sections/profil/AkreditasiSection";
import StrukturOrganisasiSection from "@/components/sections/profil/StrukturOrganisasiSection";

export const metadata: Metadata = {
  title: "Profil Sekolah & Visi Misi",
  description:
    "SMK Telkom Sidoarjo adalah SMK Teknologi dan Informatika di bawah Yayasan Pendidikan Telkom berakreditasi A (Unggul) dan ISO 21001:2018. Menghasilkan lulusan tangguh, berakhlak, dan berwawasan digital.",
  keywords: [
    "Profil SMK Telkom Sidoarjo",
    "Visi Misi SMK Telkom Sidoarjo",
    "Akreditasi SMK Telkom Sidoarjo",
    "Struktur Organisasi SMK Telkom Sidoarjo",
    "SMK Terbaik Sidoarjo",
    "SMK IT Jawa Timur",
  ],
  openGraph: {
    title: "Profil Sekolah & Visi Misi",
    description:
      "SMK Telkom Sidoarjo adalah SMK Teknologi dan Informatika di bawah Yayasan Pendidikan Telkom berakreditasi A (Unggul) dan ISO 21001:2018.",
    images: [
      {
        url: "/images/tentang-kami/profil-sekolah/profil-hero-character.png",
        width: 1122,
        height: 1402,
        alt: "Profil SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function ProfilSekolahPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      {/* Floating Navbar */}
      <Navbar />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section: Breadcrumbs, Title, Intro, Student Portrait */}
        <ProfilHeroSection />

        {/* 2. Visi & Misi Section: Core Vision, Mission Points, Illustrated Composition */}
        <VisiMisiSection />

        {/* 3. Accreditation Section: Official BAN-S/M Grade A Badge & Decree */}
        <AkreditasiSection />

        {/* 4. Organizational Structure Section: High-res Flowchart & Lightbox Viewer */}
        <StrukturOrganisasiSection />
      </main>

      {/* 4-Column Footer */}
      <Footer />
    </div>
  );
}
