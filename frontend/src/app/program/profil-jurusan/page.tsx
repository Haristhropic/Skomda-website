import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfilJurusanHeroSection from "@/components/sections/profil-jurusan/ProfilJurusanHeroSection";
import MembangunKompetensiSection from "@/components/sections/profil-jurusan/MembangunKompetensiSection";
import KeunggulanSertifikasiSection from "@/components/sections/profil-jurusan/KeunggulanSertifikasiSection";
import ProspekKarirSection from "@/components/sections/profil-jurusan/ProspekKarirSection";

export const metadata: Metadata = {
  title: "SMK Telkom Sidoarjo",
  description:
    "Profil Jurusan Unggulan SMK Telkom Sidoarjo: Sistem Informasi Jaringan dan Aplikasi (SIJA) dan Teknik Jaringan Akses Telekomunikasi (TJAT). Kurikulum relevan industri dan sertifikasi internasional.",
  keywords: [
    "Profil Jurusan SMK Telkom Sidoarjo",
    "Jurusan SIJA SMK Telkom",
    "Jurusan TJAT SMK Telkom Sidoarjo",
    "SMK 4 Tahun Sidoarjo",
    "Teknik Jaringan Akses",
    "Sistem Informasi Jaringan Aplikasi",
    "Sertifikasi BNSP Mikrotik Cisco Skomda",
  ],
  openGraph: {
    title: "SMK Telkom Sidoarjo",
    description:
      "Profil Jurusan Unggulan SMK Telkom Sidoarjo: SIJA & TJAT berstandar industri.",
    images: [
      {
        url: "/images/program/profil-jurusan/jurusan-sija-character.png",
        width: 800,
        height: 600,
        alt: "Profil Jurusan SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function ProfilJurusanPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <ProfilJurusanHeroSection />
        <Suspense fallback={null}>
          <MembangunKompetensiSection />
        </Suspense>
        <KeunggulanSertifikasiSection />
        <ProspekKarirSection />
      </main>
      <Footer />
    </div>
  );
}
