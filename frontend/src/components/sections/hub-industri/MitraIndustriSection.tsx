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
  const { t } = useLanguage();
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
                    <div className="flex flex-col gap-1 pt-1">
                      {/* Subtitle / Focus */}
                      <span className="text-xs font-semibold text-[#bc0c11] tracking-wide font-jakarta">
                        {mitra.focus}
                      </span>

                      {/* Company Name */}
                      <h3 className="font-jakarta font-bold text-lg text-[#101828] leading-snug group-hover:text-[#bc0c11] transition-colors mt-0.5">
                        {mitra.name}
                      </h3>

                      {/* Description */}
                      <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed mt-2">
                        {mitra.description}
                      </p>
                    </div>
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
