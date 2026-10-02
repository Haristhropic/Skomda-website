"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { getBKKPartners } from "@/services/bkk";

interface MitraPartner {
  name: string;
  logo: string;
  focus: string;
  description: string;
  url: string;
}

const mitraList: MitraPartner[] = [
  // ─── Row 1 ───
  {
    name: "Politeknik Elektronika Negeri Surabaya (PENS)",
    logo: "/images/partners/pens.webp",
    focus: "Pendidikan Vokasi & Rekayasa Teknologi",
    description:
      "Kerjasama strategis program lanjutan studi terapan, sinkronisasi kurikulum rekayasa informatika, dan riset terapan bersama.",
    url: "https://www.pens.ac.id",
  },
  {
    name: "Axelbit (Accelerate You BIT-by-BIT)",
    logo: "/images/partners/partner-axelbit.png",
    focus: "Networking & Sertifikasi MikroTik",
    description:
      "Program pelatihan dan sertifikasi profesional MikroTik, Ubiquiti, serta transfer teknologi jaringan nirkabel enterprise.",
    url: "https://axelbit.com",
  },
  {
    name: "PT. RADNET DIGITAL INDONESIA (Radnext)",
    logo: "/images/partners/partner-radnet.png",
    focus: "Internet Service & Data Center",
    description:
      "Kemitraan penyelenggaraan kelas industri ISP, pembekalan manajemen bandwidth & server, serta sertifikasi komunikasi data.",
    url: "https://rad.net.id",
  },
  {
    name: "Wowrack Indonesia",
    logo: "/images/partners/wowrack.png",
    focus: "Cloud Computing & Data Center",
    description:
      "Pendampingan pembelajaran teknologi cloud computing, virtualisasi server, dan pengelolaan infrastruktur data center modern.",
    url: "https://www.wowrack.co.id",
  },
  {
    name: "Markaz Design",
    logo: "/images/partners/partner-markazdesign.png",
    focus: "UI/UX Design & Kreativitas Digital",
    description:
      "Peningkatan kompetensi perancangan antarmuka pengguna (UI/UX), riset produk digital, dan branding kreatif inovasi siswa.",
    url: "https://markazdesign.com",
  },
  {
    name: "DigiPrener",
    logo: "/images/partners/partner-digiprener.png",
    focus: "Sistem Informasi & Solusi Digital",
    description:
      "Fasilitasi mentoring teknis pengembangan sistem informasi, rancang bangun database enterprise, dan adaptasi alur kerja software industri.",
    url: "https://digiprener.com",
  },

  // ─── Row 2 ───
  {
    name: "PT. Garuda Telekomunikasi Indonesia",
    logo: "/images/partners/partner-garuda.png",
    focus: "Telekomunikasi & Fiber Optic",
    description:
      "Kolaborasi strategis dalam pengembangan kompetensi jaringan fiber optik, transmisi broadband, dan penempatan program PKL siswa TJAT.",
    url: "https://garudatelekomunikasi.co.id",
  },
  {
    name: "Slash (/. SLASH)",
    logo: "/images/partners/partner-slash.png",
    focus: "Digital Product Agency & Software Engineering",
    description:
      "Inkubasi proyek web application, mentoring agile development, dan implementasi teknologi front-end/back-end modern industri.",
    url: "https://slash.id",
  },
  {
    name: "PT. TelkoMedika Indonesia (TBA)",
    logo: "/images/partners/TelkoMedika-v2.png",
    focus: "Healthcare IT & Telemedicine Services",
    description:
      "Integrasi sistem informasi manajemen layanan kesehatan digital, pengelolaan database medis secure, dan implementasi IoT kesehatan.",
    url: "https://telkomedika.co.id",
  },
  {
    name: "Jagoan Hosting",
    logo: "/images/partners/partner-jagoanhosting.png",
    focus: "Web Cloud & DevOps Architecture",
    description:
      "Pembekalan keterampilan deployment web, manajemen server cloud, dan konsep modern DevOps melalui kelas tamu praktisi serta magang intensif.",
    url: "https://www.jagoanhosting.com",
  },
  {
    name: "Sana Sini Creative Space",
    logo: "/images/partners/partner-sana_sini.png",
    focus: "Creative Space & Multimedia Production",
    description:
      "Studio kreatif produksi multimedia digital, motion graphics, video komersial kreatif, dan perancangan strategi visual marketing modern.",
    url: "https://instagram.com/sanasini.space",
  },
  {
    name: "PT Digdaya Olah Teknologi (DOT Indonesia)",
    logo: "/images/common/icons/DOT.svg",
    focus: "Custom Software & Mobile App Solutions",
    description:
      "Kolaborasi rekayasa perangkat lunak skala enterprise, pembangunan aplikasi mobile multiplatform, dan program magang intensif siswa SIJA.",
    url: "https://dot.co.id",
  },

  // ─── Row 3 ───
  {
    name: "LSP P1 / Jejaring Vokasi Sidoarjo",
    logo: "/images/partners/bnsp.png",
    focus: "Sertifikasi Profesi & Standarisasi Vokasi",
    description:
      "Kemitraan pengujian kompetensi keahlian terstandar BNSP, sinkronisasi skema sertifikasi industri, dan uji kelayakan sertifikasi profesi.",
    url: "https://bnsp.go.id",
  },
  {
    name: "PT. Saka Global Perkasa (SGP)",
    logo: "/images/partners/partner-saka_global_perkasa.png",
    focus: "Engineering & IT Infrastructure",
    description:
      "Dukungan pengadaan perangkat pendukung laboratorium kejuruan, instalasi jaringan pabrik, dan pengenalan rantai pasok industri modern.",
    url: "https://sakaglobalperkasa.com",
  },
  {
    name: "Jobnation IT Outsource",
    logo: "/images/partners/jobnation.png",
    focus: "IT Talent Sourcing & Outsource",
    description:
      "Penyaluran lulusan ke dunia kerja teknologi (BMW - Bekerja), pembekalan rekrutmen profesional, serta talent mapping lulusan terbaik.",
    url: "https://jobnation.id",
  },
  {
    name: "PT. Indev Solusi Digital (indev)",
    logo: "/images/partners/indev.png",
    focus: "Web System & Enterprise Solutions",
    description:
      "Pengembangan sistem informasi Enterprise Resource Planning (ERP), integrasi gateway pembayaran, dan arsitektur database skala besar.",
    url: "https://indev.co.id",
  },
  {
    name: "PT. Global Infra Teknologi (GIT)",
    logo: "/images/partners/partner-globalinfra.png",
    focus: "Infrastruktur IT & Enterprise Network",
    description:
      "Penyediaan akses ke proyek nyata pembangunan infrastruktur jaringan berskala enterprise, mentoring teknisi muda, dan sertifikasi keahlian.",
    url: "https://globalinfrateknologi.com",
  },
  {
    name: "Weza Group",
    logo: "/images/partners/weza-group.png",
    focus: "Software House & B2B Solutions",
    description:
      "Kerjasama pengembangan aplikasi digital dan sistem B2B berbasis proyek nyata (Teaching Factory), serta inkubasi talenta software engineer siswa SIJA.",
    url: "https://weza.co.id",
  },
  {
    name: "PT. Widatra Bhakti",
    logo: "/images/partners/partner-widatra.png",
    focus: "Industri Farmasi & Otomasi Manufaktur",
    description:
      "Penerapan sistem otomasi manufaktur berstandar internasional, pemeliharaan instrumen digital produksi, dan penempatan PKL/magang industri siswa.",
    url: "https://widatra.com",
  },

  // ─── Row 4 ───
  {
    name: "PT. Woodone Integra Tbk",
    logo: "/images/partners/woodneintegra.png",
    focus: "Smart Manufacturing & Automated Production",
    description:
      "Penerapan digitalisasi pabrik manufaktur ekspor, otomatisasi sistem industri, dan program pemagangan operasional sistem cerdas.",
    url: "https://woodoneintegra.com",
  },
  {
    name: "PT. Trijaya Grafika Solutindo (TGS)",
    logo: "/images/partners/trijaya.png",
    focus: "Digital Printing & Creative Packaging",
    description:
      "Penerapan teknologi grafika digital presisi tinggi, reproduksi warna komersial, dan perancangan desain packaging produk kreatif inovasi siswa.",
    url: "https://trijayagrafika.co.id",
  },
  {
    name: "Lasambara Karya Cipta",
    logo: "/images/partners/lasambora.png",
    focus: "Creative Craft & Digital Merchandising",
    description:
      "Pengembangan kewirausahaan produk kreatif (Teaching Factory), branding merchandise sekolah, dan inkubasi bisnis rintisan siswa.",
    url: "https://lasambara.com",
  },
  {
    name: "Purnama Hotel Batu",
    logo: "/images/partners/partner-purnama_hotel.png",
    focus: "Hospitality IT & Smart Hotel Systems",
    description:
      "Pengelolaan infrastruktur jaringan Wi-Fi perhotelan skala luas, implementasi sistem reservasi digital, dan integrasi IoT fasilitas kamar.",
    url: "https://hotelpurnama.com",
  },
  {
    name: "RS Islam Surabaya Jemursari (KODI)",
    logo: "/images/partners/rsi.jpg",
    focus: "SIMRS & Healthcare Technology",
    description:
      "Pengelolaan server infrastruktur rumah sakit, keamanan data rekam medis digital (cyber security), dan pemeliharaan intranet kesehatan.",
    url: "https://rsisurabaya.com",
  },
  {
    name: "PT. Efortech (Technology for Solver)",
    logo: "/images/partners/partner-efortech.png",
    focus: "Industrial IoT & Embedded Systems",
    description:
      "Riset terapan Internet of Things (IoT), integrasi mikrokontroler sensor industri, dan sistem kendali otomatisasi telemetri cerdas.",
    url: "https://efortech.com",
  },

  // ─── Row 5 ───
  {
    name: "Alfath Corp",
    logo: "/images/partners/partner-alfath.png",
    focus: "Corporate Business & Digital Services",
    description:
      "Penyelenggaraan event teknologi korporasi, manajemen kemitraan strategis, dan pembekalan kewirausahaan digital modern bagi siswa.",
    url: "https://alfathcorp.com",
  },
  {
    name: "UBIG.CO.ID",
    logo: "/images/partners/partner-ubig.png",
    focus: "Software Development & SaaS Platform",
    description:
      "Inkubasi produk Software as a Service (SaaS), arsitektur cloud microservices, dan pembinaan startup digital siswa berprestasi.",
    url: "https://ubig.co.id",
  },
  {
    name: "PT Javacreatiox Network Intermedia",
    logo: "/images/partners/partner-javacreatiox.png",
    focus: "Software Development & Teaching Factory",
    description:
      "Kolaborasi pengembangan produk perangkat lunak komersial, mentoring code review standar industri, dan penyaluran kerja lulusan berprestasi.",
    url: "https://javacreatiox.com",
  },
  {
    name: "Moksha Indonesia (Event Producer)",
    logo: "/images/partners/moksha.png",
    focus: "Creative Production & Event Technology",
    description:
      "Pengoperasian teknologi audio-visual digital skala konser/event nasional, live streaming broadcast multi-kamera, dan stage lighting digital.",
    url: "https://mokshaindonesia.com",
  },
  {
    name: "HAI (Himpunan Ahli Informatika)",
    logo: "/images/partners/partner-hai.png",
    focus: "Asosiasi Profesi & Standardisasi IT",
    description:
      "Standardisasi kurikulum kompetensi lulusan IT nasional, seminar keilmuan teknologi terkini, dan pengakuan sertifikasi keahlian profesional.",
    url: "https://hai.or.id",
  },
];

const MITRA_TRANSLATIONS_EN: Record<string, { focusEn: string; descEn: string }> = {
  "Politeknik Elektronika Negeri Surabaya (PENS)": {
    focusEn: "Vocational Higher Education & Engineering",
    descEn: "Strategic partnership for applied advanced study programs, informatics engineering curriculum synchronization, and joint applied research.",
  },
  "Axelbit (Accelerate You BIT-by-BIT)": {
    focusEn: "Networking & MikroTik Certification",
    descEn: "Professional training and certification programs for MikroTik and Ubiquiti, along with enterprise wireless network technology transfer.",
  },
  "PT. RADNET DIGITAL INDONESIA (Radnext)": {
    focusEn: "Internet Service & Data Center",
    descEn: "Partnership in organizing ISP industrial classes, bandwidth & server management training, and data communication certification.",
  },
  "Wowrack Indonesia": {
    focusEn: "Cloud Computing & Data Center",
    descEn: "Mentorship in cloud computing technologies, server virtualization, and modern data center infrastructure management.",
  },
  "Markaz Design": {
    focusEn: "UI/UX Design & Digital Creativity",
    descEn: "Enhancement of user interface (UI/UX) design competencies, digital product research, and creative student branding innovation.",
  },
  "DigiPrener": {
    focusEn: "Information Systems & Digital Solutions",
    descEn: "Facilitating technical mentorship for information system development, enterprise database design, and software industry workflows.",
  },
  "PT. Garuda Telekomunikasi Indonesia": {
    focusEn: "Telecommunications & Fiber Optics",
    descEn: "Strategic collaboration in developing fiber optic network competencies, broadband transmission, and internship placement for TJAT students.",
  },
  "Slash (/. SLASH)": {
    focusEn: "Digital Product Agency & Software Engineering",
    descEn: "Web application project incubation, agile development mentorship, and implementation of modern industry front-end/back-end technologies.",
  },
  "PT. TelkoMedika Indonesia (TBA)": {
    focusEn: "Healthcare IT & Telemedicine Services",
    descEn: "Integration of digital health service management information systems, secure medical databases, and healthcare IoT implementation.",
  },
  "Jagoan Hosting": {
    focusEn: "Web Cloud & DevOps Architecture",
    descEn: "Web deployment skills training, cloud server management, and modern DevOps concepts through practitioner guest lectures and internships.",
  },
  "Sana Sini Creative Space": {
    focusEn: "Creative Space & Multimedia Production",
    descEn: "Creative studio for digital multimedia production, motion graphics, commercial creative video, and modern visual marketing strategies.",
  },
  "PT Digdaya Olah Teknologi (DOT Indonesia)": {
    focusEn: "Custom Software & Mobile App Solutions",
    descEn: "Enterprise software engineering collaboration, multi-platform mobile application development, and intensive internships for SIJA students.",
  },
  "LSP P1 / Jejaring Vokasi Sidoarjo": {
    focusEn: "Professional Certification & Standards",
    descEn: "Partnership in BNSP-standardized vocational competency testing, industry certification schemes synchronization, and professional assessments.",
  },
  "PT. Saka Global Perkasa (SGP)": {
    focusEn: "Engineering & IT Infrastructure",
    descEn: "Support for vocational laboratory equipment, plant network installation, and introduction to modern industrial supply chains.",
  },
  "Jobnation IT Outsource": {
    focusEn: "IT Talent Sourcing & Outsource",
    descEn: "Facilitating graduate placement in the technology sector, professional recruitment prep, and high-achiever talent mapping.",
  },
  "PT. Indev Solusi Digital (indev)": {
    focusEn: "Web System & Enterprise Solutions",
    descEn: "Development of Enterprise Resource Planning (ERP) systems, payment gateway integration, and large-scale database architecture.",
  },
  "PT. Global Infra Teknologi (GIT)": {
    focusEn: "IT Infrastructure & Enterprise Network",
    descEn: "Access to real-world enterprise-scale network infrastructure projects, mentorship for young technicians, and skill certification.",
  },
  "Weza Group": {
    focusEn: "Software House & B2B Solutions",
    descEn: "Collaboration on project-based digital apps and B2B systems (Teaching Factory), and incubating student software engineering talent.",
  },
  "PT. Widatra Bhakti": {
    focusEn: "Pharmaceutical Industry & Smart Manufacturing",
    descEn: "Implementation of international standard manufacturing automation, digital production instruments maintenance, and industrial internships.",
  },
  "PT. Woodone Integra Tbk": {
    focusEn: "Smart Manufacturing & Automated Production",
    descEn: "Digitalization of export manufacturing plants, industrial systems automation, and smart operational systems internship programs.",
  },
  "PT. Trijaya Grafika Solutindo (TGS)": {
    focusEn: "Digital Printing & Creative Packaging",
    descEn: "Application of high-precision digital graphics, commercial color reproduction, and creative product packaging design for student innovations.",
  },
  "Lasambara Karya Cipta": {
    focusEn: "Creative Craft & Digital Merchandising",
    descEn: "Development of creative product entrepreneurship (Teaching Factory), school merchandise branding, and student startup incubation.",
  },
  "Purnama Hotel Batu": {
    focusEn: "Hospitality IT & Smart Hotel Systems",
    descEn: "Management of large-scale hospitality Wi-Fi networks, digital reservation systems implementation, and room IoT integration.",
  },
  "RS Islam Surabaya Jemursari (KODI)": {
    focusEn: "Hospital Information Systems & Health Tech",
    descEn: "Hospital infrastructure server management, electronic medical record security (cybersecurity), and healthcare intranet maintenance.",
  },
  "PT. Efortech (Technology for Solver)": {
    focusEn: "Industrial IoT & Embedded Systems",
    descEn: "Applied research in Internet of Things (IoT), industrial sensor microcontroller integration, and smart telemetry automation control.",
  },
  "Alfath Corp": {
    focusEn: "Corporate Business & Digital Services",
    descEn: "Corporate technology events organization, strategic partnership management, and modern digital entrepreneurship prep for students.",
  },
  "UBIG.CO.ID": {
    focusEn: "Software Development & SaaS Platform",
    descEn: "Software as a Service (SaaS) product incubation, microservices cloud architecture, and coaching for high-achieving student startups.",
  },
  "PT Javacreatiox Network Intermedia": {
    focusEn: "Software Development & Teaching Factory",
    descEn: "Commercial software product development collaboration, industry standard code review mentorship, and career placement for top students.",
  },
  "Moksha Indonesia (Event Producer)": {
    focusEn: "Creative Production & Event Technology",
    descEn: "Operation of concert/national-scale digital audio-visual tech, multi-camera broadcast live streaming, and digital stage lighting.",
  },
  "HAI (Himpunan Ahli Informatika)": {
    focusEn: "Professional Association & IT Standards",
    descEn: "Standardization of national IT graduate competency curricula, cutting-edge technology seminars, and professional skill certification.",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function getSafeUrl(url?: string): string {
  if (!url || url === "#") return "#";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:")
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default function MitraIndustriSection() {
  const { t, isEn } = useLanguage();
  const [partnerItems, setPartnerItems] = useState<MitraPartner[]>(mitraList);

  useEffect(() => {
    let isMounted = true;
    getBKKPartners()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setPartnerItems(
            data.map((p) => ({
              name: p.name,
              logo: p.logo && p.logo.trim() ? p.logo.trim() : "/images/partners/pens.webp",
              focus: p.category || "Mitra Industri",
              description: p.description || "",
              url: p.website || "#",
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="mitra-industri"
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
            {t("hubIndustri.mitraTitle", "Mitra Industri & Perusahaan Ternama")}
          </h2>
          <div className="section-title-line" />
          <p className="font-jakarta text-base text-[#4a5565] max-w-[540px] leading-relaxed">
            {t("hubIndustri.mitraSubtitle", "Kolaborasi erat bersama perusahaan teknologi, telekomunikasi, dan instansi nasional.")}
          </p>
        </motion.div>

        {/* Dynamic Partner Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {partnerItems.map((mitra, idx) => {
            const targetUrl = getSafeUrl(mitra.url);
            const isExternal = targetUrl !== "#" && targetUrl !== "https://";

            return (
              <motion.div key={`${mitra.name}-${idx}`} variants={cardVariants}>
                <Link
                  href={targetUrl}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group relative h-full rounded-[24px] neu-card-interactive p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-4">
                    {/* Top Bar: Logo + External Link Button */}
                    <div className="relative flex items-center justify-between gap-3">
                      <div className="relative h-14 w-44 sm:w-48 flex items-center">
                        <Image
                          src={mitra.logo}
                          alt={`Logo ${mitra.name}`}
                          fill
                          className="object-contain object-left"
                          sizes="192px"
                          unoptimized={Boolean(mitra.logo?.startsWith("http") && !mitra.logo?.includes("res.cloudinary.com"))}
                        />
                      </div>
                      {/* Visit Link Action Button */}
                      <div className="flex size-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6b7280] transition-all duration-300 group-hover:bg-[#bc0c11] group-hover:text-white shrink-0 shadow-xs">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </div>
                    </div>

                    {/* Content Body */}
                    {(() => {
                      const trans = isEn ? MITRA_TRANSLATIONS_EN[mitra.name] : null;
                      const displayFocus = trans?.focusEn || mitra.focus;
                      const displayDesc = trans?.descEn || mitra.description;
                      return (
                        <div className="flex flex-col gap-1 pt-1">
                          {/* Subtitle / Focus */}
                          <span className="text-xs font-semibold text-[#bc0c11] tracking-wide font-jakarta">
                            {displayFocus}
                          </span>

                          {/* Company Name */}
                          <h3 className="font-jakarta font-bold text-lg text-[#101828] leading-snug group-hover:text-[#bc0c11] transition-colors mt-0.5">
                            {mitra.name}
                          </h3>

                          {/* Description */}
                          <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed mt-2">
                            {displayDesc}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
