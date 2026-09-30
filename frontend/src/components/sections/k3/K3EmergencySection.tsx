"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  Flame,
  Users,
  Cross,
  Navigation,
  MapPin,
} from "lucide-react";

export default function K3EmergencySection() {
  const { isEn, t } = useLanguage();

  const facilities = [
    {
      id: "assembly-point",
      icon: <Users className="size-7 text-[#bc0c11]" />,
      title: t("k3.assemblyPointTitle", "Titik Kumpul (Assembly Point)"),
      desc: t(
        "k3.assemblyPointDesc",
        "Area terbuka di Lapangan Utama SMK Telkom Sidoarjo yang aman dari jangkauan runtuhan gedung dan kabel udara tegangan listrik."
      ),
      location: isEn ? "Main Campus Sports Field" : "Lapangan Utama Kampus Skomda",
    },
    {
      id: "apar",
      icon: <Flame className="size-7 text-[#bc0c11]" />,
      title: t("k3.aparTitle", "APAR (Alat Pemadam Api)"),
      desc: t(
        "k3.aparDesc",
        "Seluruh laboratorium dilengkapi tabung APAR Dry Chemical & CO2 dengan panduan operasi cepat 4 langkah (Pull, Aim, Squeeze, Sweep)."
      ),
      location: isEn ? "Corridors & Each Laboratory Entry" : "Di Setiap Koridor & Pintu Masuk Lab",
    },
    {
      id: "p3k",
      icon: <Cross className="size-7 text-[#bc0c11]" />,
      title: t("k3.p3kTitle", "Posko UKS & Kotak P3K"),
      desc: t(
        "k3.p3kDesc",
        "Kotak Pertolongan Pertama tersedia di setiap lantai dan ruang instruktur, didukung ruang UKS dengan petugas siap siaga."
      ),
      location: isEn ? "Ground Floor Building A" : "Gedung A Lantai 1",
    },
    {
      id: "evacuation",
      icon: <Navigation className="size-7 text-[#bc0c11]" />,
      title: t("k3.evacuationTitle", "Rute Jalur Evakuasi"),
      desc: t(
        "k3.evacuationDesc",
        "Denah petunjuk arah keluar darurat terpasang di setiap koridor dan pintu laboratorium dengan pencahayaan darurat."
      ),
      location: isEn ? "All Building Floors & Staircases" : "Seluruh Lantai Gedung & Tangga Darurat",
    },
  ];

  return (
    <section id="tanggap-darurat" className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-gray-200/60 scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-[#101828] mb-3 tracking-tight">
            {t("k3.emergencyTitle", "Fasilitas & Mitigasi Keadaan Darurat")}
          </h2>

          <div className="section-title-line" />

          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
            {t(
              "k3.emergencySubtitle",
              "Kesiapsiagaan sarana prasarana sekolah dalam merespons insiden dan situasi darurat seperti kebakaran, gempa bumi, atau cidera fisik."
            )}
          </p>
        </div>

        {/* 4 Emergency Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="group rounded-[24px] neu-card-interactive p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="text-[#bc0c11] mb-3">
                  {fac.icon}
                </div>
                <h3 className="font-jakarta font-bold text-base sm:text-lg text-[#101828] mb-2">
                  {fac.title}
                </h3>
                <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed mb-4">
                  {fac.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 font-jakarta text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <MapPin className="size-3.5 text-[#bc0c11] shrink-0" />
                <p>{fac.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
