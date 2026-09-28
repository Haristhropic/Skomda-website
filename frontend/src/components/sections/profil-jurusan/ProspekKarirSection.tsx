"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Rocket, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CareerPath {
  roleId: string;
  roleEn: string;
  focusId: string;
  focusEn: string;
}

interface MajorCareer {
  majorId: string;
  majorEn: string;
  code: "SIJA" | "TJAT";
  badgeColor: string;
  scope: string;
  summaryId: string;
  summaryEn: string;
  careers: CareerPath[];
  popularCompaniesId: string[];
  popularCompaniesEn: string[];
}

const getCareerData = (): MajorCareer[] => [
  {
    majorId: "Sistem Informasi Jaringan dan Aplikasi",
    majorEn: "Information Systems, Networks and Applications",
    code: "SIJA",
    badgeColor: "bg-[#bc0c11]/10 text-[#bc0c11]",
    scope: "(Software, Cloud & Cyber)",
    summaryId:
      "Lulusan SIJA siap berkarir di industri software development, cloud infrastructure, sistem enterprise, dan keamanan siber.",
    summaryEn:
      "SIJA graduates are prepared for careers in software development, cloud infrastructure, enterprise systems, and cybersecurity.",
    careers: [
      {
        roleId: "Full-Stack & Mobile Developer",
        roleEn: "Full-Stack & Mobile Developer",
        focusId: "Merancang dan membangun aplikasi web dan mobile modern untuk kebutuhan bisnis.",
        focusEn: "Designing and building modern web and mobile applications for enterprise needs.",
      },
      {
        roleId: "Cloud & DevOps Engineer",
        roleEn: "Cloud & DevOps Engineer",
        focusId: "Mengelola arsitektur server awan (AWS/GCP), containerization, dan otomasi deployment CI/CD.",
        focusEn: "Managing cloud server architecture (AWS/GCP), containerization, and CI/CD deployment pipelines.",
      },
      {
        roleId: "Database & System Administrator",
        roleEn: "Database & System Administrator",
        focusId: "Merancang skema database, optimalisasi query, dan pemeliharaan server data perusahaan.",
        focusEn: "Architecting database schemas, query optimization, and company data server maintenance.",
      },
      {
        roleId: "Cybersecurity Analyst",
        roleEn: "Cybersecurity Analyst",
        focusId: "Melakukan audit keamanan jaringan, proteksi celah sistem, dan penanganan insiden digital.",
        focusEn: "Conducting network security audits, vulnerability mitigation, and digital incident response.",
      },
    ],
    popularCompaniesId: [
      "Software House",
      "Startup Unicorn / Perusahaan Teknologi",
      "Perbankan & Fintech",
      "Instansi Pemerintahan / BUMN",
    ],
    popularCompaniesEn: [
      "Software Houses",
      "Tech Startups / Unicorns",
      "Banking & Fintech",
      "State-Owned Enterprises (BUMN)",
    ],
  },
  {
    majorId: "Teknik Jaringan Akses Telekomunikasi",
    majorEn: "Telecommunication Access Network Engineering",
    code: "TJAT",
    badgeColor: "bg-[#101828]/8 text-[#101828]",
    scope: "(Fiber Optic & Telecom)",
    summaryId:
      "Lulusan TJAT memiliki kompetensi khusus yang sangat dicari oleh operator telekomunikasi, Internet Service Provider (ISP), dan kontraktor jaringan.",
    summaryEn:
      "TJAT graduates hold specialized competencies in high demand across telecommunication operators, Internet Service Providers (ISPs), and network contractors.",
    careers: [
      {
        roleId: "Fiber Optic Project Engineer",
        roleEn: "Fiber Optic Project Engineer",
        focusId: "Perencanaan rute kabel serat optik (FTTH/FTTx), penyambungan fusion splicing, dan uji OTDR.",
        focusEn: "Fiber optic route engineering (FTTH/FTTx), precision fusion splicing, and OTDR testing.",
      },
      {
        roleId: "Network Operations Center (NOC) Engineer",
        roleEn: "Network Operations Center (NOC) Engineer",
        focusId: "Monitoring traffic jaringan 24/7, troubleshooting link terputus, dan menjaga SLA konektivitas.",
        focusEn: "24/7 network traffic monitoring, link failure troubleshooting, and uptime SLA maintenance.",
      },
      {
        roleId: "Wireless & Cellular Transmission Specialist",
        roleEn: "Wireless & Cellular Transmission Specialist",
        focusId: "Instalasi dan pemeliharaan perangkat Base Transceiver Station (BTS) dan radio link telekomunikasi.",
        focusEn: "Installation and maintenance of Base Transceiver Stations (BTS) and microwave radio links.",
      },
      {
        roleId: "ISP Infrastructure Technician",
        roleEn: "ISP Infrastructure Technician",
        focusId: "Konfigurasi perangkat routing & switching backbone, distribusi bandwidth, dan instalasi pelanggan korporasi.",
        focusEn: "Backbone routing and switching configuration, bandwidth distribution, and enterprise client setup.",
      },
    ],
    popularCompaniesId: [
      "Telkom Group & Telkomsel",
      "Internet Service Provider (ISP)",
      "Tower & BTS Infrastructure",
      "Kontraktor Jaringan Fiber",
    ],
    popularCompaniesEn: [
      "Telkom Group & Telkomsel",
      "Internet Service Providers (ISPs)",
      "Tower & BTS Infrastructure Companies",
      "Fiber Network Contractors",
    ],
  },
];

const getBmwData = (isEn: boolean) => [
  {
    letter: "B",
    title: isEn ? "Bekerja (Work)" : "Bekerja",
    subtitle: isEn ? "Industry & IT Corporates" : "Industri & Korporasi IT",
    desc: isEn
      ? "Directly absorbable into tech industries, telecom giants, startups, and state-owned enterprises with certified portfolios."
      : "Siap langsung terserap di industri teknologi, telekomunikasi, startup unicorn, maupun instansi BUMN berbekal sertifikasi resmi dan portofolio proyek riil.",
    icon: <Briefcase className="size-7" aria-hidden="true" strokeWidth={1.75} />,
  },
  {
    letter: "M",
    title: isEn ? "Melanjutkan (Study)" : "Melanjutkan",
    subtitle: isEn ? "Top Renowned Universities" : "Perguruan Tinggi Ternama",
    desc: isEn
      ? "Strong academic preparation and merit scholarship pathways for bachelor degree studies at top universities (ITB, ITS, Telkom University, etc.)."
      : "Kesiapan akademik unggul dan peluang beasiswa prestasi untuk melanjutkan studi sarjana ke PTN dan PTS favorit (ITB, ITS, Telkom University, dll.).",
    icon: <GraduationCap className="size-7" aria-hidden="true" strokeWidth={1.75} />,
  },
  {
    letter: "W",
    title: isEn ? "Wirausaha (Business)" : "Wirausaha",
    subtitle: isEn ? "Technopreneur & Digital Startup" : "Technopreneur & Digital Startup",
    desc: isEn
      ? "Establish independent tech ventures, software agencies, fiber optic network contracting, or innovative tech startups."
      : "Mendirikan bisnis teknologi mandiri, software house, agensi digital, jasa instalasi jaringan fiber optik, atau startup inovatif.",
    icon: <Rocket className="size-7" aria-hidden="true" strokeWidth={1.75} />,
  },
];

export default function ProspekKarirSection() {
  const { isEn, t } = useLanguage();
  const careerData = getCareerData();
  const bmwData = getBmwData(isEn);

  return (
    <section
      id="prospek-karir"
      className="relative w-full py-20 lg:py-28 bg-white border-t border-gray-200/60 overflow-hidden scroll-mt-24"
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
                Career Opportunities &amp;{" "}
                <span className="text-[#bc0c11]">Graduate Prospects</span>
              </>
            ) : (
              <>
                Peluang Karir &amp;{" "}
                <span className="text-[#bc0c11]">Prospek Kerja Lulusan</span>
              </>
            )}
          </h2>
          <div className="h-[3px] w-12 rounded-full bg-[#bc0c11] mt-4 mb-3" />
          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
            {t("profilJurusan.prospekDesc")}
          </p>
        </motion.div>

        {/* 2 Majors Career Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-stretch">
          {careerData.map((item) => (
            <div
              key={item.code}
              className="group relative rounded-[24px] bg-white p-7 sm:p-9 flex flex-col justify-between border-2 border-dashed border-[#d1d5dc] transition-all duration-300 hover:border-[#bc0c11] hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Header */}
                <div className="flex flex-col gap-2 pb-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="font-jakarta font-extrabold text-2xl sm:text-3xl text-[#bc0c11] tracking-tight">
                      {item.code}
                    </span>
                    <span className="rounded-full bg-[#bc0c11]/10 px-3 py-1 text-xs font-semibold text-[#bc0c11] font-jakarta">
                      {item.code === "SIJA"
                        ? isEn
                          ? "Program 4 Tahun"
                          : "Program 4 Tahun"
                        : isEn
                        ? "Program 3 Tahun"
                        : "Program 3 Tahun"}
                    </span>
                  </div>
                  <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828] leading-snug">
                    {isEn ? "Career Prospects" : "Prospek Karir"}
                  </h3>
                  <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed">
                    {isEn ? item.summaryEn : item.summaryId}
                  </p>
                </div>

                {/* Career Roles Checklist */}
                <div className="flex flex-col gap-4 py-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#101828] font-jakarta">
                    {isEn ? "Professions & Career Roles:" : "Profesi & Bidang Pekerjaan:"}
                  </span>
                  <div className="flex flex-col gap-3.5">
                    {item.careers.map((career) => (
                      <div
                        key={career.roleId}
                        className="flex items-start gap-3 text-sm font-jakarta"
                      >
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#bc0c11]/10 text-[#bc0c11] mt-0.5">
                          <Check className="size-3.5 stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#101828] text-sm">
                            {isEn ? career.roleEn : career.roleId}
                          </span>
                          <span className="text-xs text-[#6b7280] leading-relaxed mt-0.5">
                            {isEn ? career.focusEn : career.focusId}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Industry Tags */}
              <div className="pt-6 border-t border-gray-100 flex flex-col gap-2.5">
                <span className="font-jakarta text-xs font-semibold text-[#6b7280]">
                  {isEn ? "Placement Industry Ecosystem:" : "Ekosistem Industri Penempatan:"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {(isEn ? item.popularCompaniesEn : item.popularCompaniesId).map((comp) => (
                    <span
                      key={comp}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-[#374151] font-jakarta transition-colors hover:border-[#bc0c11]/30 hover:bg-[#bc0c11]/5 hover:text-[#bc0c11]"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BMW (Bekerja, Melanjutkan, Wirausaha) Redesigned Section */}
        <div className="rounded-[24px] bg-[#f9fafb] p-7 sm:p-10 border-2 border-dashed border-[#d1d5dc]">
          {/* Top Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-jakarta font-bold text-2xl sm:text-3xl text-[#101828]">
              {isEn ? (
                <>
                  Future Orientation: <span className="text-[#bc0c11]">BMW Concept</span>
                </>
              ) : (
                <>
                  Orientasi Masa Depan: <span className="text-[#bc0c11]">Konsep BMW</span>
                </>
              )}
            </h3>
            <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] mt-2 leading-relaxed">
              {isEn
                ? "Every student is guided and comprehensively nurtured to pursue one of the three future pillars tailored to their potential and ambitions."
                : "Setiap siswa dibimbing dan dipersiapkan secara komprehensif agar siap menempuh salah satu dari tiga pilar masa depan sesuai minat dan potensinya."}
            </p>
          </div>

          {/* 3 Pillars Cards */}
          <div dir="ltr" className="flex justify-start overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 gap-5 sm:gap-6 snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none">
            {bmwData.map((bmw) => (
              <div
                key={bmw.letter}
                className="w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none group relative rounded-[24px] bg-white p-6 sm:p-7 flex flex-col justify-between border-2 border-dashed border-[#d1d5dc] transition-all duration-300 hover:border-[#bc0c11] hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Top: Unboxed Icon on Left & Large Subtle Letter on Right */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-[#bc0c11] shrink-0 transition-transform duration-300 group-hover:scale-110">
                      {bmw.icon}
                    </div>
                    <span className="font-jakarta font-extrabold text-3xl sm:text-4xl text-gray-300 group-hover:text-[#bc0c11]/40 transition-colors">
                      {bmw.letter}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-jakarta font-bold text-lg sm:text-xl text-[#101828] group-hover:text-[#bc0c11] transition-colors mb-1 leading-snug">
                    {bmw.title}
                  </h4>
                  <span className="font-jakarta text-xs font-semibold text-[#bc0c11] block mb-3">
                    {bmw.subtitle}
                  </span>

                  {/* Description */}
                  <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed">
                    {bmw.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

