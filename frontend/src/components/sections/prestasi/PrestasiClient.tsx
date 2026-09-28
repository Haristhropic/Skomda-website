"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { PRESTASI_LIST, PrestasiItem } from "@/data/prestasiData";
import { getPrestasiList } from "@/services/prestasi";
import PrestasiHeroSection from "./PrestasiHeroSection";
import PrestasiCard from "./PrestasiCard";
import PrestasiDetailModal from "./PrestasiDetailModal";

export default function PrestasiClient() {
  const { isEn } = useLanguage();
  const [prestasiItems, setPrestasiItems] = useState<PrestasiItem[]>(PRESTASI_LIST);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalItem, setActiveModalItem] = useState<PrestasiItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getPrestasiList()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setPrestasiItems(
            data.map((p) => ({
              id: p.slug || String(p.id),
              title: p.title,
              category: (p.category || "IT & AI") as any,
              award: p.award,
              badgeLevel: (p.badgeLevel || "Juara 1") as any,
              competition: p.competition,
              organizer: p.organizer,
              year: p.year,
              studentName: p.studentName,
              studentClass: p.studentClass,
              image: p.image || "/images/tentang-kami/prestasi/prestasi-iitc-web-design-zaina.png",
              description: p.description || "",
            }))
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
    if (!q) return prestasiItems;
    return prestasiItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.studentName.toLowerCase().includes(q) ||
        item.competition.toLowerCase().includes(q) ||
        item.organizer.toLowerCase().includes(q) ||
        item.award.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, prestasiItems]);

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
    <div className="w-full">
      {/* 1. Hero Section */}
      <PrestasiHeroSection />

      {/* 2. Main Prestasi Section */}
      <section id="daftar-prestasi" className="py-16 sm:py-20 lg:py-24 bg-white border-t border-gray-200/60 scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
          >
            <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-[#101828] mb-3 tracking-tight">
              {isEn ? (
                <>
                  Featured <span className="text-[#bc0c11]">Achievements</span>
                </>
              ) : (
                <>
                  Prestasi <span className="text-[#bc0c11]">Unggulan Siswa</span>
                </>
              )}
            </h2>
            <div className="mx-auto h-1 w-12 rounded-full bg-[#bc0c11] mb-4" />
            <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
              {isEn
                ? "A curated showcase of competitions won by SMK Telkom Sidoarjo students across AI, technology, arts, and athletics."
                : "Koleksi kejuaraan dan capaian membanggakan siswa-siswi SMK Telkom Sidoarjo di berbagai bidang teknologi, sains, olahraga, dan seni kreatif."}
            </p>
          </motion.div>

          {/* ─── Search Only ─── */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative w-full">
              <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search className="size-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEn
                    ? "Search achievements, student names, competitions..."
                    : "Cari prestasi, nama siswa, ajang kompetisi, penyelenggara..."
                }
                className="w-full rounded-full bg-white pl-14 sm:pl-16 pr-12 sm:pr-14 py-3.5 sm:py-4 text-sm sm:text-base font-jakarta text-[#101828] placeholder-gray-400 border border-gray-200/90 focus:border-[#bc0c11] focus:outline-none shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 size-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={isEn ? "Clear search" : "Hapus pencarian"}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Prestasi Grid & Mobile Horizontal Scroll */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[24px] border-2 border-dashed border-[#d1d5dc] p-8 max-w-xl mx-auto">
              <p className="font-jakarta text-sm sm:text-base text-[#4a5565] mb-4">
                {isEn
                  ? "No achievements match your search "
                  : "Tidak ada prestasi yang sesuai dengan pencarian "}
                &ldquo;<strong className="text-[#101828]">{searchQuery}</strong>&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer shadow-xs"
              >
                <span>{isEn ? "Reset Search" : "Atur Ulang Pencarian"}</span>
              </button>
            </div>
          ) : (
            <div>
              <div
                ref={scrollContainerRef}
                dir="ltr"
                className="flex justify-start overflow-x-auto pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none"
              >
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="w-[84vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none"
                  >
                    <PrestasiCard
                      item={item}
                      onSelect={setActiveModalItem}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Detail Modal */}
      <PrestasiDetailModal
        item={activeModalItem}
        isOpen={Boolean(activeModalItem)}
        onClose={() => setActiveModalItem(null)}
      />
    </div>
  );
}
