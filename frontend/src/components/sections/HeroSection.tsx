"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    /*
     * Mobile: h-[100dvh] — fills exactly the viewport.
     * Content is split into 3 zones via flex-col:
     *   1. Text block (natural height)
     *   2. Image (flex-1 — takes remaining space)
     *   3. Stats bar (fixed height, overlaps image bottom by -translate-y)
     *
     * Desktop xl: reverts to absolute-positioned layout.
     */
    <section className="relative w-full bg-[#f3f4f6] overflow-x-hidden xl:min-h-[100dvh] flex flex-col xl:justify-between pt-[80px] sm:pt-[96px] xl:pt-[100px]">
      <div className="relative mx-auto w-full max-w-lg xl:max-w-[1280px] flex flex-col xl:flex-1 xl:justify-between px-4 sm:px-6 lg:px-8 xl:px-0">

        {/* Zone 1 + 2: Text & Image (mobile: stacked flex-col, desktop: absolute) */}
        <div className="relative flex flex-col xl:block xl:flex-1 xl:min-h-[460px]">

          {/* ── Zone 1: Text Block ── */}
          <div className="relative z-10 pt-8 sm:pt-10 flex flex-col items-start max-w-lg xl:pt-0 xl:absolute xl:left-8 2xl:left-8 xl:top-1/2 xl:-translate-y-1/2 xl:w-[440px]">
            {/* Welcome label */}
            <p className="font-jakarta text-[13px] sm:text-[17px] xl:text-[18px] leading-snug xl:leading-[28px]">
              <span className="font-normal text-[#4a5565]">{t("hero.welcome", "Selamat Datang di")} </span>
              <span className="font-semibold text-[#bc0c11]">SMK Telkom Sidoarjo!</span>
            </p>

            {/* Main heading */}
            <h1 className="mt-1.5 sm:mt-2 xl:mt-2.5 font-jakarta font-bold text-[#101828] text-[26px] sm:text-[32px] xl:text-[36px] leading-tight xl:leading-[45px]">
              <span className="block">{t("hero.title1", "Sekolah Tangguh,")}</span>
              <span className="block">{t("hero.title2", "Berakhlak,")}</span>
              <span className="text-[#bc0c11] block">{t("hero.title3", "& Berwawasan Digital")}</span>
            </h1>

            {/* Red accent line */}
            <div className="my-2.5 sm:my-3.5 h-[2.5px] w-12 rounded-full bg-[#bc0c11]" />

            {/* Subtext */}
            <p className="font-poppins text-[12px] sm:text-[15px] xl:text-[16px] leading-relaxed xl:leading-[28px] text-[#4b5563] max-w-[340px] sm:max-w-[380px]">
              {t("hero.description", "Membentuk generasi unggul yang siap berkarya, berinovasi, dan berdampak di era digital")}
            </p>

            {/* CTA Button */}
            <div className="mt-4 sm:mt-5 xl:mt-6">
              <Link href="#sambutan" className="btn-primary neu-btn-primary group !px-6 xl:!px-7">
                <span className="font-jakarta font-semibold text-[14px] xl:text-[15px] leading-none whitespace-nowrap">
                  {t("hero.exploreMore", "Jelajahi Lebih Lanjut")}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Zone 2: Student Hero Image ── */}
          {/* Mobile: flex-1 fills remaining space between text and stats bar */}
          {/* Desktop xl: absolute positioned on the right */}
          <div className="relative z-10 w-full mt-2 sm:mt-3 xl:mt-0 xl:absolute xl:right-0 xl:bottom-[16px] 2xl:bottom-[18px] xl:top-auto xl:w-[720px] 2xl:w-[770px] xl:h-[470px] 2xl:h-[500px] pointer-events-none flex items-end justify-center xl:justify-end">
            <div className="relative w-full h-[190px] sm:h-[240px] xl:h-full">
              <Image
                src={getCloudinaryUrl("/images/home/hero/home-hero-students.png", { width: 900, quality: "auto:good" })}
                alt="Siswa-Siswi SMK Telkom Sidoarjo"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 770px"
                className="object-contain object-bottom"
                priority
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        {/* ── Zone 3: Mobile Stats Bar (<1280px) ── */}
        <div className="relative z-20 w-full rounded-2xl sm:rounded-full bg-gradient-to-r from-[#bc0c11] to-[#990a0e] px-3 sm:px-6 py-3.5 sm:py-4 text-white shadow-none xl:hidden">
          <div className="grid grid-cols-3 gap-1 sm:gap-3 text-center items-center">
            <div className="flex flex-col items-center justify-center px-0.5 sm:px-1">
              <span className="font-jakarta font-bold text-lg sm:text-2xl leading-none">2</span>
              <p className="font-poppins text-[10px] sm:text-xs text-white/90 mt-1 leading-tight font-medium break-words">
                {t("hero.programCount", "Program")}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center border-x border-white/20 px-0.5 sm:px-2">
              <span className="font-jakarta font-bold text-lg sm:text-2xl leading-none">840+</span>
              <p className="font-poppins text-[10px] sm:text-xs text-white/90 mt-1 leading-tight font-medium break-words">
                {t("hero.studentsCount", "Siswa Aktif Berprestasi")}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center px-0.5 sm:px-1">
              <span className="font-jakarta font-bold text-lg sm:text-2xl leading-none">1372+</span>
              <p className="font-poppins text-[10px] sm:text-xs text-white/90 mt-1 leading-tight font-medium break-words">
                {t("hero.alumniCount", "Alumni Sukses & Berkarier")}
              </p>
            </div>
          </div>
        </div>

        {/* ── Desktop Floating Stats Bar (≥1280px) ── */}
        <div className="hidden xl:block relative z-20 mx-8 mt-auto mb-6 xl:mb-8 -translate-y-5 2xl:-translate-y-6 pointer-events-none">
          <div
            className="pointer-events-auto relative w-full rounded-full overflow-hidden bg-gradient-to-r from-[#bc0c11] to-[#990a0e] shadow-none"
            style={{ padding: "20px 48px" }}
          >
            <div className="relative z-10 grid grid-cols-3 gap-6 text-white text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 font-jakarta font-bold text-[36px] leading-[40px]">
                  <span>2</span>
                  <span className="text-white/80 text-2xl font-medium">
                    {t("hero.programCount", "Program")}
                  </span>
                </div>
                <p className="mt-1 font-poppins text-sm text-white/80 font-normal">
                  {t("hero.programDesc", "SIJA (4 Thn) & TJAT (3 Thn)")}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border-x border-white/20 px-4">
                <div className="flex items-center gap-1 font-jakarta font-bold text-[36px] leading-[40px]">
                  <span>840+</span>
                </div>
                <p className="mt-1 font-poppins text-sm text-white/80 font-normal">
                  {t("hero.studentsCount", "Siswa Aktif Berprestasi")}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 font-jakarta font-bold text-[36px] leading-[40px]">
                  <span>1372+</span>
                </div>
                <p className="mt-1 font-poppins text-sm text-white/80 font-normal">
                  {t("hero.alumniCount", "Alumni Sukses & Berkarier")}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
