"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  BookOpen,
  Globe2,
  GraduationCap,
  Network,
  Cloud,
  Cpu,
  Lightbulb,
  Monitor,
  Code2,
  Palette,
  Server,
  CloudCog,
  ShieldCheck,
  Building2,
  Cable,
  Wifi,
  Radio,
  Clock,
  LucideIcon,
} from "lucide-react";

type JurusanKey = "SIJA" | "TJAT";

interface SubjectItem {
  nameId: string;
  nameEn: string;
  icon: LucideIcon;
}

interface JurusanData {
  key: JurusanKey;
  label: string;
  badgeId: string;
  badgeEn: string;
  titleRedId: string;
  titleRedEn: string;
  titleBlackId: string;
  titleBlackEn: string;
  descriptionId: string;
  descriptionEn: string;
  durationId: string;
  durationEn: string;
  studentImage: string;
  studentAlt: string;
  badgeIcon: string;
  subjects: SubjectItem[];
}

const jurusanContent: Record<JurusanKey, JurusanData> = {
  SIJA: {
    key: "SIJA",
    label: "SIJA",
    badgeId: "Sistem Informasi Jaringan & Aplikasi",
    badgeEn: "Information Systems, Networks & Applications",
    titleRedId: "Sistem Informasi",
    titleRedEn: "Information Systems",
    titleBlackId: "Jaringan dan Aplikasi",
    titleBlackEn: "Networks and Applications",
    descriptionId:
      "Merupakan kompetensi keahlian baru berbasis Teknologi Informasi dan Komunikasi pada program keahlian Teknik Komputer dan Informatika yang mulai dibuka pada Tahun Pelajaran 2017/2018 untuk program pendidikan SMK dengan pembelajaran Empat (4) Tahun. Sesuai dengan Keputusan Dirjen Dikdasmen Kemendikbud Nomor: 4678/D/KEP/MK/2016.",
    descriptionEn:
      "A forward-looking IT competency within Computer and Informatics Engineering introduced in 2017/2018 for a comprehensive Four (4) Year vocational program, tailored to equip students with enterprise cloud, cybersecurity, and software skills.",
    durationId: "Masa pendidikan 4 tahun",
    durationEn: "4-Year Education Program",
    studentImage: "/images/program/profil-jurusan/jurusan-sija-character.png",
    studentAlt: "Siswi SIJA SMK Telkom Sidoarjo",
    badgeIcon: "/images/common/icons/ph-code-fill.svg",
    subjects: [
      { nameId: "Kelompok Mata Pelajaran Nasional", nameEn: "National Standard Curriculum", icon: BookOpen },
      { nameId: "Kelompok Mata Pelajaran Kewilayahan", nameEn: "Regional Studies Modules", icon: Globe2 },
      { nameId: "Kelompok Mata Pelajaran Peminatan", nameEn: "Specialized Major Subjects", icon: GraduationCap },
      { nameId: "Komputer dan Jaringan Dasar", nameEn: "Computer & Basic Networking", icon: Network },
      { nameId: "Platform Komputasi Awan", nameEn: "Cloud Computing Platforms", icon: Cloud },
      { nameId: "Sistem Internet of Things (SIoT)", nameEn: "Internet of Things Systems (SIoT)", icon: Cpu },
      { nameId: "Produk Kreatif dan Kewirausahaan", nameEn: "Creative Products & Entrepreneurship", icon: Lightbulb },
      { nameId: "Sistem Komputer", nameEn: "Computer Architecture", icon: Monitor },
      { nameId: "Pemrograman Dasar", nameEn: "Fundamental Programming", icon: Code2 },
      { nameId: "Dasar Desain Grafis", nameEn: "Graphic Design Fundamentals", icon: Palette },
      { nameId: "Infrastruktur Komputasi Awan", nameEn: "Cloud Infrastructure Management", icon: Server },
      { nameId: "Layanan Komputasi Awan", nameEn: "Cloud Service Solutions", icon: CloudCog },
      { nameId: "Sistem Keamanan Jaringan", nameEn: "Network Security Systems", icon: ShieldCheck },
      { nameId: "Materi sinkronisasi dengan industri", nameEn: "Industry Synchronized Syllabus", icon: Building2 },
    ],
  },
  TJAT: {
    key: "TJAT",
    label: "TJAT",
    badgeId: "Teknik Jaringan Akses Telekomunikasi",
    badgeEn: "Telecommunication Access Network Engineering",
    titleRedId: "Teknik Jaringan Akses",
    titleRedEn: "Access Network Engineering",
    titleBlackId: "Telekomunikasi",
    titleBlackEn: "Telecommunications",
    descriptionId:
      "Merupakan program keahlian unggulan SMK Telkom Sidoarjo yang berfokus pada teknologi transmisi gelombang, instalasi dan penyambungan serat optik (Fiber Optic), konfigurasi jaringan nirkabel (Wireless & Seluler), serta pemeliharaan infrastruktur telekomunikasi terintegrasi standar industri Telkom.",
    descriptionEn:
      "A flagship vocational program focused on wave transmission, fiber optic fusion splicing and installation, cellular and wireless network engineering, and integrated telecommunication infrastructure adhering to Telkom Group standards.",
    durationId: "Masa pendidikan 3 tahun",
    durationEn: "3-Year Education Program",
    studentImage: "/images/program/profil-jurusan/jurusan-tjat-curved.png",
    studentAlt: "Siswa TJAT SMK Telkom Sidoarjo",
    badgeIcon: "/images/program/profil-jurusan/icon-tjat.svg",
    subjects: [
      { nameId: "Jaringan Fiber Optic", nameEn: "Fiber Optic Networks", icon: Cable },
      { nameId: "Jaringan Komputer", nameEn: "Computer Networking", icon: Network },
      { nameId: "Jaringan Nirkabel / Wireless", nameEn: "Wireless & Microwave Networks", icon: Wifi },
      { nameId: "Pemrograman Web", nameEn: "Web Development", icon: Code2 },
      { nameId: "Desain Grafis", nameEn: "Graphic Design", icon: Palette },
      { nameId: "Internet of things (IOT)", nameEn: "Internet of Things (IoT)", icon: Radio },
      { nameId: "Sistem Keamanan Jaringan", nameEn: "Network Security Systems", icon: ShieldCheck },
      { nameId: "Produk Kreatif dan Kewirausahaan", nameEn: "Creative Products & Entrepreneurship", icon: Lightbulb },
      { nameId: "Materi sinkronisasi dengan industri", nameEn: "Industry Synchronized Syllabus", icon: Building2 },
    ],
  },
};

export default function MembangunKompetensiSection() {
  const { isEn } = useLanguage();
  const searchParams = useSearchParams();
  const jurusanParam =
    searchParams.get("jurusan")?.toUpperCase() ||
    searchParams.get("tab")?.toUpperCase();

  const [activeJurusan, setActiveJurusan] = useState<JurusanKey>(() => {
    if (jurusanParam === "TJAT" || jurusanParam === "TJA") return "TJAT";
    return "SIJA";
  });

  useEffect(() => {
    if (jurusanParam === "TJAT" || jurusanParam === "TJA") {
      setActiveJurusan("TJAT");
    } else if (jurusanParam === "SIJA") {
      setActiveJurusan("SIJA");
    } else {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("tjat") || hash.includes("tja")) {
        setActiveJurusan("TJAT");
      } else if (hash.includes("sija")) {
        setActiveJurusan("SIJA");
      }
    }

    if (jurusanParam || window.location.hash.includes("kompetensi")) {
      const timer = setTimeout(() => {
        const el = document.getElementById("kompetensi");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [jurusanParam]);

  const current = jurusanContent[activeJurusan];

  return (
    <section
      id="kompetensi"
      className="relative w-full py-20 lg:py-28 bg-white border-t border-gray-200/60 overflow-hidden scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Top Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight tracking-tight text-[#101828]">
            {isEn ? "Building Competencies" : "Membangun Kompetensi"}
          </h2>
          <p className="font-jakarta font-semibold text-xl sm:text-2xl text-[#101828] mt-1">
            {isEn ? "Aligned with Student Passions & Talents." : "Sesuai Minat dan Bakat Siswa."}
          </p>
          <div className="h-[3px] w-12 rounded-full bg-[#bc0c11] mt-5" />

          {/* Segmented Pill Tabs with Animated Sliding Pill Indicator */}
          <div className="mt-8 relative inline-flex h-[52px] w-[340px] items-center rounded-full bg-[#f3f4f6] p-1 shadow-sm border border-gray-200/60">
            {/* SIJA Button */}
            <button
              type="button"
              onClick={() => setActiveJurusan("SIJA")}
              className={`relative z-10 flex-1 h-full rounded-full flex items-center justify-center gap-2 font-jakarta text-sm font-medium transition-colors duration-200 cursor-pointer select-none ${
                activeJurusan === "SIJA"
                  ? "text-white font-semibold"
                  : "text-[#364153] hover:text-[#bc0c11]"
              }`}
            >
              {activeJurusan === "SIJA" && (
                <motion.div
                  layoutId="activeJurusanPill"
                  className="absolute inset-0 rounded-full bg-[#bc0c11] shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>SIJA</span>
            </button>

            {/* TJAT Button */}
            <button
              type="button"
              onClick={() => setActiveJurusan("TJAT")}
              className={`relative z-10 flex-1 h-full rounded-full flex items-center justify-center gap-2 font-jakarta text-sm font-medium transition-colors duration-200 cursor-pointer select-none ${
                activeJurusan === "TJAT"
                  ? "text-white font-semibold"
                  : "text-[#364153] hover:text-[#bc0c11]"
              }`}
            >
              {activeJurusan === "TJAT" && (
                <motion.div
                  layoutId="activeJurusanPill"
                  className="absolute inset-0 rounded-full bg-[#bc0c11] shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
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

        {/* Content Container with Clean, Instant Crossfade */}
        <motion.div
          key={activeJurusan}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Main Jurusan Showcase Box */}
          <div className="my-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left: Student Character & Graphic Shape */}
              <div className="lg:col-span-5 flex items-center justify-center relative">
                <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] aspect-[446/557] flex items-center justify-center">
                  <Image
                    src={current.studentImage}
                    alt={current.studentAlt}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 380px, 420px"
                  />
                </div>
              </div>

              {/* Right: Detailed Info */}
              <div className="lg:col-span-7 flex flex-col items-start">
                {/* Title: Red on Top, Black Below */}
                <h3 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-[40px] leading-[1.18] tracking-tight">
                  <span className="text-[#bc0c11] block">{isEn ? current.titleRedEn : current.titleRedId}</span>
                  <span className="text-[#101828] block">{isEn ? current.titleBlackEn : current.titleBlackId}</span>
                </h3>

                {/* Description Paragraph */}
                <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed mt-5 mb-5">
                  {isEn ? current.descriptionEn : current.descriptionId}
                </p>

                {/* Duration Badge */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/90 bg-gray-50/80 px-3.5 py-1.5 font-jakarta text-xs sm:text-sm font-semibold text-[#101828] shadow-2xs">
                    <Clock className="size-4 text-[#bc0c11]" strokeWidth={2} />
                    <span>{isEn ? current.durationEn : current.durationId}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* "Apa saja yang di pelajari?" Section */}
          <div className="mt-20 pt-10 border-t border-gray-100">
            <div className="text-center mb-10">
              <h3 className="font-jakarta font-bold text-2xl sm:text-3xl text-[#101828]">
                {isEn ? (
                  <>
                    Key Curriculum <span className="text-[#bc0c11]">Modules</span>
                  </>
                ) : (
                  <>
                    Apa saja yang <span className="text-[#bc0c11]">di pelajari?</span>
                  </>
                )}
              </h3>
            </div>

            {/* Subjects Grid with Dashed Border Cards & Minimalist Professional Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {current.subjects.map((sub, idx) => {
                const IconComponent = sub.icon;
                return (
                  <div
                    key={`${activeJurusan}-${idx}-${sub.nameId}`}
                    className="group relative min-h-[76px] rounded-[20px] bg-white p-4 flex items-center gap-3.5 border-2 border-dashed border-[#d1d5dc] transition-all duration-200 hover:border-[#bc0c11] hover:shadow-xs"
                  >
                    {/* Minimalist Red Icon Container */}
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#bc0c11]/10 text-[#bc0c11] group-hover:bg-[#bc0c11] group-hover:text-white transition-all duration-200 shrink-0">
                      <IconComponent className="size-5 transition-colors" />
                    </div>

                    {/* Subject Name */}
                    <p className="font-jakarta font-semibold text-xs sm:text-sm text-[#101828] group-hover:text-[#bc0c11] transition-colors leading-snug">
                      {isEn ? sub.nameEn : sub.nameId}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
