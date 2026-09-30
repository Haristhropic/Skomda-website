"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ProgramsSection() {
  const { t, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<"SIJA" | "TJAT">("SIJA");

  return (
    <section id="program" className="w-full bg-[#f3f4f6] pt-12 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-14 scroll-mt-24" data-node-id="100:460">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
          <h2 className="font-jakarta font-bold text-3xl sm:text-[36px] leading-[40px] text-[#101828]">
            {t("programs.title1")}
          </h2>

          <p className="mt-2 font-jakarta font-bold text-2xl sm:text-[30px] leading-[36px] text-[#101828]">
            {t("programs.title2")} <span className="text-[#bc0c11]">SMK Telkom Sidoarjo</span>
          </p>

          {/* Segmented Pill Tabs with Animated Sliding Pill */}
          <div className="mt-6 sm:mt-8 relative inline-flex h-[48px] sm:h-[52px] w-[280px] sm:w-[340px] items-center rounded-full bg-white p-1 border border-gray-200/60 overflow-hidden">
            {/* Smooth CSS sliding pill indicator */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#bc0c11] transition-transform duration-300 ease-out pointer-events-none ${
                activeTab === "SIJA" ? "left-1 translate-x-0" : "left-1 translate-x-[calc(100%+0px)]"
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveTab("SIJA")}
              className={`relative z-10 flex-1 h-full rounded-full flex items-center justify-center gap-2 font-jakarta text-sm font-medium transition-colors duration-200 cursor-pointer select-none ${
                activeTab === "SIJA"
                  ? "text-white font-semibold"
                  : "text-[#364153] hover:text-[#bc0c11]"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>SIJA</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("TJAT")}
              className={`relative z-10 flex-1 h-full rounded-full flex items-center justify-center gap-2 font-jakarta text-sm font-medium transition-colors duration-200 cursor-pointer select-none ${
                activeTab === "TJAT"
                  ? "text-white font-semibold"
                  : "text-[#364153] hover:text-[#bc0c11]"
              }`}
            >
              {/* Exact TJAT vector icon from (node 96:378) */}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.54 6.47a5 5 0 0 1 0 7.06" />
                <path d="M15.9 4.11a8.33 8.33 0 0 1 0 11.78" />
                <path d="M4.1 15.89a8.33 8.33 0 0 1 0-11.78" />
                <path d="M6.46 13.53a5 5 0 0 1 0-7.06" />
                <circle cx="10" cy="10" r="1.5" stroke="currentColor" fill="none" />
              </svg>
              <span>TJAT</span>
            </button>
          </div>
        </div>

        {/* Tab Content: SIJA */}
        {activeTab === "SIJA" && (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-x-14 lg:gap-y-5 lg:items-center">

            {/* 1. Title + Description (mobile: first, desktop: right col row 1) */}
            <div className="order-1 lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <h3 className="font-jakarta font-bold text-2xl sm:text-3xl leading-tight">
                <span className="text-[#bc0c11]">
                  {isEn ? "Information Systems" : "Sistem Informasi"}
                </span>{" "}
                <span className="text-[#101828]">
                  {isEn ? "Networks & Applications" : "Jaringan dan Aplikasi"}
                </span>
              </h3>
              <p className="mt-2 font-jakarta text-sm sm:text-base leading-relaxed text-[#4a5565]">
                {isEn
                  ? "A 4-year program focusing on programming, database engineering, and modern cloud-native information systems."
                  : "Program 4 tahun yang mempelajari pemrograman, pengelolaan basis data, dan sistem informasi berbasis teknologi modern."}
              </p>
            </div>

            {/* 2. Student Character (mobile: second after title, desktop: left col spanning all rows) */}
            <div className="order-2 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:row-span-4 flex items-center justify-center">
              <div className="relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[420px] aspect-[446/557] flex items-center justify-center">
                <Image
                  src="/images/program/profil-jurusan/jurusan-sija-character.png"
                  alt="Siswi SIJA SMK Telkom Sidoarjo"
                  fill
                  priority
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 420px"
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* 3. Competencies (mobile: third, desktop: right col row 2) */}
            <div className="order-3 lg:col-span-7 lg:col-start-6 lg:row-start-2 flex flex-col gap-4">
              {[
                {
                  title: "Software Development",
                  desc: isEn
                    ? "Development of responsive web, mobile, and desktop applications with modern architecture and API integration."
                    : "Pengembangan aplikasi web, mobile, dan desktop yang responsif dengan arsitektur modern serta integrasi API.",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bc0c11" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  ),
                },
                {
                  title: "Database & Cloud Computing",
                  desc: isEn
                    ? "Relational and NoSQL database management along with cloud-native computing infrastructure deployment."
                    : "Pengelolaan basis data relasional dan NoSQL serta implementasi server berbasis teknologi cloud computing.",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bc0c11" strokeWidth="2">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                  ),
                },
                {
                  title: "Networking & Cybersecurity",
                  desc: isEn
                    ? "Computer networking configuration, routing, switching, and security countermeasures against cyber threats."
                    : "Konfigurasi infrastruktur jaringan komputer, routing, switching, dan proteksi sistem dari ancaman siber.",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bc0c11" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                },
              ].map((comp) => (
                <div key={comp.title} className="flex items-start gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
                    {comp.icon}
                  </div>
                  <div>
                    <h4 className="font-jakarta font-semibold text-sm sm:text-base text-[#101828]">
                      {comp.title}
                    </h4>
                    <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] mt-0.5">
                      {comp.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Prospek Kerja (mobile: fourth, desktop: right col row 3) */}
            <div className="order-4 lg:col-span-7 lg:col-start-6 lg:row-start-3">
              <div className="rounded-2xl bg-white border-2 border-dashed border-[#d1d5dc] p-4 sm:p-5">
                <h4 className="font-jakarta font-semibold text-sm sm:text-base text-[#c10007]">
                  {isEn ? "Career Prospects:" : "Prospek Kerja:"}
                </h4>
                <p className="font-jakarta text-xs sm:text-sm text-[#364153] mt-1 leading-relaxed">
                  Software Engineer, Web Developer, Mobile App Developer, Database Administrator, IT Security Specialist, System Analyst.
                </p>
              </div>
            </div>

            {/* 5. CTA Button (mobile: fifth, desktop: right col row 4) */}
            <div className="order-5 lg:col-span-7 lg:col-start-6 lg:row-start-4">
              <Link
                href="/program/profil-jurusan?jurusan=SIJA#kompetensi"
                className="group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] px-7 py-3 text-sm sm:text-base font-medium text-white transition-all hover:bg-[#990a0e] active:scale-[0.98]"
                style={{
                  boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                }}
              >
                <span className="font-jakarta font-medium">{t("programs.learnMore", "Pelajari Lebih Lanjut")}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Tab Content: TJAT */}
        {activeTab === "TJAT" && (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-x-14 lg:gap-y-5 lg:items-center">

            {/* 1. Title + Description */}
            <div className="order-1 lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <h3 className="font-jakarta font-bold text-2xl sm:text-3xl leading-tight">
                <span className="text-[#bc0c11]">
                  {isEn ? "Telecommunication" : "Teknik Jaringan"}
                </span>{" "}
                <span className="text-[#101828]">
                  {isEn ? "Access Network Engineering" : "Akses Telekomunikasi"}
                </span>
              </h3>
              <p className="mt-2 font-jakarta text-sm sm:text-base leading-relaxed text-[#4a5565]">
                {isEn
                  ? "A 3-year program centered on telecommunication network infrastructure, fiber optics, and high-speed wireless connectivity."
                  : "Program 3 tahun yang fokus pada teknologi jaringan telekomunikasi, infrastruktur fiber optik, dan komunikasi nirkabel berkecepatan tinggi."}
              </p>
            </div>

            {/* 2. Student Character */}
            <div className="order-2 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:row-span-4 flex items-center justify-center">
              <div className="relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[420px] aspect-[446/557] flex items-center justify-center">
                <Image
                  src="/images/program/profil-jurusan/jurusan-tjat-curved.png"
                  alt="Siswa TJAT SMK Telkom Sidoarjo"
                  fill
                  priority
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 420px"
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* 3. Competencies */}
            <div className="order-3 lg:col-span-7 lg:col-start-6 lg:row-start-2 flex flex-col gap-4">
              {[
                {
                  title: "Telecommunication Networks",
                  desc: isEn
                    ? "Mastering signal transmission fundamentals and voice/data communication network architecture."
                    : "Mempelajari prinsip transmisi sinyal dan arsitektur jaringan komunikasi suara dan data.",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bc0c11" strokeWidth="2">
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  ),
                },
                {
                  title: "Fiber Optic Technology",
                  desc: isEn
                    ? "Installation, fusion splicing, OTDR testing, and long-term fiber optic cable infrastructure maintenance."
                    : "Instalasi, penyambungan fusion splicing, pengukuran OTDR, dan pemeliharaan kabel serat optik.",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bc0c11" strokeWidth="2">
                      <path d="M4 11a9 9 0 0 1 9 9" />
                      <path d="M4 4a16 16 0 0 1 16 16" />
                      <circle cx="5" cy="19" r="1" />
                    </svg>
                  ),
                },
                {
                  title: "Wireless & Microwave Communication",
                  desc: isEn
                    ? "Radio links configuration, Base Transceiver Stations (BTS), and cellular high-frequency transmission."
                    : "Konfigurasi radio link, base transceiver station (BTS), serta transmisi frekuensi nirkabel seluler.",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bc0c11" strokeWidth="2">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                      <line x1="12" y1="20" x2="12.01" y2="20" />
                    </svg>
                  ),
                },
              ].map((comp) => (
                <div key={comp.title} className="flex items-start gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
                    {comp.icon}
                  </div>
                  <div>
                    <h4 className="font-jakarta font-semibold text-sm sm:text-base text-[#101828]">
                      {comp.title}
                    </h4>
                    <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] mt-0.5">
                      {comp.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Prospek Kerja */}
            <div className="order-4 lg:col-span-7 lg:col-start-6 lg:row-start-3">
              <div className="rounded-2xl bg-white border-2 border-dashed border-[#d1d5dc] p-4 sm:p-5">
                <h4 className="font-jakarta font-semibold text-sm sm:text-base text-[#c10007]">
                  {isEn ? "Career Prospects:" : "Prospek Kerja:"}
                </h4>
                <p className="font-jakarta text-xs sm:text-sm text-[#364153] mt-1 leading-relaxed">
                  Fiber Optic Engineer, Telecom Network Specialist, BTS Engineer, Wireless Technician, ISP Support Engineer.
                </p>
              </div>
            </div>

            {/* 5. CTA Button */}
            <div className="order-5 lg:col-span-7 lg:col-start-6 lg:row-start-4">
              <Link
                href="/program/profil-jurusan?jurusan=TJAT#kompetensi"
                className="group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] px-7 py-3 text-sm sm:text-base font-medium text-white transition-all hover:bg-[#990a0e] active:scale-[0.98]"
                style={{
                  boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                }}
              >
                <span className="font-jakarta font-medium">{t("programs.learnMore", "Pelajari Lebih Lanjut")}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
