import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FasilitasClient from "@/components/sections/fasilitas/FasilitasClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fasilitas & Sarana Prasarana",
  description:
    "Fasilitas lengkap dan modern berstandar industri di SMK Telkom Sidoarjo: laboratorium jaringan fiber optik, lab komputer canggih, studio multimedia, dan sarana olahraga representatif.",
  openGraph: {
    title: "SMK Telkom Sidoarjo",
    description: "Fasilitas dan infrastruktur modern berstandar industri di SMK Telkom Sidoarjo.",
    images: [
      {
        url: "/images/tentang-kami/fasilitas/hero-fasilitas-terpadu.png",
        width: 1200,
        height: 630,
        alt: "Fasilitas SMK Telkom Sidoarjo",
      },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function FasilitasPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <FasilitasClient />
      </main>
      <Footer />
    </div>
  );
}
