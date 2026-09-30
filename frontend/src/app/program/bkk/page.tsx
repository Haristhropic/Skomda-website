import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BkkHeroSection from "@/components/sections/bkk/BkkHeroSection";
import BkkPeranSection from "@/components/sections/bkk/BkkPeranSection";
import BkkPeluangSection from "@/components/sections/bkk/BkkPeluangSection";
import BkkTalentaSection from "@/components/sections/bkk/BkkTalentaSection";
import BkkAlumniJourneySection from "@/components/sections/bkk/BkkAlumniJourneySection";
import BkkKerjasamaSection from "@/components/sections/bkk/BkkKerjasamaSection";
import BkkMitraSection from "@/components/sections/bkk/BkkMitraSection";

export const metadata: Metadata = {
  title: "Bursa Kerja Khusus (BKK)",
  description:
    "Bursa Kerja Khusus (BKK) SMK Telkom Sidoarjo menghubungkan siswa dan alumni SIJA serta TJAT dengan peluang kerja, magang industri, dan kemitraan perusahaan terkemuka.",
  openGraph: {
    title: "Bursa Kerja Khusus (BKK)",
    description:
      "Pusat karier, lowongan kerja, magang industri, dan penyaluran talenta vokasi SMK Telkom Sidoarjo.",
    images: [
      {
        url: "/images/home/hero/image5.png",
        width: 1200,
        height: 630,
        alt: "BKK SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function BkkPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <BkkHeroSection />
        <BkkPeranSection />
        <BkkPeluangSection />
        <BkkTalentaSection />
        <BkkAlumniJourneySection />
        <BkkMitraSection />
        <BkkKerjasamaSection />
      </main>
      <Footer />
    </div>
  );
}
