import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AkomodasiHeroSection from "@/components/sections/akomodasi/AkomodasiHeroSection";
import BiayaHidupSection from "@/components/sections/akomodasi/BiayaHidupSection";
import RekomendasiKosSection from "@/components/sections/akomodasi/RekomendasiKosSection";
import TipsAkomodasiSection from "@/components/sections/akomodasi/TipsAkomodasiSection";

export const metadata: Metadata = {
  title: "Akomodasi & Rekomendasi Kos Siswa",
  description:
    "Informasi akomodasi dan estimasi biaya hidup siswa SMK Telkom Sidoarjo secara transparan. Rekomendasi kos, asrama, dan kontrakan aman dan nyaman di sekitar kampus.",
  keywords: [
    "Akomodasi SMK Telkom Sidoarjo",
    "Kos Dekat SMK Telkom Sidoarjo",
    "Biaya Hidup Siswa Sidoarjo",
    "Asrama Pelajar Telkom",
    "Kos Putra Sekardangan Sidoarjo",
    "Kos Putri Sidoarjo Kota",
  ],
  openGraph: {
    title: "Akomodasi & Rekomendasi Kos Siswa",
    description:
      "Informasi akomodasi dan estimasi biaya hidup siswa SMK Telkom Sidoarjo secara transparan.",
    images: [
      {
        url: "/images/tentang-kami/akomodasi/akomodasi-hero.jpg",
        width: 1200,
        height: 675,
        alt: "Akomodasi dan Biaya Hidup Siswa SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function AkomodasiPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <AkomodasiHeroSection />
        <BiayaHidupSection />
        <RekomendasiKosSection />
        <TipsAkomodasiSection />
      </main>
      <Footer />
    </div>
  );
}
