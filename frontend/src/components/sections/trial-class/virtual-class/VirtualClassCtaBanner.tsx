"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function VirtualClassCtaBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full py-12 sm:py-16 bg-[#f3f4f6]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden border border-gray-200/90 shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          {/* Left Decorative Image & Red Shapes */}
          <div className="relative w-full lg:w-[380px] h-[180px] sm:h-[200px] lg:h-[180px] shrink-0 rounded-2xl overflow-hidden shadow-sm">
            {/* Background Red Polygon Layer */}
            <div className="absolute inset-0 bg-[#bc0c11] rounded-2xl" />
            
            {/* Building Image */}
            <div className="absolute inset-0.5 sm:inset-1 rounded-xl overflow-hidden">
              <Image
                src="/images/trial-class/school-building-banner.png"
                alt="Gedung SMK Telkom Sidoarjo"
                fill
                className="object-cover object-center"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
            </div>
          </div>

          {/* Center Text Block */}
          <div className="flex-1 min-w-0 flex flex-col items-start">
            <h2 className="font-jakarta font-bold text-2xl sm:text-3xl text-[#101828] leading-tight">
              {t("virtualClass.ctaTitle", "Tertarik untuk masuk SKOMDA?")}
            </h2>
            <p className="mt-2.5 font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed max-w-2xl">
              {t(
                "virtualClass.ctaSubtitle",
                "Lanjutkan perjalananmu di SMK Telkom Sidoarjo dan kembangkan potensimu bersama program keahlian unggulan yang relevan dengan industri."
              )}
            </p>
          </div>

          {/* Right Action Button */}
          <div className="shrink-0 w-full sm:w-auto">
            <Link
              href="/ppdb"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] px-7 py-3.5 text-sm sm:text-base font-jakarta font-bold text-white transition-all duration-200 active:scale-[0.97] cursor-pointer"
              style={{
                boxShadow:
                  "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
              }}
            >
              <span>{t("virtualClass.ctaButton", "Daftar Sekarang")}</span>
              <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
