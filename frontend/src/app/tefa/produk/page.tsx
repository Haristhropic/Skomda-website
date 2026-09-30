import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TefaPageClient from "@/components/sections/tefa/TefaPageClient";

export const metadata: Metadata = {
  title: "Katalog Produk & Jasa TeFa",
  description:
    "Jelajahi produk digital, sistem informasi, instalasi jaringan, dan layanan IT maintenance hasil karya siswa Teaching Factory SMK Telkom Sidoarjo.",
  keywords: [
    "Produk TeFa SMK Telkom",
    "Jasa Digital Siswa SMK",
    "Website Company Profile SMK",
    "Instalasi Jaringan SMK Telkom",
    "IT Maintenance Telkom Sidoarjo",
  ],
};

export default function TefaProductsPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <TefaPageClient />
      </main>
      <Footer />
    </div>
  );
}
