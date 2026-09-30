import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TefaRequestPageClient from "@/components/sections/tefa/TefaRequestPageClient";

export const metadata: Metadata = {
  title: "Ajukan Project TeFa",
  description:
    "Ajukan konsultasi dan kebutuhan proyek digital Anda bersama tim Teaching Factory SMK Telkom Sidoarjo.",
  keywords: [
    "Request Project TeFa",
    "Konsultasi IT SMK Telkom",
    "Kerjasama Proyek Siswa SMK",
  ],
};

export default function TefaRequestPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <TefaRequestPageClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
