"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  Users2,
  Award,
  Globe2,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

interface AdvantageItem {
  number: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  icon: React.ReactNode;
}

const advantages: AdvantageItem[] = [
  {
    number: "01",
    titleId: "Kurikulum Sinkronisasi Industri",
    titleEn: "Industry-Synchronized Curriculum",
    descId: "Materi pembelajaran diselaraskan langsung dengan standar kebutuhan Telkom Group, Wowrack, Weza Group, dan puluhan mitra IT ternama.",
    descEn: "Learning syllabus aligned directly with the workforce requirements of Telkom Group, Wowrack, Weza Group, and prominent IT partners.",
    icon: <Users2 className="size-7" aria-hidden="true" />,
  },
  {
    number: "02",
    titleId: "Sertifikasi Profesi Nasional (BNSP)",
    titleEn: "National Professional Certification (BNSP)",
    descId: "Setiap siswa mengikuti uji sertifikasi keahlian berstandar Badan Nasional Sertifikasi Profesi melalui Lembaga Sertifikasi Profesi (LSP-P1).",
    descEn: "Every student undergoes competency certification assessments under the National Professional Certification Board via LSP-P1.",
    icon: <Award className="size-7" aria-hidden="true" />,
  },
  {
    number: "03",
    titleId: "Sertifikasi Vendor Global",
    titleEn: "Global Vendor Certifications",
    descId: "Kesempatan meraih sertifikasi bertaraf internasional seperti Cisco (CCNA), MikroTik (MTCNA), AWS Cloud Practitioner, dan Oracle Academy.",
    descEn: "Opportunity to obtain international credentials such as Cisco (CCNA), MikroTik (MTCNA), AWS Cloud Practitioner, and Oracle Academy.",
    icon: <Globe2 className="size-7" aria-hidden="true" />,
  },
  {
    number: "04",
    titleId: "Teaching Factory & Magang Industri",
    titleEn: "Teaching Factory & Industrial Internships",
    descId: "Pembelajaran berbasis proyek riil industri (Project-Based Learning) serta program Praktik Kerja Lapangan intensif di ekosistem digital Indonesia.",
    descEn: "Project-based learning on authentic industry workflows combined with intensive digital ecosystem internships.",
    icon: <Briefcase className="size-7" aria-hidden="true" />,
  },
];

const getCertifications = (isEn: boolean) => [
  { name: "BNSP LSP-P1", tag: isEn ? "National Professional Standard" : "Standar Nasional Profesi" },
  { name: "MikroTik Academy (MTCNA)", tag: "Networking Certification" },
  { name: "Cisco Networking Academy", tag: "Enterprise Routing & Switching" },
  { name: "AWS Academy", tag: "Cloud Architecture & Computing" },
  { name: "Oracle Academy", tag: "Database & Java Programming" },
  { name: "Telkom Certified Engineer", tag: isEn ? "Fiber Optic & Core Telecom" : "Fiber Optic & Telecom Core" },
];

export default function KeunggulanSertifikasiSection() {
  const { isEn, t } = useLanguage();
  const certifications = getCertifications(isEn);

  return (
    <section
      id="keunggulan-sertifikasi"
      className="relative w-full py-20 lg:py-28 bg-[#f9fafb] border-t border-gray-200/60 overflow-hidden scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-[#101828]">
            {isEn ? (
              <>
                Curriculum Excellence &amp;{" "}
                <span className="text-[#bc0c11]">Industry Certifications</span>
              </>
            ) : (
              <>
                Keunggulan Kurikulum &amp;{" "}
                <span className="text-[#bc0c11]">Sertifikasi Industri</span>
              </>
            )}
          </h2>
          <div className="h-[3px] w-12 rounded-full bg-[#bc0c11] mt-4 mb-3" />
          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
            {t("profilJurusan.sertifikasiDesc")}
          </p>
        </motion.div>

        {/* 4 Cards: Mobile Horizontal Scroll & Desktop Grid */}
        <div dir="ltr" className="flex justify-start overflow-x-auto pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12 sm:mb-16 snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none">
          {advantages.map((item) => (
            <div
              key={item.number}
              className="w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none group relative rounded-[24px] bg-white p-6 sm:p-7 flex flex-col justify-between border-2 border-dashed border-[#d1d5dc] transition-all duration-300 hover:border-[#bc0c11] hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Top Header: Unboxed Icon & Large Gray Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[#bc0c11] shrink-0">
                    {item.icon}
                  </div>
                  <span className="font-jakarta font-extrabold text-2xl sm:text-3xl text-gray-300 group-hover:text-[#bc0c11]/40 transition-colors">
                    {item.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-jakarta font-bold text-lg text-[#101828] group-hover:text-[#bc0c11] transition-colors leading-snug mb-2">
                  {isEn ? item.titleEn : item.titleId}
                </h3>

                {/* Description */}
                <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed">
                  {isEn ? item.descEn : item.descId}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Certification Logos & Badges Banner */}
        <div className="rounded-[24px] bg-white p-7 sm:p-9 border-2 border-dashed border-[#d1d5dc]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
              <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828]">
                {isEn ? "Certification Programs Available for Students" : "Program Sertifikasi yang Dapat Diikuti Siswa"}
              </h3>
            </div>
            <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] max-w-md">
              {isEn
                ? "Recognized by industry associations, serving as a standout milestone in graduation portfolios."
                : "Diakui oleh asosiasi industri dan menjadi nilai tambah utama pada portofolio kelulusan."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="group flex items-center gap-3.5 p-3.5 rounded-[18px] bg-[#f8f9fb] border-2 border-dashed border-[#d1d5dc] hover:border-[#bc0c11] transition-all duration-200"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#bc0c11]/10 text-[#bc0c11] group-hover:bg-[#bc0c11] group-hover:text-white transition-all duration-200">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-jakarta font-bold text-xs sm:text-sm text-[#101828] group-hover:text-[#bc0c11] transition-colors">
                    {cert.name}
                  </span>
                  <span className="font-jakarta text-[11px] text-[#6b7280]">
                    {cert.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
