import { Suspense } from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BeritaPageClient from "@/components/sections/berita/BeritaPageClient";
import { getNewsList } from "@/services/news";

export const metadata: Metadata = {
  title: "Berita & Agenda Terkini",
  description:
    "Portal Berita & Informasi Terkini SMK Telkom Sidoarjo: Kegiatan sekolah, prestasi siswa, kemitraan industri, dan perkembangan teknologi.",
  keywords: [
    "Berita SMK Telkom Sidoarjo",
    "Prestasi SMK Telkom",
    "Kegiatan Skomda",
    "Informasi PPDB Telkom Sidoarjo",
    "Artikel Teknologi Skomda",
  ],
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BeritaPage() {
  const newsList = await getNewsList();

  return (
    <div className="min-h-screen bg-white text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[400px] bg-[#f3f4f6]" />}>
          <BeritaPageClient initialNews={newsList} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
