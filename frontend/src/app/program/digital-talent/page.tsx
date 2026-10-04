import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DigitalTalentClient from "@/components/sections/digital-talent/DigitalTalentClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Talent Program (DTP)",
  description:
    "Program percepatan talenta digital SMK Telkom Sidoarjo melalui sertifikasi internasional Cisco, Mikrotik, BNSP, serta pembinaan intensif cloud & software development.",
  openGraph: {
    title: "Digital Talent Program (DTP)",
    description: "Pembekalan talenta digital berstandar industri internasional di SMK Telkom Sidoarjo.",
    images: [
      {
        url: "/images/program/digital-talent/hero-student-digital-talent.png",
        width: 1200,
        height: 630,
        alt: "Talenta Digital Siswa SMK Telkom Sidoarjo",
      },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DigitalTalentPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <DigitalTalentClient />
      </main>
      <Footer />
    </div>
  );
}
