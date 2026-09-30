import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HubIndustriHeroSection from "@/components/sections/hub-industri/HubIndustriHeroSection";
import MitraIndustriSection from "@/components/sections/hub-industri/MitraIndustriSection";
import SkemaKerjasamaSection from "@/components/sections/hub-industri/SkemaKerjasamaSection";
import AlurKerjasamaSection from "@/components/sections/hub-industri/AlurKerjasamaSection";

export const metadata: Metadata = {
  title: "Hubungan Industri & Mitra Strategis",
  description:
    "Kemitraan strategis SMK Telkom Sidoarjo dengan 10+ perusahaan teknologi dan telekomunikasi. Program PKL, sinkronisasi kurikulum, sertifikasi industri, dan rekrutmen langsung untuk lulusan siap kerja.",
  keywords: [
    "Hub Industri SMK Telkom Sidoarjo",
    "Kerjasama Industri SMK",
    "PKL SMK Telkom Sidoarjo",
    "Mitra Industri SMK Sidoarjo",
    "Link and Match SMK",
    "Magang SMK Telkom",
    "Sertifikasi Industri Sidoarjo",
  ],
  openGraph: {
    title: "Hubungan Industri & Mitra Strategis",
    description:
      "Kemitraan strategis SMK Telkom Sidoarjo dengan 10+ perusahaan teknologi dan telekomunikasi terkemuka.",
    images: [
      {
        url: "/images/tentang-kami/hub-industri/hub-industri-hero.jpg",
        width: 1200,
        height: 750,
        alt: "Hub Industri SMK Telkom Sidoarjo: Siswa berkolaborasi dengan profesional industri",
      },
    ],
  },
};

export default function HubIndustriPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      {/* Floating Navbar */}
      <Navbar />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero: Breadcrumbs, Title, Description, CTA, Industry Photo */}
        <HubIndustriHeroSection />

        {/* 2. Mitra Industri: Full Partner Grid with Dashed Border & Links */}
        <MitraIndustriSection />

        {/* 3. Skema Kerjasama: 4 Pilar Kemitraan Cards */}
        <SkemaKerjasamaSection />

        {/* 4. Alur Kerjasama: 4-Step Process Flow Cards */}
        <AlurKerjasamaSection />
      </main>

      {/* 4-Column Footer */}
      <Footer />
    </div>
  );
}
