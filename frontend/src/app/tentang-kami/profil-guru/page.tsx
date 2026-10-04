import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfilGuruClient from "@/components/sections/profil-guru/ProfilGuruClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Guru & Tenaga Kependidikan",
  description:
    "Profil tenaga pengajar dan staf profesional berdedikasi dengan keahlian di bidang Teknologi Informasi dan Komunikasi di SMK Telkom Sidoarjo.",
  openGraph: {
    title: "SMK Telkom Sidoarjo",
    description:
      "Tim pengajar profesional berdedikasi dengan keahlian teknologi dan pengalaman industri di SMK Telkom Sidoarjo.",
    images: [
      {
        url: "/images/tentang-kami/profil-guru/profil-guru-hero.png",
        width: 1200,
        height: 630,
        alt: "Profil Guru SMK Telkom Sidoarjo",
      },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ProfilGuruPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      {/* Floating Navbar */}
      <Navbar />
      
      {/* Main Page Content */}
      <main className="flex-1">
        <ProfilGuruClient />
      </main>

      {/* 4-Column Footer */}
      <Footer />
    </div>
  );
}
