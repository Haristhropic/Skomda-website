"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { VIRTUAL_CLASS_DATA, VirtualClassDtpItem, getLocalizedVirtualClassItem } from "@/data/virtualClassData";
import { getVirtualClassModules } from "@/services/virtualClass";
import VirtualClassDetailPanel from "./VirtualClassDetailPanel";

interface VirtualClassDtpGridProps {
  selectedClassId: string | null;
  onSelectClass: (item: VirtualClassDtpItem) => void;
  onDeselectClass: () => void;
  ticketCode?: string;
  userName?: string;
}

export default function VirtualClassDtpGrid({
  selectedClassId,
  onSelectClass,
  onDeselectClass,
  ticketCode,
  userName,
}: VirtualClassDtpGridProps) {
  const { t, isEn } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [classList, setClassList] = useState<VirtualClassDtpItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCloudModules = async () => {
    setIsLoading(true);
    try {
      const data = await getVirtualClassModules();
      setClassList(data || []);
    } catch {
      setClassList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudModules();
  }, []);

  const rawActiveItem = classList.find((x) => x.id === selectedClassId) || null;
  const activeItem = rawActiveItem ? getLocalizedVirtualClassItem(rawActiveItem, isEn) : null;

  const handleSelect = (item: VirtualClassDtpItem) => {
    onSelectClass(item);
    // Smooth scroll to top of section for optimal viewing
    if (sectionRef.current) {
      const topOffset = sectionRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const handleNextClass = () => {
    if (!activeItem || classList.length === 0) return;
    const currentIndex = classList.findIndex((x) => x.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % classList.length;
    handleSelect(classList[nextIndex]);
  };

  return (
    <section
      ref={sectionRef}
      id="pilih-dtp"
      className="relative w-full py-8 sm:py-12 lg:py-16 bg-[#fcfcfd] border-t border-gray-100 transition-all duration-300"
    >
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10 mx-auto text-center flex flex-col items-center">
          <h2 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-[34px] text-[#101828] leading-tight">
            {t("virtualClass.dtpSectionTitle", "Pilih DTP Trial Class")}
          </h2>
          <div className="section-title-line" />
          <p className="mt-2.5 font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
            {t(
              "virtualClass.dtpSectionSubtitle",
              "Jelajahi 9 bidang unggulan Digital Talent Program dan pilih trial class sesuai minatmu. Mulai pengalaman belajar interaktifmu di Virtual Trial Class."
            )}
          </p>
        </div>

        {/* ─── Animated Container: Grid (initial) or Split View (when selected) ─── */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* ─── Cloud Loading Skeleton (Pure Dynamic) ─── */
            <motion.div
              key="loading-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <div
                  key={n}
                  className="rounded-[20px] p-4 sm:p-5 border border-gray-200/70 bg-white/60 animate-pulse flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="size-11 sm:size-12 rounded-xl bg-gray-200 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                      <div className="h-3 bg-gray-100 rounded-md w-full" />
                    </div>
                  </div>
                  <div className="size-7 rounded-full bg-gray-200 shrink-0" />
                </div>
              ))}
            </motion.div>
          ) : !activeItem ? (
            /* ─── 3x3 Full Grid State ─── */
            classList.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-gray-200 p-6 max-w-md mx-auto">
                <p className="text-sm font-bold text-gray-800">
                  {isEn ? "No Virtual Class modules found" : "Materi Virtual Class belum tersedia"}
                </p>
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  {isEn
                    ? "Check your connection or refresh to reload data from cloud."
                    : "Pastikan koneksi terhubung dan coba muat ulang data dari server cloud."}
                </p>
                <button
                  type="button"
                  onClick={fetchCloudModules}
                  className="px-4 py-2 rounded-xl bg-[#bc0c11] text-white text-xs font-bold hover:bg-[#a00a0e] transition-colors cursor-pointer"
                >
                  {isEn ? "Reload Cloud Data" : "Muat Ulang Data Online"}
                </button>
              </div>
            ) : (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {classList.map((rawItem, idx) => {
                  const item = getLocalizedVirtualClassItem(rawItem, isEn);
                  return (
                  <motion.div
                    key={item.id}
                    layoutId={`dtp-card-${item.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    onClick={() => handleSelect(item)}
                    className="group relative neu-card-interactive rounded-[20px] p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
                  >
                    {/* Left: Icon & Text Info */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="relative size-11 sm:size-12 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-jakarta font-bold text-sm sm:text-base text-[#101828] group-hover:text-[#bc0c11] transition-colors truncate">
                          {item.title}
                        </h3>
                        <p className="font-jakarta text-xs text-[#6a7282] mt-0.5 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right: Action Arrow */}
                    <div className="size-7 rounded-full border border-gray-200 group-hover:border-gray-300 text-[#6a7282] group-hover:text-[#bc0c11] flex items-center justify-center shrink-0 transition-all duration-200">
                      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </motion.div>
                );
                })}
              </motion.div>
            )
          ) : (
            /* ─── Split View Layout (Figma Node 525:684) ─── */
            <motion.div
              key="split-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 w-full"
            >
              {/* Left Column: Cards Stacked Vertically */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="hidden lg:flex w-full lg:w-[380px] xl:w-[415px] shrink-0 flex-col gap-3"
              >
                <div className="flex items-center justify-between pb-1 px-1">
                  <span className="font-jakarta font-semibold text-xs text-gray-500 uppercase tracking-wider">
                    {isEn ? "DTP Choices" : "Pilihan DTP"} ({classList.length})
                  </span>
                  <button
                    type="button"
                    onClick={onDeselectClass}
                    className="font-jakarta text-xs text-[#bc0c11] hover:underline font-semibold cursor-pointer"
                  >
                    {isEn ? "View Full Grid" : "Lihat Grid Penuh"}
                  </button>
                </div>

                {classList.map((rawItem) => {
                  const item = getLocalizedVirtualClassItem(rawItem, isEn);
                  const isActive = item.id === activeItem.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`group relative rounded-[12px] p-3 sm:p-3.5 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                        isActive
                          ? "bg-[#f8f8f8] border border-gray-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.07),inset_-1px_-1px_3px_rgba(255,255,255,0.9)]"
                          : "bg-white border border-gray-100 hover:border-gray-200 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0px_2px_8px_rgba(0,0,0,0.08)]"
                      }`}
                    >
                      {/* Active red accent bar on the left edge */}
                      {isActive && (
                        <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-[#bc0c11]" />
                      )}

                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative size-10 sm:size-11 shrink-0 flex items-center justify-center">
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width={40}
                            height={40}
                            className={`object-contain transition-opacity ${isActive ? "opacity-100" : "opacity-75 group-hover:opacity-100"}`}
                            unoptimized
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4
                            className={`font-jakarta font-semibold text-sm leading-normal pb-0.5 truncate ${
                              isActive
                                ? "text-[#bc0c11]"
                                : "text-[#364153] group-hover:text-[#101828]"
                            }`}
                          >
                            {item.title}
                          </h4>
                          <p className="font-jakarta text-[11px] text-[#6a7282] mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`size-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "text-[#bc0c11]"
                            : "text-gray-400 group-hover:text-[#364153]"
                        }`}
                      >
                        <ChevronRight className="size-3.5" />
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Right Column: Detail Panel (Video + Overview + Quiz) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="w-full lg:flex-1 min-w-0"
              >
                <VirtualClassDetailPanel
                  item={activeItem}
                  onBack={onDeselectClass}
                  onNextClass={handleNextClass}
                  ticketCode={ticketCode}
                  userName={userName}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
