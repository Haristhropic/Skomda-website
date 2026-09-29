"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Briefcase, GraduationCap, Handshake } from "lucide-react";

export default function BkkPeranSection() {
  const { isEn, t } = useLanguage();

  const peranItems = [
    {
      id: "peluang",
      number: "01",
      icon: <Briefcase className="size-7 text-[#bc0c11]" />,
      title: isEn ? "Opportunity" : "Peluang Karier & Magang",
      description: isEn
        ? "Discover verified job vacancies, internships, and direct campus recruitment programs."
        : "Akses informasi lowongan kerja terverifikasi, program magang industri, dan rekrutmen khusus kampus.",
      detail: isEn ? "Direct Company Vacancy" : "Lowongan Resmi Mitra Industri",
    },
    {
      id: "persiapan",
      number: "02",
      icon: <GraduationCap className="size-7 text-[#bc0c11]" />,
      title: isEn ? "Preparation" : "Kesiapan & Pelatihan Kerja",
      description: isEn
        ? "Access job readiness workshops, soft skills training, interview coaching, and vocational mentoring."
        : "Pelatihan kesiapan kerja, simulasi interview HRD, penguatan portofolio, dan bimbingan karier terstruktur.",
      detail: isEn ? "Career Readiness Program" : "Bimbingan Portofolio & Wawancara",
    },
    {
      id: "koneksi",
      number: "03",
      icon: <Handshake className="size-7 text-[#bc0c11]" />,
      title: isEn ? "Connection" : "Koneksi Industri & Alumni",
      description: isEn
        ? "Connect directly with prominent alumni networks and nationwide corporate enterprise partners."
        : "Jejaring langsung dengan ratusan alumni sukses di berbagai sektor IT serta puluhan mitra perusahaan nasional.",
      detail: isEn ? "Extensive Partner Network" : "Jejaring 50+ Perusahaan Mitra",
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-gray-200/60 scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Signature Red Divider */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-[#101828] mb-3 tracking-tight">
            {isEn ? (
              <>
                Strategic Roles of <span className="text-[#bc0c11]">BKK Skomda</span>
              </>
            ) : (
              <>
                Peran Strategis <span className="text-[#bc0c11]">BKK Skomda</span>
              </>
            )}
          </h2>

          <div className="mx-auto h-1 w-12 rounded-full bg-[#bc0c11] mb-4" />

          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
            {t(
              "bkk.peranSubtitle",
              "Pusat layanan karir terintegrasi untuk menjembatani talenta vokasi SMK Telkom Sidoarjo dengan dunia industri dan dunia kerja profesional."
            )}
          </p>
        </div>

        {/* 3 Pillars Cards Grid styled like K3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {peranItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-[24px] bg-white p-6 sm:p-7 flex flex-col justify-between border-2 border-dashed border-[#d1d5dc] transition-all duration-300 hover:border-[#bc0c11] hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[#bc0c11]">
                    {item.icon}
                  </div>
                  <span className="font-jakarta font-extrabold text-2xl sm:text-3xl text-gray-300 group-hover:text-[#bc0c11]/40 transition-colors">
                    {item.number}
                  </span>
                </div>

                <h3 className="font-jakarta font-bold text-lg sm:text-xl text-[#101828] group-hover:text-[#bc0c11] transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-200 font-jakarta text-xs text-gray-500 font-medium">
                <span>{item.detail}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
