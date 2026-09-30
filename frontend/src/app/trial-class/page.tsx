import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrialClassClient from "@/components/sections/trial-class/TrialClassClient";

export const metadata: Metadata = {
  title: "Trial Class",
  description:
    "Ikuti Virtual Class untuk merasakan langsung suasana belajar di SMK Telkom Sidoarjo, mengenal metode pembelajaran: semuanya dari mana saja.",
  keywords: [
    "Trial Class SMK Telkom Sidoarjo",
    "Virtual Class SMK Telkom",
    "Kelas Percobaan SMK Sidoarjo",
    "Pendaftaran Trial Class",
    "SMK Telkom Sidoarjo",
  ],
  openGraph: {
    title: "Trial Class",
    description:
      "Ikuti Virtual Class untuk merasakan langsung suasana belajar di SMK Telkom Sidoarjo, mengenal metode pembelajaran: semuanya dari mana saja.",
    url: "https://smktelkom-sda.sch.id/trial-class",
    siteName: "SMK Telkom Sidoarjo",
    images: [
      {
        url: "/images/trial-class/hero-student.png",
        width: 1200,
        height: 630,
        alt: "Trial Class SMK Telkom Sidoarjo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function TrialClassPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] overflow-x-hidden flex flex-col justify-between">
      {/* Floating Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <TrialClassClient />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

