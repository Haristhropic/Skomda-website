"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full bg-[#f3f4f6] overflow-hidden pt-[124px] sm:pt-[136px] xl:pt-0 pb-12 sm:pb-16 xl:pb-0 xl:h-[630px] 2xl:h-[660px] xl:mb-12 2xl:mb-14">
      <div className="relative mx-auto w-full max-w-lg xl:max-w-[1280px] h-full px-4 sm:px-6 lg:px-8 xl:px-0">
        
        {/* ── Left Text Block ── */}
        <div className="relative z-10 flex flex-col items-start max-w-lg xl:absolute xl:left-8 2xl:left-8 xl:top-[135px] 2xl:top-[142px] xl:w-[420px]">
          {/* Welcome label */}
          <p className="font-jakarta text-[14px] sm:text-[17px] xl:text-[18px] leading-snug xl:leading-[28px]">
            <span className="font-normal text-[#4a5565]">{t("hero.welcome")} </span>
            <span className="font-semibold text-[#bc0c11]">SMK Telkom Sidoarjo!</span>
          </p>

          {/* Main 3-line heading */}
          <h1 className="mt-1.5 sm:mt-2 xl:mt-2.5 font-jakarta font-bold text-[#101828] text-[24px] sm:text-[32px] xl:text-[36px] leading-tight xl:leading-[45px]">
            <span className="block">{t("hero.title1")}</span>
            <span className="block">{t("hero.title2")}</span>
            <span className="text-[#bc0c11] block">{t("hero.title3")}</span>
          </h1>

          {/* Red accent line */}
          <div className="my-2.5 sm:my-3.5 h-[2.5px] w-9 rounded-full bg-[#bc0c11]" />

          {/* Subtext with WCAG AA compliant text color #4b5563 */}
          <p className="font-poppins text-[13px] sm:text-[15px] xl:text-[16px] leading-relaxed xl:leading-[28px] text-[#4b5563] max-w-[365px]">
            {t("hero.description")}
          </p>

          {/* CTA Button */}
          <div className="mt-4 sm:mt-5 xl:mt-6">
            <Link
              href="#sambutan"
              className="group inline-flex items-center gap-2.5 xl:gap-3 rounded-full bg-[#bc0c11] px-6 py-2.5 xl:px-7 xl:py-3 text-white transition-all duration-200 hover:bg-[#990a0e] active:scale-[0.97]"
              style={{
                boxShadow:
                  "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
              }}
            >
              <span className="font-jakarta font-medium text-[14px] xl:text-[15px] leading-none whitespace-nowrap">
                {t("hero.exploreMore")}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5 xl:group-hover:translate-x-1"
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

        {/* ── Student Hero Image (Figma Redesign Node 484:4) ── */}
        <div className="relative z-10 mt-4 sm:mt-5 mb-[-24px] sm:mb-[-32px] xl:mb-0 xl:mt-0 xl:absolute xl:right-0 xl:top-[78px] 2xl:top-[72px] xl:w-[720px] 2xl:w-[770px] xl:h-[455px] 2xl:h-[485px] pointer-events-none flex items-end justify-center xl:justify-end">
          <div className="relative w-full max-w-[500px] sm:max-w-[560px] xl:max-w-none aspect-[1672/941] xl:h-full">
            <Image
              src="/images/home/hero/hero-students-group.png"
              alt="Siswa-Siswi SMK Telkom Sidoarjo"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 770px"
              className="object-contain object-bottom"
              priority
              fetchPriority="high"
            />
          </div>
        </div>

        {/* ── Mobile Stats Bar (<1280px) ── */}
        <div className="relative z-20 -mt-6 sm:-mt-8 w-full rounded-full bg-gradient-to-r from-[#bc0c11] to-[#990a0e] px-4 py-3.5 sm:px-6 sm:py-4 text-white xl:hidden">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div>
              <span className="font-jakarta font-bold text-xl sm:text-2xl">2</span>
              <p className="font-poppins text-[11px] sm:text-xs text-white/80 mt-0.5">
                {t("hero.programCount")}
              </p>
            </div>
            <div className="border-x border-white/20">
              <span className="font-jakarta font-bold text-xl sm:text-2xl">840+</span>
              <p className="font-poppins text-[11px] sm:text-xs text-white/80 mt-0.5">
                {t("hero.studentsCount")}
              </p>
            </div>
            <div>
              <span className="font-jakarta font-bold text-xl sm:text-2xl">1372+</span>
              <p className="font-poppins text-[11px] sm:text-xs text-white/80 mt-0.5">
                {t("hero.alumniCount")}
              </p>
            </div>
          </div>
        </div>

        {/* ── Desktop Floating Stats Bar (≥1280px) ── */}
        <div className="hidden xl:block absolute z-20 left-8 right-8 bottom-2.5 2xl:bottom-3.5 pointer-events-none">
          <div
            className="pointer-events-auto relative w-full rounded-full overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #bc0c11 0%, #990a0e 100%)",
              padding: "20px 48px",
            }}
          >
            <div className="relative z-10 grid grid-cols-3 gap-6 text-white text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5 font-jakarta font-bold text-[36px] leading-[40px]">
                  <span>2</span>
                  <span className="text-white/80 text-2xl font-medium">
                    {t("hero.programCount")}
                  </span>
                </div>
                <p className="mt-1 font-poppins text-sm text-white/80 font-normal">
                  {t("hero.programDesc")}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border-x border-white/20 px-4">
                <div className="flex items-center gap-1 font-jakarta font-bold text-[36px] leading-[40px]">
                  <span>840+</span>
                </div>
                <p className="mt-1 font-poppins text-sm text-white/80 font-normal">
                  {t("hero.studentsCount")}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 font-jakarta font-bold text-[36px] leading-[40px]">
                  <span>1372+</span>
                </div>
                <p className="mt-1 font-poppins text-sm text-white/80 font-normal">
                  {t("hero.alumniCount")}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
