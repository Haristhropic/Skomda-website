import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Ts21HeroSection from "@/components/sections/ts21/Ts21HeroSection";
import Ts21FrameworkSection from "@/components/sections/ts21/Ts21FrameworkSection";
import Ts21MetodeSection from "@/components/sections/ts21/Ts21MetodeSection";
import Ts21EnablerSection from "@/components/sections/ts21/Ts21EnablerSection";

export const metadata: Metadata = {
  title: "Kurikulum & Program Unggulan TS.21",
  description:
    "Program TS.21 SMK Telkom Sidoarjo: Kurikulum unggulan berbasis Kompetensi Abad 21, Blended Learning, Project-Based, dan Studio Classroom menuju Sekolah 4.0.",
  keywords: [
    "Program TS.21 SMK Telkom Sidoarjo",
    "Kurikulum TS 21",
    "Sekolah 4.0 Telkom Sidoarjo",
    "Blended Learning Skomda",
    "Project Based Learning SMK Telkom",
    "Studio Classroom Telkom Schools",
    "KBM 21.40 Plis",
    "Digital Enabler Skomda",
  ],
  openGraph: {
    title: "Kurikulum & Program Unggulan TS.21",
    description:
      "Program TS.21 SMK Telkom Sidoarjo: Langkah Menuju Sekolah 4.0 Berstandar Global.",
  },
};

export default function Ts21Page() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Ts21HeroSection />
        <Ts21FrameworkSection />
        <Ts21MetodeSection />
        <Ts21EnablerSection />
      </main>
      <Footer />
    </div>
  );
}
