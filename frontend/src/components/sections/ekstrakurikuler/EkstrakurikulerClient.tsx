"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";
import { EKSKUL_LIST, EkstrakurikulerItem } from "@/data/ekstrakurikulerData";
import { getEkskulList } from "@/services/ekskul";

export default function EkstrakurikulerClient() {
  const { t } = useLanguage();
  const [items, setItems] = useState<EkstrakurikulerItem[]>(EKSKUL_LIST);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    getEkskulList()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setItems(
            data.map((e) => ({
              id: e.slug || String(e.id),
              name: e.name,
              category: (e.category || "Olahraga & Bela Diri") as any,
              description: e.description || "",
              image: e.image,
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
    if (!q) return items;
    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, items]);

  return (
    <>
      <PageHeroSection
        breadcrumbs={[
          { label: t("nav.programs", "Program"), href: "/program/profil-jurusan" },
          { label: t("ekstrakurikuler.breadcrumb", "Ekstrakurikuler"), href: "/program/ekstrakurikuler" },
        ]}
        titlePrefix="Program"
        titleHighlight="Ekstrakurikuler"
        titleHighlightColor="text-[#e7000b]"
        showAccentBar={true}
        description="SMK Telkom Sidoarjo menyediakan beragam pilihan ekstrakurikuler yang mencakup bidang kepemimpinan, olahraga, seni budaya, riset ilmiah, hingga teknologi dan robotika. Seluruh kegiatan dirancang untuk menyalurkan minat dan bakat siswa, melatih karakter kepemimpinan, serta mengukir prestasi gemilang di tingkat regional maupun nasional."
        studentImage="/images/program/ekstrakurikuler/hero-student-ekskul.png"
        studentAlt="Ekstrakurikuler SMK Telkom Sidoarjo"
        ctaText="Jelajahi"
        ctaHref="#daftar-ekskul"
        imagePosition="right"
        isIntegratedArtwork={true}
        imageContainerClassName="w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[520px] aspect-[1326/1186]"
        imageClassName="drop-shadow-xl"
      />

      {/* Main Catalog Section */}
      <section id="daftar-ekskul" className="py-16 sm:py-24 bg-[#f8f9fb] scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-4xl text-[#101828] mb-4">
              Daftar Ekstrakurikuler SKOMDA
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-[#bc0c11] mb-4" />
            <p className="font-jakarta text-base text-[#4a5565] leading-relaxed">
              Program pengembangan diri siswa untuk melatih kedisiplinan, kebugaran, kreativitas, dan kerja sama tim.
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
                placeholder="Cari ekstrakurikuler..."
                className="w-full rounded-full bg-white pl-14 sm:pl-16 pr-12 sm:pr-14 py-3.5 sm:py-4 text-sm sm:text-base font-jakarta text-[#101828] placeholder-gray-400 border border-gray-200/90 focus:border-[#bc0c11] focus:outline-none shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 size-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Hapus pencarian"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Ekstrakurikuler Grid & Mobile Horizontal Scroll */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[24px] border-2 border-dashed border-[#d1d5dc] p-8 max-w-xl mx-auto">
              <p className="font-jakarta text-sm sm:text-base text-[#4a5565] mb-4">
                Tidak ada ekstrakurikuler yang sesuai dengan pencarian &ldquo;<strong className="text-[#101828]">{searchQuery}</strong>&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer shadow-xs"
              >
                <span>Atur Ulang Pencarian</span>
              </button>
            </div>
          ) : (
              <div dir="ltr" className="flex justify-start overflow-x-auto pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-[84vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none group bg-white rounded-[24px] border-2 border-dashed border-[#d1d5dc] hover:border-[#bc0c11] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Header or Image (No Category Span Tag) */}
                    {item.image ? (
                    <div className="relative w-full aspect-[16/10] bg-gray-900 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="p-6 bg-gradient-to-br from-[#101828] to-[#1f2937] text-white flex items-center justify-between border-b border-gray-100">
                      <h4 className="font-jakarta font-bold text-xl text-white">
                        {item.name}
                      </h4>
                      <div className="size-10 rounded-full bg-white/10 text-[#bc0c11] font-extrabold text-sm flex items-center justify-center">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                  )}

                  {/* Body (No Category Span Tag & No Tanya Info Button) */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    {item.image && (
                      <h3 className="font-jakarta font-bold text-lg text-[#101828] mb-2 group-hover:text-[#bc0c11] transition-colors">
                        {item.name}
                      </h3>
                    )}
                    <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed">
                      {item.description}
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
