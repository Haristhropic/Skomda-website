import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PengumumanKelulusanClient from "@/components/sections/kelulusan/PengumumanKelulusanClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengumuman Resmi Kelulusan",
  description:
    "Portal resmi informasi pengumuman kelulusan siswa Tahun Ajaran 2023/2024, penelusuran tamatan (Tracer Study), serta jadwal pengambilan SKL dan ijazah SMK Telkom Sidoarjo.",
  openGraph: {
    title: "Pengumuman Resmi Kelulusan",
    description: "Informasi resmi kelulusan siswa dan tracer study SMK Telkom Sidoarjo.",
    images: [
      {
        url: "/images/informasi/pengumuman-kelulusan/hero-student-kelulusan.png",
        width: 1200,
        height: 630,
        alt: "Pengumuman Kelulusan SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function PengumumanKelulusanPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <PengumumanKelulusanClient />
      </main>
      <Footer />
    </div>
  );
}
