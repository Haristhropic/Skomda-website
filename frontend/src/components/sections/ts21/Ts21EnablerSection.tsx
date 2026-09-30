"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Laptop2,
  Database,
  ShieldAlert,
  UserCheck,
  Video,
  Award,
  Building,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const getDigitalEnablers = (isEn: boolean) => [
  {
    name: "iGRACIAS",
    category: isEn ? "Integrated Academic Portal" : "Integrated Academic Portal",
    desc: isEn
      ? "Integrated management information system of Telkom Schools for student administration and operations."
      : "Sistem informasi manajemen terpadu Telkom Schools untuk administrasi, data siswa, dan operasional sekolah.",
    icon: <Database className="size-5" />,
  },
  {
    name: "SIAKAD Online",
    category: isEn ? "Academic Information System" : "Academic Information System",
    desc: isEn
      ? "Digital grade recording, academic reporting, daily attendance, and curriculum progression monitoring."
      : "Platform pencatatan nilai, rapor digital, presensi KBM, dan pemantauan capaian kurikulum harian.",
    icon: <GraduationCap className="size-5" />,
  },
  {
    name: "LMS Telkom Schools",
    category: isEn ? "Learning Management System" : "Learning Management System",
    desc: isEn
      ? "Standardized virtual classroom for module distribution, project submission, and active peer discussions."
      : "Ruang kelas virtual terstandardisasi untuk distribusi modul, penugasan proyek, dan diskusi interaktif.",
    icon: <Laptop2 className="size-5" />,
  },
  {
    name: "E-Library",
    category: isEn ? "Digital Library & Resources" : "Digital Library & Resources",
    desc: isEn
      ? "24/7 access to thousands of digital textbooks, technology journals, lab manuals, and academic references."
      : "Akses 24/7 ke ribuan buku digital, jurnal teknologi, modul praktikum, dan referensi akademik modern.",
    icon: <BookOpen className="size-5" />,
  },
  {
    name: "DITA / JIWA",
    category: isEn ? "Character & Activity Tracker" : "Character & Activity Tracker",
    desc: isEn
      ? "Student soft skills, behavioral discipline, character growth, and extracurricular participation tracking platform."
      : "Platform pemantauan perkembangan karakter (soft skill), kedisiplinan, dan portofolio keikutsertaan siswa.",
    icon: <ShieldAlert className="size-5" />,
  },
];

const getTeacherDevelopment = (isEn: boolean) => [
  {
    title: isEn ? "Merdeka Mengajar Platform (PMM)" : "Platform Merdeka Mengajar (PMM)",
    desc: isEn
      ? "Continuous pedagogical competency enhancement adhering to national vocational standards."
      : "Peningkatan kompetensi pedagogik guru secara berkelanjutan mengikuti standar kurikulum nasional.",
    icon: <UserCheck className="size-5" />,
  },
  {
    title: isEn ? "Regular Webinars & Workshops" : "Webinar & Training Berkala",
    desc: isEn
      ? "Intensive training on emerging technology trends, Artificial Intelligence, and modern teaching methodologies."
      : "Workshop intensif seputar tren teknologi baru, Artificial Intelligence, dan metodologi mengajar modern.",
    icon: <Video className="size-5" />,
  },
  {
    title: isEn ? "Teacher Industry Certifications" : "Sertifikasi Industri Guru",
    desc: isEn
      ? "BNSP assessor certifications and global vendor credentials (Cisco, MikroTik, AWS) for vocational educators."
      : "Sertifikasi keahlian BNSP dan vendor global (Cisco, MikroTik, AWS) untuk para pengajar kejuruan.",
    icon: <Award className="size-5" />,
  },
  {
    title: isEn ? "Teacher Industry Internship" : "Program Guru Magang",
    desc: isEn
      ? "Periodic teacher immersion in IT and telecommunication companies to ensure classroom learning stays synchronized."
      : "Penerjunan guru secara berkala ke industri IT dan telekomunikasi agar materi ajar selalu sinkron.",
    icon: <Building className="size-5" />,
  },
];

export default function Ts21EnablerSection() {
  const { isEn } = useLanguage();
  const digitalEnablers = getDigitalEnablers(isEn);
  const teacherDevelopment = getTeacherDevelopment(isEn);

  return (
    <section
      id="enabler"
      className="relative w-full py-20 lg:py-28 bg-white border-t border-gray-200/60 overflow-hidden scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight tracking-tight text-[#101828]">
            {isEn ? (
              <>
                Digital Enablers &{" "}
                <span className="text-[#bc0c11]">Skill Development</span>
              </>
            ) : (
              <>
                Digital Enabler &{" "}
                <span className="text-[#bc0c11]">Skill Development</span>
              </>
            )}
          </h2>
          <div className="section-title-line" />
          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed mt-2">
            {isEn
              ? "An integrated digital ecosystem and educator skill acceleration underpinning the success of the TS.21 Program."
              : "Ekosistem teknologi digital terintegrasi serta akselerasi kompetensi guru yang menjadi pilar penopang keberhasilan implementasi Program TS.21."}
          </p>
        </motion.div>

        {/* 1. Digital Enablers Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#bc0c11] font-jakarta">
                {isEn ? "School Technology Platforms" : "Platform Teknologi Sekolah"}
              </span>
              <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828] mt-1">
                {isEn ? "TS.21 Digital Enablers & Applications" : "Aplikasi & Digital Enabler TS.21"}
              </h3>
            </div>
            <span className="hidden sm:inline-block font-jakarta text-xs text-[#6b7280]">
              {isEn ? "Integrated with Telkom Schools" : "Terintegrasi Telkom Schools"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {digitalEnablers.map((tool) => (
              <div
                key={tool.name}
                className="group relative rounded-[22px] neu-card-interactive p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#bc0c11]/10 text-[#bc0c11] group-hover:bg-[#bc0c11] group-hover:text-white transition-all duration-300 mb-4 shadow-xs">
                    {tool.icon}
                  </div>
                  <h4 className="font-jakarta font-bold text-base text-[#101828] group-hover:text-[#bc0c11] transition-colors leading-snug">
                    {tool.name}
                  </h4>
                  <span className="text-[11px] font-semibold text-[#bc0c11] font-jakarta block mt-0.5 mb-2">
                    {tool.category}
                  </span>
                  <p className="font-jakarta text-xs text-[#4a5565] leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Teacher & Mentor Skill Development Card */}
        <div className="rounded-[28px] neu-inset-panel p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-200/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#bc0c11] font-jakarta">
                {isEn ? "Professional Educators" : "Tenaga Pendidik Profesional"}
              </span>
              <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828] mt-1">
                {isEn ? "Teacher Competency & Skill Acceleration" : "Peningkatan Kompetensi & Skill Guru"}
              </h3>
            </div>
            <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] max-w-md">
              {isEn
                ? "SMK Telkom Sidoarjo teachers regularly participate in certified upskilling, global vendor programs, and corporate internships."
                : "Guru SMK Telkom Sidoarjo rutin mengikuti pelatihan, sertifikasi internasional, dan magang industri agar pembelajaran selalu relevan."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teacherDevelopment.map((teach) => (
              <div
                key={teach.title}
                className="rounded-[20px] bg-white p-6 border border-gray-200/80 hover:border-[#bc0c11] transition-colors"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#bc0c11] text-white shadow-xs mb-4">
                  {teach.icon}
                </div>
                <h4 className="font-jakarta font-bold text-sm sm:text-base text-[#101828] leading-snug mb-2">
                  {teach.title}
                </h4>
                <p className="font-jakarta text-xs text-[#4a5565] leading-relaxed">
                  {teach.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
