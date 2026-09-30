"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";
import { FASILITAS_LIST, FasilitasItem } from "@/data/fasilitasData";
import { getFasilitasList } from "@/services/fasilitas";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function FasilitasClient() {
  const { t, isEn } = useLanguage();
  const [items, setItems] = useState<FasilitasItem[]>(FASILITAS_LIST);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getFasilitasList()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setItems(
            data.map((f) => {
              // Find matching item from FASILITAS_LIST to get the exact high-fidelity image asset
              const matchedLocal = FASILITAS_LIST.find((item) =>
                item.id === String(f.id) ||
                item.name.toLowerCase() === f.name.toLowerCase() ||
                f.name.toLowerCase().includes(item.name.toLowerCase()) ||
                item.name.toLowerCase().includes(f.name.toLowerCase())
              );

              return {
                id: String(f.id),
                name: f.name,
                category: (f.category || matchedLocal?.category || "Sarana Umum & Olahraga") as any,
                description: f.description || matchedLocal?.description || "",
                specs: f.features ? f.features.split(",").map((s) => s.trim()) : (matchedLocal?.specs || []),
                image: matchedLocal?.image || f.image || "/images/tentang-kami/fasilitas/fasilitas-gedung-smk.png",
                badge: f.capacity || matchedLocal?.badge || "Kampus Modern",
              };
            })
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return items;
    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.specs && item.specs.some((s) => s.toLowerCase().includes(q)))
      );
    });
  }, [searchQuery, items]);

  // Ensure horizontal scroll always starts at the leftmost position (card 1)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollLeft = 0;
      const raf = requestAnimationFrame(() => {
        el.scrollLeft = 0;
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [filteredItems]);

  return (
    <>
      <PageHeroSection
        breadcrumbs={[
          { label: t("nav.aboutUs", "Tentang Kami"), href: "/tentang-kami/profil-sekolah" },
          { label: t("fasilitas.breadcrumb", "Fasilitas"), href: "/tentang-kami/fasilitas" },
        ]}
        titlePrefix={t("fasilitas.heroTitle1", "Fasilitas &")}
        titleHighlight={t("fasilitas.heroTitle2", "Sarana Prasarana")}
        titleHighlightColor="text-[#bc0c11]"
        showAccentBar={true}
        description={t(
          "fasilitas.heroDesc",
          "Didukung infrastruktur modern bersertifikasi ISO 21001:2018, kami menyediakan laboratorium jaringan berkecepatan tinggi, studio pengembangan software, perpustakaan digital, serta ruang kelas interaktif."
        )}
        studentImage="/images/tentang-kami/fasilitas/hero-fasilitas-terpadu.png"
        studentAlt={`${t("fasilitas.breadcrumb", "Fasilitas")} SMK Telkom Sidoarjo`}
        ctaText={t("fasilitas.heroCta", "Jelajahi")}
        ctaHref="#daftar-fasilitas"
        imagePosition="right"
        isIntegratedArtwork={true}
        imageContainerClassName="w-full max-w-[540px] sm:max-w-[600px] lg:max-w-[650px] xl:max-w-[680px] aspect-[16/10]"
      />

      {/* Main Facilities Catalog */}
      <section id="daftar-fasilitas" className="py-16 sm:py-24 bg-[#f8f9fb] scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-4xl text-[#101828]">
              {t("fasilitas.sectionTitle", "Laboratorium & Sarana Prasarana Terpadu")}
            </h2>
            <div className="section-title-line" />
            <p className="font-jakarta text-base text-[#4a5565] leading-relaxed">
              {t("fasilitas.sectionDesc", "Mulai dari laboratorium kejuruan tingkat lanjut hingga lingkungan belajar luar ruang yang asri, seluruh sarana dirancang demi kenyamanan dan kesiapan kerja siswa.")}
            </p>
          </div>

          {/* Controls: Search Only */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative w-full">
              <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search className="size-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search school facilities..." : "Cari fasilitas sekolah..."}
                className="w-full neu-input !pl-14 sm:!pl-16 !pr-12 sm:!pr-14 !h-[48px] !min-h-[48px] text-sm sm:text-base font-jakarta"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 size-7 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={isEn ? "Clear search" : "Hapus pencarian"}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Facilities Grid & Mobile Horizontal Scroll */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 neu-inset-panel rounded-[24px] p-8 max-w-xl mx-auto">
              <p className="font-jakarta text-sm sm:text-base text-[#4a5565] mb-4">
                {isEn ? "No facilities match your search " : "Tidak ada fasilitas yang sesuai dengan pencarian "}
                &ldquo;<strong className="text-[#101828]">{searchQuery}</strong>&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="btn-primary !h-10 !min-h-[40px] !px-6 !text-xs sm:!text-sm cursor-pointer"
              >
                <span>{isEn ? "Reset Search" : "Atur Ulang Pencarian"}</span>
              </button>
            </div>
          ) : (
              <div
                ref={scrollContainerRef}
                dir="ltr"
                className="flex justify-start overflow-x-auto pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none"
              >
                {filteredItems.map((facility) => (
                  <motion.div
                    key={facility.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-[84vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none group rounded-[24px] neu-card-interactive overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                      <Image
                        src={getCloudinaryUrl(facility.image, { width: 720, quality: "auto:good" })}
                        alt={facility.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 84vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col">
                      <h3 className="font-jakarta font-bold text-lg text-[#101828] mb-2 group-hover:text-[#bc0c11] transition-colors">
                        {facility.name}
                      </h3>
                      <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed">
                        {facility.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
        </div>
      </section>
    </>
  );
}
