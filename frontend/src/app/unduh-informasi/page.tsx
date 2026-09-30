import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UnduhInformasiClient from "@/components/sections/unduh/UnduhInformasiClient";

export const metadata: Metadata = {
  title: "Unduh Dokumen & Brosur Resmi",
  description:
    "Pusat unduhan informasi resmi SMK Telkom Sidoarjo. Dapatkan brosur PPDB 2026/2027, sertifikat akreditasi A, sertifikat ISO 21001, dan dokumen regulasi resmi.",
  keywords: [
    "Unduh Informasi SMK Telkom Sidoarjo",
    "Brosur PPDB SMK Telkom Sidoarjo",
    "Akreditasi SMK Telkom Sidoarjo",
    "ISO 21001 SMK Telkom Sidoarjo",
    "Dokumen Resmi SMK Telkom",
    "Download Brosur SMK",
  ],
  openGraph: {
    title: "Unduh Dokumen & Brosur Resmi",
    description:
      "Pusat unduhan informasi resmi SMK Telkom Sidoarjo. Dapatkan brosur PPDB 2026/2027, sertifikat akreditasi A, dan dokumen regulasi resmi.",
    images: [
      {
        url: "/documents/thumbnails/thumb-brosur-ppdb.jpg",
        width: 1200,
        height: 630,
        alt: "Brosur PPDB SMK Telkom Sidoarjo",
      },
    ],
  },
};

export default function UnduhInformasiPage() {
  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <Navbar />
      <UnduhInformasiClient />
      <Footer />
    </main>
  );
}
