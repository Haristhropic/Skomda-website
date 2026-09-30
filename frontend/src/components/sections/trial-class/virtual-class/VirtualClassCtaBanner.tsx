"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function VirtualClassCtaBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full py-10 sm:py-14 bg-[#F8FAFC]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative bg-white rounded-2xl md:rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden"
        >
          {/* ═══════════════════════════════════════════════════════
              DESKTOP & TABLET LAYOUT (>= 1024px)
             ═══════════════════════════════════════════════════════ */}
          <div className="hidden lg:grid lg:grid-cols-[400px_1fr_auto] xl:grid-cols-[430px_1fr_auto] items-center min-h-[190px]">
            {/* ── LEFT GRAPHIC CONTAINER ── */}
            <div className="relative h-full min-h-[190px] w-full overflow-hidden select-none">
              {/* 1. Base Building Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src="/images/trial-class/school-building-banner.png"
                  alt="Gedung SMK Telkom Sidoarjo"
                  fill
                  className="object-cover object-center"
                  unoptimized
                  priority
                />
              </div>

              {/* 2. Left Red Corner Cap (Vector 4 from Figma) */}
              <svg
                className="absolute left-0 top-0 h-full w-auto pointer-events-none z-10"
                viewBox="0 0 165 190"
                fill="none"
                preserveAspectRatio="none"
                style={{ width: "38%" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M165 0L60 190H20.5C7.5 190 0 180.5 0 167V21.5C0 5.9 6.5 0 20.5 0H165Z"
                  fill="#BC0C11"
                  fillOpacity="0.98"
                />
              </svg>

              {/* 3. White right mask to cleanly separate image from text with a diagonal slant */}
              <svg
                className="absolute right-0 top-0 h-full w-auto pointer-events-none z-10"
                viewBox="0 0 135 190"
                fill="none"
                preserveAspectRatio="none"
                style={{ width: "32%" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="108,0 135,0 135,190 27,190" fill="#FFFFFF" />
              </svg>

              {/* 4. Right Red Diagonal Strip (Vector 6 from Figma) */}
              <svg
                className="absolute top-0 pointer-events-none z-20"
                style={{ right: "12%", width: "28%", height: "100%" }}
                viewBox="0 0 135 190"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M108 0H135L27 190H0L108 0Z"
                  fill="#C7191E"
                  fillOpacity="0.98"
                />
              </svg>

              {/* 5. Grey Diagonal Accent (Vector 7 from Figma) */}
              <svg
                className="absolute top-[12%] pointer-events-none z-30"
                style={{ right: "4%", width: "16%", height: "42%" }}
                viewBox="0 0 70 80"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M43.66 0H70L26.34 80H0L43.66 0Z" fill="#787878" />
              </svg>

              {/* 6. White Bottom Diagonal Notch (Vector 8 from Figma) */}
              <svg
                className="absolute bottom-0 pointer-events-none z-30"
                style={{ right: "24%", width: "12%", height: "28%" }}
                viewBox="0 0 52 52"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M32.44 0H52L19.56 52H0L32.44 0Z" fill="#FFFFFF" />
              </svg>
            </div>

            {/* ── CENTER CONTENT ── */}
            <div className="py-7 px-6 xl:px-8 flex flex-col justify-center">
              <h2 className="font-jakarta font-bold text-2xl xl:text-[32px] xl:leading-[40px] text-[#101828] tracking-tight">
                {t("virtualClass.ctaTitle", "Tertarik untuk masuk SKOMDA?")}
              </h2>
              <p className="mt-2 font-jakarta text-sm xl:text-[15px] xl:leading-[26px] text-[#475467] max-w-xl">
                {t(
                  "virtualClass.ctaSubtitle",
                  "Lanjutkan perjalananmu di SMK Telkom Sidoarjo dan kembangkan potensimu bersama program keahlian unggulan yang relevan dengan industri."
                )}
              </p>
            </div>

            {/* ── RIGHT CTA BUTTON ── */}
            <div className="pr-8 xl:pr-10 py-6 flex items-center justify-end shrink-0">
              <Link
                href="/ppdb"
                className="group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] px-7 py-3.5 min-h-[48px] text-white font-jakarta font-medium text-base shadow-card-cta hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <span>{t("virtualClass.ctaButton", "Daftar Sekarang")}</span>
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              MOBILE & TABLET LAYOUT (< 1024px)
             ═══════════════════════════════════════════════════════ */}
          <div className="flex lg:hidden flex-col">
            {/* Top Banner with Branded Diagonal Vectors */}
            <div className="relative w-full h-44 sm:h-52 overflow-hidden select-none">
              <Image
                src="/images/trial-class/school-building-banner.png"
                alt="Gedung SMK Telkom Sidoarjo"
                fill
                className="object-cover object-center"
                unoptimized
                priority
              />

              {/* Red left corner cap */}
              <svg
                className="absolute left-0 top-0 h-full w-28 pointer-events-none z-10"
                viewBox="0 0 165 190"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M165 0L60 190H20.5C7.5 190 0 180.5 0 167V21.5C0 5.9 6.5 0 20.5 0H165Z"
                  fill="#BC0C11"
                  fillOpacity="0.98"
                />
              </svg>

              {/* Diagonal accent right */}
              <div className="absolute right-0 bottom-0 top-0 w-24 overflow-hidden pointer-events-none z-10">
                <svg
                  className="absolute right-0 top-0 h-full w-full"
                  viewBox="0 0 135 190"
                  fill="none"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M108 0H135L27 190H0L108 0Z"
                    fill="#C7191E"
                    fillOpacity="0.95"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-6 sm:p-8 flex flex-col items-start gap-4">
              <div>
                <h2 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828] leading-snug">
                  {t("virtualClass.ctaTitle", "Tertarik untuk masuk SKOMDA?")}
                </h2>
                <p className="mt-2 font-jakarta text-sm text-[#475467] leading-relaxed">
                  {t(
                    "virtualClass.ctaSubtitle",
                    "Lanjutkan perjalananmu di SMK Telkom Sidoarjo dan kembangkan potensimu bersama program keahlian unggulan yang relevan dengan industri."
                  )}
                </p>
              </div>

              <Link
                href="/ppdb"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] px-7 py-3.5 min-h-[48px] text-white font-jakarta font-medium text-base shadow-card-cta transition-all duration-300 active:scale-[0.98] cursor-pointer w-full sm:w-auto"
              >
                <span>{t("virtualClass.ctaButton", "Daftar Sekarang")}</span>
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
