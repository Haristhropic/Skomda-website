"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PpdbHeroSectionProps {
  onOpenBrochure?: () => void;
}

export default function PpdbHeroSection({ onOpenBrochure }: PpdbHeroSectionProps) {
  const { isEn } = useLanguage();

  return (
    <section className="relative w-full min-h-[100dvh] flex items-center pt-28 sm:pt-32 pb-16 sm:pb-20 bg-[#f3f4f6] overflow-hidden">
      <div className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Text Content (Col 7) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start"
          >

            {/* Main Headline */}
            <h1 className="font-jakarta font-bold text-4xl sm:text-5xl lg:text-[52px] leading-[1.12] tracking-tight text-[#101828] mb-4">
              {isEn ? (
                <>
                  Time to Become Your{" "}
                  <span className="text-[#bc0c11]">Best Version</span>
                </>
              ) : (
                <>
                  Saatnya Menjadi Versi{" "}
                  <span className="text-[#bc0c11]">Terbaikmu</span>
                </>
              )}
            </h1>

            {/* Red accent line */}
            <div className="h-[3px] w-14 rounded-full bg-[#bc0c11] mb-5 sm:mb-6" />

            {/* Description */}
            <p className="font-jakarta text-base sm:text-lg text-[#364153] leading-relaxed max-w-xl mb-8 sm:mb-9">
              {isEn
                ? "Join SMK Telkom Sidoarjo, where digital talents grow, create, and make a real impact on Indonesia's future."
                : "Bergabunglah dengan SMK Telkom Sidoarjo, tempat bagi talenta digital untuk tumbuh, berkarya, dan berdampak bagi masa depan Indonesia"}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
              <a
                href="https://ppdb.telkomschools.sch.id/signup?lemdik=4"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group !px-7 sm:!px-8 !h-[50px] !min-h-[48px] !text-[15px] sm:!text-base cursor-pointer"
              >
                <span>{isEn ? "Register Now" : "Daftar Sekarang"}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
              </a>

              <button
                type="button"
                onClick={onOpenBrochure}
                className="btn-secondary group !px-7 sm:!px-8 !h-[50px] !min-h-[48px] !text-[15px] sm:!text-base cursor-pointer"
              >
                <Eye className="w-4 h-4 text-current transition-transform duration-300 group-hover:scale-110 shrink-0" />
                <span>{isEn ? "View Brochure" : "Lihat Brosur"}</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual from (Col 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[560px] aspect-[620/413]">
              <Image
                src="/images/ppdb/hero-student.png"
                alt="Siswa SMK Telkom Sidoarjo SPMB 2026/2027"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
                className="object-contain drop-shadow-xl"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
