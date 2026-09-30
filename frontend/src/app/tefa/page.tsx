import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TefaOverviewClient from "@/components/sections/tefa/TefaOverviewClient";

export const metadata: Metadata = {
  title: "Teaching Factory (TeFa)",
  description:
    "Teaching Factory (TEFA) SMK Telkom Sidoarjo adalah konsep pembelajaran berbasis produksi yang menggabungkan kompetensi siswa dengan kebutuhan industri untuk menghasilkan karya nyata berkualitas.",
  keywords: [
    "Teaching Factory SMK Telkom Sidoarjo",
    "TeFa SMK Telkom",
    "Karya Siswa SMK Sidoarjo",
    "Produk Jasa TeFa Skomda",
    "Mitra Industri TeFa",
    "PBL SMK Telkom Sidoarjo",
  ],
  openGraph: {
    title: "Teaching Factory (TeFa)",
    description:
      "Konsep pembelajaran berbasis produksi yang menggabungkan kompetensi siswa dengan kebutuhan industri untuk menghasilkan karya nyata.",
    images: [
      {
        url: "/images/tefa/tefa-building.png",
        width: 1200,
        height: 630,
        alt: "Gedung Teaching Factory SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function TefaPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      {/* Floating Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <TefaOverviewClient />
      </main>

      {/* 4-Column Footer */}
      <Footer />
    </div>
  );
}
