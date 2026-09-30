import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PpdbClient from "@/components/sections/ppdb/PpdbClient";

export const metadata: Metadata = {
  title: "Pendaftaran Siswa Baru (PPDB)",
  description:
    "Daftar sekarang ke SMK Telkom Sidoarjo. Ikuti alur pendaftaran PPDB resmi untuk jurusan SIJA (4 Tahun), TJKT (3 Tahun), dan RPL. Mulai perjalanan digital vokasionalmu bersama kami.",
  keywords: [
    "PPDB SMK Telkom Sidoarjo",
    "Pendaftaran Siswa Baru SMK Telkom",
    "SIJA TJKT RPL Sidoarjo",
    "SMK Telkom Skomda",
    "Daftar SMK Telkom Sidoarjo 2026",
    "Alur Pendaftaran SMK",
  ],
  openGraph: {
    title: "Pendaftaran Siswa Baru (PPDB)",
    description:
      "Daftar sekarang ke SMK Telkom Sidoarjo. Ikuti alur pendaftaran PPDB resmi dan mulai perjalanan digital vokasionalmu.",
    url: "https://smktelkom-sda.sch.id/ppdb",
    siteName: "SMK Telkom Sidoarjo",
    images: [
      {
        url: "/images/trial-class/hero-student.png",
        width: 1200,
        height: 630,
        alt: "PPDB SMK Telkom Sidoarjo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function PpdbPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      {/* Floating Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <PpdbClient />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
