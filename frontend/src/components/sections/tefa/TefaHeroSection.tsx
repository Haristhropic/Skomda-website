"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface TefaHeroSectionProps {
  onExploreServices: () => void;
  onRequestProject?: () => void;
}

export default function TefaHeroSection({
  onExploreServices,
  onRequestProject,
}: TefaHeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="relative w-full pt-32 pb-0 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden bg-[#f3f4f6]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* Standard Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm font-jakarta text-[#4a5565] mb-4"
            >
              <Link href="/" className="hover:text-[#bc0c11] transition-colors">
                Beranda
              </Link>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#4a5565] shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Link href="/tefa" className="hover:text-[#bc0c11] transition-colors">
                TeFa
              </Link>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#4a5565] shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium text-[#101828]" aria-current="page">
                {t("tefa.breadcrumb")}
              </span>
            </nav>

            {/* Main Heading with Signature Red Underline Bar */}
            <div className="relative mb-6">
              <h1 className="font-jakarta font-bold text-4xl sm:text-5xl lg:text-[56px] leading-[1.15] tracking-tight text-[#101828]">
                Dari Kebutuhan Menjadi{" "}
                <span className="text-[#bc0c11] block sm:inline">Solusi Nyata</span>
              </h1>
              {/* Standard Red Accent Underline Bar */}
              <div className="mt-3.5 h-[3px] w-14 bg-[#bc0c11] rounded-full" />
            </div>

            {/* Description */}
            <p className="font-jakarta text-base sm:text-lg text-[#364153] leading-relaxed max-w-xl mb-8 font-normal">
              {t("tefa.heroDesc")}
            </p>

            {/* Action Buttons with Signature Button Styles */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary Button */}
              <button
                type="button"
                onClick={onExploreServices}
                className="group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] px-7 py-3.5 text-base font-medium text-white transition-all duration-300 hover:bg-[#990a0e] active:scale-[0.98] cursor-pointer"
                style={{
                  boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                }}
              >
                <span className="font-jakarta font-medium text-[15px] leading-none whitespace-nowrap">
                  {t("tefa.exploreServices")}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Secondary Button */}
              <Link
                href="/tefa/request"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white border border-[#d1d5dc] px-7 py-3.5 text-base font-medium text-[#364153] transition-all duration-300 hover:bg-gray-50 hover:border-[#bc0c11] hover:text-[#bc0c11] active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <span className="font-jakarta font-medium text-[15px] leading-none whitespace-nowrap">
                  {t("tefa.requestProject")}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Visual Artwork Collage */}
          <div className="lg:col-span-6 relative flex items-end justify-center lg:justify-end select-none mt-4 sm:mt-6 lg:mt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[500px] lg:max-w-[540px] h-[360px] sm:h-[450px] lg:h-[490px]">
              {/* Layer 1: Gray Card Backdrop */}
              <div
                className="absolute top-4 sm:top-8 left-4 sm:left-10 w-[72%] sm:w-[74%] h-[140px] sm:h-[190px] rounded-[20px] sm:rounded-[24px] bg-[#dfdfe0] z-0"
                aria-hidden="true"
              />

              {/* Layer 2: Right Light Gray Card with Stylized Motto */}
              <div
                className="absolute top-6 sm:top-24 -right-2 sm:-right-8 lg:-right-12 w-[62%] sm:w-[60%] h-[120px] sm:h-[185px] rounded-[18px] sm:rounded-[22px] bg-[#ebebeb] z-10 flex flex-col justify-center items-end sm:items-start pl-0 sm:pl-28 lg:pl-32 pr-3.5 sm:pr-3 select-none pointer-events-none shadow-xs"
              >
                <div
                  className="text-[#4e4e4e] text-[13px] sm:text-[20px] leading-[19px] sm:leading-[34px] -rotate-2 text-right sm:text-left"
                  style={{
                    fontFamily:
                      "'Papyrus', 'Bradley Hand', 'Chilanka', cursive, sans-serif",
                  }}
                >
                  <p className="m-0 whitespace-nowrap">Raih</p>
                  <p className="m-0 whitespace-nowrap">Pengalaman,</p>
                  <p className="m-0 whitespace-nowrap">Raih Impian</p>
                </div>
              </div>

              {/* Layer 3: Solid Telkom Red Card behind student */}
              <div
                className="absolute bottom-0 left-[14%] sm:left-[15%] w-[58%] sm:w-[56%] h-[260px] sm:h-[350px] rounded-t-[28px] sm:rounded-t-[40px] bg-[#bc0c11] z-10 shadow-sm"
                aria-hidden="true"
              />

              {/* Layer 4: Student Cutout Photo */}
              <div className="absolute bottom-0 left-[5%] sm:left-[6%] w-[70%] sm:w-[68%] h-[360px] sm:h-[480px] z-20 pointer-events-none flex items-end justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/tefa/tefa-hero-student.png"
                    alt="Siswa Teaching Factory SMK Telkom Sidoarjo"
                    fill
                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 480px"
                    className="object-contain object-bottom drop-shadow-sm"
                    priority
                  />
                </div>
              </div>

              {/* Layer 5: Left Floating White Card */}
              <div
                className="absolute bottom-6 sm:bottom-auto sm:top-40 -left-2 sm:-left-4 bg-white rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-4 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] border border-gray-100 z-30 max-w-[125px] sm:max-w-[170px]"
              >
                {/* Red Pill Bar */}
                <div className="w-[21px] h-[3px] bg-[#bc0c11] rounded-[10px] mb-2" />
                <p className="font-jakarta font-semibold text-[10.5px] sm:text-[13px] text-[#364153] leading-[15px] sm:leading-[18px] mb-1">
                  {t("tefa.studentBadge")}
                </p>
                <span className="font-jakarta font-medium text-[8px] sm:text-[9px] text-[#686868] uppercase tracking-wider block">
                  SMK Telkom Sidoarjo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
