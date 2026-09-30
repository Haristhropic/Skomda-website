import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrestasiClient from "@/components/sections/prestasi/PrestasiClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prestasi & Rekam Jejak Juara",
  description:
    "Daftar prestasi dan rekam jejak juara siswa SMK Telkom Sidoarjo di tingkat regional, nasional, dan internasional di bidang teknologi informasi dan kompetensi vokasi.",
  openGraph: {
    title: "Prestasi & Rekam Jejak Juara",
    description: "Rekam jejak juara dan penghargaan siswa SMK Telkom Sidoarjo.",
    images: [
      {
        url: "/images/tentang-kami/prestasi/hero-prestasi-lks.png",
        width: 1200,
        height: 630,
        alt: "Siswa Berprestasi SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function PrestasiPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <PrestasiClient />
      </main>
      <Footer />
    </div>
  );
}
