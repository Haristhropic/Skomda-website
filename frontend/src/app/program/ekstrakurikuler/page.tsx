import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EkstrakurikulerClient from "@/components/sections/ekstrakurikuler/EkstrakurikulerClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekstrakurikuler Siswa",
  description:
    "Wadah pengembangan minat, bakat, dan kepemimpinan siswa melalui 18 pilihan cabang ekstrakurikuler di bidang teknologi, olahraga, dan seni budaya di SMK Telkom Sidoarjo.",
  openGraph: {
    title: "Ekstrakurikuler Siswa",
    description: "18 Cabang Ekstrakurikuler Unggulan SMK Telkom Sidoarjo untuk mengasah bakat dan potensi siswa.",
    images: [
      {
        url: "/images/program/ekstrakurikuler/hero-student-guitar.png",
        width: 1200,
        height: 630,
        alt: "Ekstrakurikuler Siswa SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function EkstrakurikulerPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <EkstrakurikulerClient />
      </main>
      <Footer />
    </div>
  );
}
