"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TeacherItem } from "@/data/teachers";
import { useLanguage } from "@/context/LanguageContext";
import { getTeacherPhotoUrl } from "@/lib/cloudinary";

interface TeacherCarouselSectionProps {
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  items: TeacherItem[];
  itemsPerPage?: number;
  bgWhite?: boolean;
}

export default function TeacherCarouselSection({
  title,
  titleEn,
  subtitle = "SMK Telkom Sidoarjo",
  subtitleEn = "SMK Telkom Sidoarjo",
  items,
  itemsPerPage = 4,
  bgWhite = true,
}: TeacherCarouselSectionProps) {
  const { lang, language } = useLanguage();
  const isEn = lang === "EN" || language === "en";
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentPage ? 1 : -1);
    setCurrentPage(index);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <section
      className={`relative w-full py-20 lg:py-28 overflow-hidden ${
        bgWhite ? "bg-white border-y border-gray-200/60" : "bg-[#f3f4f6]"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-[#101828] tracking-tight">
            {isEn && titleEn ? titleEn : title}
          </h2>
          <div className="section-title-line" />
          {(subtitle || subtitleEn) && (
            <p className="font-jakarta text-sm sm:text-base font-semibold text-[#bc0c11] tracking-wide mt-1">
              {isEn && subtitleEn ? subtitleEn : subtitle}
            </p>
          )}
        </div>

        {/* Mobile View: Horizontal Scrollable Cards with Snap */}
        <div className="sm:hidden">
          <div dir="ltr" className="flex justify-start overflow-x-auto pb-4 pt-1 -mx-4 px-4 gap-4 snap-x snap-proximity scroll-pl-4 overscroll-x-contain scrollbar-none">
            {items.map((teacher, idx) => (
              <div
                key={`mobile-${teacher.name}-${idx}`}
                className="w-[235px] shrink-0 snap-start relative h-[345px] rounded-[24px] neu-card-interactive p-3 flex flex-col justify-between overflow-hidden"
              >
                {/* Photo Canvas */}
                <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb]">
                  <Image
                    src={getTeacherPhotoUrl(teacher.image, 300, 380)}
                    alt={teacher.name}
                    fill
                    className="object-cover object-top"
                    sizes="235px"
                  />
                </div>

                {/* Floating Info Box */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-[14px] p-3 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] border border-gray-100/90 z-10">
                  <h3 className="font-jakarta font-bold text-[14px] text-[#101828] leading-snug line-clamp-2">
                    {teacher.name}
                  </h3>
                  <p className="font-jakarta text-[12px] text-[#4a5565] leading-relaxed line-clamp-2 mt-0.5 font-normal">
                    {teacher.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View: Paginated Grid Carousel */}
        <div className="hidden sm:block relative min-h-[380px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 justify-center"
            >
              {currentItems.map((teacher, idx) => (
                <div
                  key={`${teacher.name}-${idx}`}
                  className="relative h-[360px] rounded-[24px] neu-card-interactive p-3 group flex flex-col justify-between overflow-hidden"
                >
                  {/* Photo Canvas */}
                  <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb]">
                    <Image
                      src={getTeacherPhotoUrl(teacher.image, 400, 500)}
                      alt={teacher.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  {/* Floating Info Box */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-[12px] p-3.5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] border border-gray-100/90 z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="font-jakarta font-bold text-[14px] sm:text-[15px] text-[#101828] leading-snug line-clamp-2 group-hover:text-[#bc0c11] transition-colors">
                      {teacher.name}
                    </h3>
                    <p className="font-jakarta text-[12px] text-[#4a5565] leading-relaxed line-clamp-2 mt-0.5 font-normal">
                      {teacher.role}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls (Desktop Only) */}
        {totalPages > 1 && (
          <div className="hidden sm:flex items-center justify-between mt-12 pt-4 max-w-4xl mx-auto">
            
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              aria-label={isEn ? "Previous profile" : "Profil sebelumnya"}
              className="neu-btn-icon !size-12 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="size-6" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 flex-wrap px-4">
              {Array.from({ length: totalPages }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => handleDotClick(dotIdx)}
                  aria-label={isEn ? `Go to page ${dotIdx + 1}` : `Ke halaman ${dotIdx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === currentPage
                       ? "w-8 bg-[#bc0c11] shadow-neu-red"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              aria-label={isEn ? "Next profile" : "Profil berikutnya"}
              className="btn-primary !p-0 !size-12 !min-h-[48px] !h-12 !w-12 !rounded-full cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="size-6" />
            </button>

          </div>
        )}

      </div>
    </section>
  );
}
