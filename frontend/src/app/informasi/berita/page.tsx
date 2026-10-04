import { Suspense } from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BeritaPageClient from "@/components/sections/berita/BeritaPageClient";
import { getNewsList, type NewsItem } from "@/services/news";

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
  let newsList: NewsItem[] = [];
  let unavailable = false;
  try { newsList = await getNewsList(); } catch { unavailable = true; }

  return (
    <div className="min-h-screen bg-white text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        {unavailable && <p role="alert" className="mx-auto mt-28 max-w-[1280px] px-6 py-4 text-sm text-red-800">Berita belum dapat dimuat. Muat ulang halaman untuk mencoba lagi.</p>}
        <Suspense fallback={<div className="min-h-[400px] bg-[#f3f4f6]" />}>
          <BeritaPageClient initialNews={newsList} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
