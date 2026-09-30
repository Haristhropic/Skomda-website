"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface TrialClassHeroProps {
  onOpenRegister?: () => void;
}

export default function TrialClassHero({ onOpenRegister }: TrialClassHeroProps) {
  const { t } = useLanguage();

  const handleScrollToEvent = () => {
    const el = document.getElementById("event-terdekat");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="relative w-full pt-24 sm:pt-28 lg:pt-28 pb-12 sm:pb-16 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Top Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Text & CTA Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start z-10"
          >
            {/* Breadcrumb Path */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 mb-4 text-sm font-jakarta text-[#4a5565] flex-wrap"
            >
              <Link href="/" className="hover:text-[#bc0c11] transition-colors">
                {t("nav.home", "Beranda")}
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
                {t("trialClassPage.heroTitle", "Trial Class")}
              </span>
            </nav>

            {/* Main Heading (Pure bold Title matching */}
            <h1 className="font-jakarta text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#101828] leading-[1.15] tracking-tight mb-4 sm:mb-5">
              Trial Class
            </h1>

            <p className="font-jakarta text-base sm:text-lg text-[#364153] leading-relaxed max-w-xl mb-8">
              {t(
                "trialClassPage.heroDesc",
                "Ikuti Virtual Class untuk merasakan langsung suasana belajar di SMK Telkom Sidoarjo, mengenal metode pembelajaran: semuanya dari mana saja."
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={handleScrollToEvent}
                className="group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] px-7 py-3.5 min-h-[48px] text-base font-medium text-white transition-all duration-300 hover:bg-[#990a0e] active:scale-[0.97] cursor-pointer shadow-card-cta"
                style={{
                  boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                }}
              >
                <span className="font-jakarta font-medium text-[15px] leading-none whitespace-nowrap">
                  {t("trialClassPage.seeUpcoming", "Lihat Event Terdekat")}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1 shrink-0"
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

              <Link
                href="/trial-class/virtual-class"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 hover:border-[#bc0c11] hover:text-[#bc0c11] text-[#364153] px-6 py-3.5 min-h-[48px] text-sm font-jakarta font-semibold transition-all duration-200 active:scale-[0.98] shadow-2xs cursor-pointer"
              >
                <span>{t("virtualClass.breadcrumb", "Virtual Class")}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Right Visual Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-[300px] sm:w-[360px] lg:w-[390px] xl:w-[410px] h-[360px] sm:h-[420px] lg:h-[440px] flex items-center justify-center">
              {/* Background Grey Polygonal Shape */}
              <div className="absolute left-0 bottom-4 w-40 sm:w-48 h-48 sm:h-56 opacity-80 pointer-events-none -rotate-6 z-0">
                <Image
                  src="/images/trial-class/polygon-shape.svg"
                  alt=""
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Red Rounded Rectangle Backdrop */}
              <div className="absolute right-2 sm:right-4 bottom-2 w-[220px] sm:w-[260px] h-[280px] sm:h-[330px] bg-[#bc0c11] rounded-[22px] z-0 shadow-lg shadow-red-900/10" />

              {/* Student Visual (transparent PNG) */}
              <div className="relative z-10 w-[280px] sm:w-[330px] lg:w-[360px] h-[350px] sm:h-[400px] lg:h-[430px] flex items-end justify-center">
                <Image
                  src="/images/trial-class/hero-student.png"
                  alt="Siswa SMK Telkom Sidoarjo"
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 330px, 360px"
                  className="object-contain object-bottom drop-shadow-md select-none pointer-events-none"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Integrated Upcoming Event Card (Combined in Hero as in */}
        <div id="event-terdekat" className="w-full relative z-20 mt-6 sm:mt-8 lg:-mt-8 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative bg-white rounded-[24px] sm:rounded-[28px] shadow-[0px_4px_24px_rgba(0,0,0,0.06)] border border-[#eceef1] p-6 sm:p-8 lg:p-10 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              {/* Left: Event Details (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                {/* Event Tag */}
                <div className="flex items-center gap-2 text-[#bc0c11]">
                  <div className="relative size-5 shrink-0">
                    <Image
                      src="/images/trial-class/icon-date.png"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-jakarta text-xs sm:text-sm font-bold tracking-wider uppercase">
                    {t("trialClassPage.upcomingBadge", "EVENT TERDEKAT")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-jakarta text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#101828] mt-2 mb-6">
                  {t("trialClassPage.eventTitle", "Virtual Trial Class 2026")}
                </h2>

                {/* 3 Details in a single row */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 pt-4 border-t border-gray-100">
                  {/* Date */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative size-10 sm:size-11 shrink-0">
                      <Image
                        src="/images/trial-class/icon-date.png"
                        alt="Date icon"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-jakarta text-xs sm:text-sm font-bold text-[#101828] whitespace-nowrap">
                        {t("trialClassPage.eventDateDay", "Sabtu,")}
                      </span>
                      <span className="font-jakarta text-[11px] sm:text-xs text-[#6a7282] whitespace-nowrap">
                        {t("trialClassPage.eventDateFull", "26 September 2026")}
                      </span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative size-10 sm:size-11 shrink-0">
                      <Image
                        src="/images/trial-class/icon-time.png"
                        alt="Time icon"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-jakarta text-xs sm:text-sm font-bold text-[#101828] whitespace-nowrap">
                        {t("trialClassPage.eventTime", "09.00 - 11.00")}
                      </span>
                      <span className="font-jakarta text-[11px] sm:text-xs text-[#6a7282] whitespace-nowrap">
                        {t("trialClassPage.eventTimezone", "WIB")}
                      </span>
                    </div>
                  </div>

                  {/* Platform */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative size-10 sm:size-11 shrink-0">
                      <Image
                        src="/images/trial-class/icon-online.png"
                        alt="Platform icon"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-jakarta text-xs sm:text-sm font-bold text-[#101828] whitespace-nowrap">
                        {t("trialClassPage.eventMode", "Online")}
                      </span>
                      <span className="font-jakarta text-[11px] sm:text-xs text-[#6a7282] whitespace-nowrap">
                        {t("trialClassPage.eventSubmode", "(Virtual Class)")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle: Status Badge & Register Button (3 cols) */}
              <div className="lg:col-span-3 flex flex-col items-start lg:items-center justify-center gap-3.5">
                {/* Register CTA Button */}
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="w-full sm:w-auto lg:w-[200px] group inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[46px] rounded-full bg-[#bc0c11] text-white font-jakarta font-medium text-sm sm:text-base hover:bg-[#990a0e] transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  style={{
                    boxShadow:
                      "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                  }}
                >
                  <span className="whitespace-nowrap">{t("trialClassPage.registerNow", "Daftar Sekarang")}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>

              {/* Right: Laptop Mockup (3 cols) */}
              <div className="lg:col-span-3 relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[300px] xl:max-w-[320px] aspect-[1.45/1]">
                  <Image
                    src="/images/trial-class/laptop-mockup.png"
                    alt="Virtual Trial Class Laptop Screen"
                    fill
                    sizes="(max-width: 1024px) 340px, 320px"
                    className="object-contain drop-shadow-md"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
