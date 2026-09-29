"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight } from "lucide-react";

export interface TefaProductItem {
  id: string;
  title: string;
  category: "Web & Software" | "Digital Solution" | "Network";
  desc: string;
  image: string;
  features?: string[];
  deliverables?: string[];
  duration?: string;
  majorBadge?: string;
}

interface TefaCatalogSectionProps {
  selectedCategory?: string;
  onSelectProduct: (product: TefaProductItem) => void;
  onRequestProduct?: (product: TefaProductItem) => void;
}

export const TEFA_PRODUCTS: TefaProductItem[] = [
  {
    id: "company-profile",
    title: "Website Company Profile",
    category: "Web & Software",
    desc: "Website profesional untuk membantu bisnis, organisasi, atau instansi membangun kehadiran digital yang informatif",
    image: "/images/tefa/prod-company-profile.png",
    majorBadge: "Karya Siswa SIJA (4 Tahun)",
    duration: "2 - 4 Minggu",
    features: [
      "Desain Responsif (Mobile, Tablet, Desktop)",
      "SEO Friendly & Waktu Muat Cepat",
      "Panel Admin / CMS Mudah Digunakan",
      "Integrasi Kontak WhatsApp & Bisnis",
    ],
    deliverables: [
      "Source Code & Dokumentasi",
      "Setup Hosting & Domain",
      "Panduan Penggunaan Admin",
    ],
  },
  {
    id: "uiux-design",
    title: "UI/UX & Desain Digital",
    category: "Digital Solution",
    desc: "Desain antarmuka dan aset visual untuk mendukung kebutuhan digital anda",
    image: "/images/tefa/prod-uiux-design.png",
    majorBadge: "Karya Siswa SIJA & DTP",
    duration: "1 - 3 Minggu",
    features: [
      "User Research & Wireframing",
      "High-Fidelity Prototype Interaktif (Figma)",
      "Design System & Style Guide",
      "Aset Ikon & Ilustrasi Digital",
    ],
    deliverables: [
      "File Source Figma Lengkap",
      "Design Token & Dokumentasi Komponen",
      "Aset Ekspor Siap Koding (SVG, PNG)",
    ],
  },
  {
    id: "network-install",
    title: "Instalasi Jaringan",
    category: "Network",
    desc: "Instalasi dan konfigurasi jaringan untuk mendukung kebutuhan sekolah, kantor, atau instansi",
    image: "/images/tefa/prod-network-install.png",
    majorBadge: "Karya Siswa TJAT (3 Tahun)",
    duration: "Sesuai Skala Lokasi",
    features: [
      "Perencanaan Topologi & Skema Pengkabelan",
      "Instalasi Rack Server, Switch, & Router Mikrotik/Cisco",
      "Pemasangan Access Point Wi-Fi Berkualitas",
      "Uji Bandwidth & Manajemen Keamanan Jaringan",
    ],
    deliverables: [
      "Dokumentasi Denah & Port Mapping Jaringan",
      "Konfigurasi Backup Router & Firewall",
      "Garansi Pemasangan & Supervisi Berkala",
    ],
  },
  {
    id: "it-maintenance",
    title: "IT Maintenance",
    category: "Network",
    desc: "Perawatan dan troubleshooting perangkat dan jaringan secara berkala",
    image: "/images/tefa/prod-it-maintenance.png",
    majorBadge: "Karya Siswa TJAT & SIJA",
    duration: "Insidental / Kontrak Bulanan",
    features: [
      "Pembersihan Fisik & Pemeliharaan Hardware Komputer",
      "Pembaruan Sistem Operasi & Antivirus",
      "Monitoring Trafik & Troubleshooting Gangguan Jaringan",
      "Backup Data Berkala & Disaster Recovery Support",
    ],
    deliverables: [
      "Laporan Status Kesehatan Perangkat (Health Check)",
      "Rekomendasi Upgrade & Efisiensi",
      "Respon Cepat Tim Teknisi Siaga",
    ],
  },
];

export default function TefaCatalogSection({
  selectedCategory = "Semua",
  onSelectProduct,
  onRequestProduct,
}: TefaCatalogSectionProps) {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>(selectedCategory);

  const categories = [
    { label: t("tefa.filterAll"), value: "Semua" },
    { label: "Web & Software", value: "Web & Software" },
    { label: "Digital Solution", value: "Digital Solution" },
    { label: "Network", value: "Network" },
  ];

  const filteredProducts =
    activeFilter === "Semua"
      ? TEFA_PRODUCTS
      : TEFA_PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <section id="katalog" className="relative w-full bg-[#f3f4f6] py-20 lg:py-24 scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight text-[#101828] tracking-tight mb-2">
              {t("tefa.catalogTitle")}
            </h2>

            {/* Signature Red Accent Bar */}
            <div className="h-1 w-12 rounded-full bg-[#bc0c11] mb-3" />

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-[#4a5565] font-jakarta max-w-xl leading-relaxed">
              {t("tefa.catalogDesc")}
            </p>
          </div>

          {/* Category Filter Pills - Full-bleed on mobile, aligned on desktop */}
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 scrollbar-none overscroll-x-contain">
              {categories.map((cat) => {
                const isActive = activeFilter === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setActiveFilter(cat.value)}
                    className={`shrink-0 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? "bg-[#bc0c11] text-white shadow-xs"
                        : "bg-white text-[#4a5565] border border-gray-200/90 hover:border-[#bc0c11] hover:text-[#bc0c11]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4 Cards: Mobile Horizontal Scroll & Desktop Grid */}
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          dir="ltr"
          className="flex justify-start overflow-x-auto pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none"
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="w-[84vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none group relative rounded-[25px] bg-white overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border-2 border-dashed border-[#d1d5dc] hover:border-[#bc0c11] flex flex-col"
            >
                {/* Thumbnail */}
                <div className="relative w-full h-[155px] overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-jakarta font-bold text-base sm:text-lg text-[#101828] group-hover:text-[#bc0c11] transition-colors leading-[26px] mb-2 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="font-jakarta text-xs sm:text-[13px] leading-[20px] text-[#4a5565] line-clamp-3 mb-5">
                      {product.desc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-dashed border-gray-200 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-xs sm:text-sm font-jakarta font-semibold text-[#364153] hover:text-[#bc0c11] transition-colors flex items-center gap-1 cursor-pointer group/btn"
                    >
                      <span>{t("tefa.cardDetail")}</span>
                      <ChevronRight className="size-4 text-[#bc0c11] group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    <Link
                      href={`/tefa/request?service=${encodeURIComponent(product.title)}`}
                      className="px-4 py-2 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white text-xs font-jakarta font-medium transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center"
                      style={{
                        boxShadow:
                          "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                      }}
                    >
                      {t("tefa.cardOrder")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </motion.div>
      </div>
    </section>
  );
}
