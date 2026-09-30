import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PenerapanK3Client from "@/components/sections/k3/PenerapanK3Client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Penerapan K3 Lingkungan Sekolah",
  description:
    "Standar Keselamatan dan Kesehatan Kerja (K3) di lingkungan bengkel praktikum, laboratorium jaringan fiber optik, dan sarana sekolah di SMK Telkom Sidoarjo.",
  openGraph: {
    title: "Penerapan K3 Lingkungan Sekolah",
    description: "Standar Keselamatan dan Kesehatan Kerja (K3) di SMK Telkom Sidoarjo.",
    images: [
      {
        url: "/images/informasi/penerapan-k3/hero-student-k3.png",
        width: 1200,
        height: 630,
        alt: "Penerapan K3 SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function PenerapanK3Page() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <PenerapanK3Client />
      </main>
      <Footer />
    </div>
  );
}
