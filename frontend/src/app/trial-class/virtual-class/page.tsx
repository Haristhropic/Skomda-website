import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VirtualClassPageClient from "@/components/sections/trial-class/virtual-class/VirtualClassPageClient";

export const metadata: Metadata = {
  title: "Virtual Class - Digital Talent Program",
  description:
    "Jelajahi Digital Talent Program (DTP) SMK Telkom Sidoarjo melalui sesi interaktif Virtual Class, 9 bidang peminatan IT unggulan, dan pengalaman belajar digital langsung.",
  keywords: [
    "Virtual Class SMK Telkom Sidoarjo",
    "Digital Talent Program SKOMDA",
    "DTP Trial Class",
    "Cyber Security SMK",
    "Software Developer SMK",
    "AI SMK Sidoarjo",
    "IoT SMK Telkom",
  ],
  openGraph: {
    title: "Virtual Class - Digital Talent Program",
    description:
      "Jelajahi Digital Talent Program (DTP) SMK Telkom Sidoarjo melalui sesi interaktif Virtual Class, 9 bidang peminatan IT unggulan, dan pengalaman belajar digital langsung.",
    url: "https://smktelkom-sda.sch.id/trial-class/virtual-class",
    siteName: "SMK Telkom Sidoarjo",
    images: [
      {
        url: "/images/trial-class/virtual-hero-students.png",
        width: 1200,
        height: 630,
        alt: "Virtual Class DTP SMK Telkom Sidoarjo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function VirtualClassPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      {/* Floating Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-32 flex items-center justify-center">
              <div className="size-10 rounded-full border-3 border-[#bc0c11] border-t-transparent animate-spin" />
            </div>
          }
        >
          <VirtualClassPageClient />
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
