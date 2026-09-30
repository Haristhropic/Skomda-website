"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface VirtualClassHeroProps {
  ticketCode?: string;
  userName?: string;
}

export default function VirtualClassHero({
  ticketCode,
  userName,
}: VirtualClassHeroProps) {
  const { lang, t } = useLanguage();
  const isEn = lang === "EN";

  return (
    <section className="relative w-full overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 bg-[#f3f4f6]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm font-jakarta text-[#6a7282]"
        >
          <Link href="/" className="hover:text-[#bc0c11] transition-colors font-medium">
            {t("nav.home", "Beranda")}
          </Link>
          <ChevronRight className="size-3.5 text-gray-400 shrink-0" />
          <Link href="/trial-class" className="hover:text-[#bc0c11] transition-colors font-medium">
            Trial Class
          </Link>
          <ChevronRight className="size-3.5 text-gray-400 shrink-0" />
          <span className="text-[#101828] font-semibold">
            {t("virtualClass.breadcrumb", "Virtual Class")}
          </span>
        </nav>

        {/* Personalized Welcome Banner if registered */}
        {ticketCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-white border border-red-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <UserCheck className="size-5" />
              </div>
              <div>
                <p className="font-jakarta text-xs text-[#6a7282]">
                  {t("virtualClass.welcomeStudent", "Selamat Datang,")}
                </p>
                <h3 className="font-jakarta font-bold text-base text-[#101828]">
                  {userName || (isEn ? "Registered Participant" : "Peserta Trial Class")}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end bg-red-50/80 px-4 py-2 rounded-xl border border-red-100/80">
              <span className="font-jakarta text-xs text-[#bc0c11] font-semibold">
                {t("virtualClass.ticketLabel", "No. Tiket Trial Pass:")}
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#101828]">
                {ticketCode}
              </span>
            </div>
          </motion.div>
        )}

        {/* Main Grid: Left Text Block & Right Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <h1 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] leading-tight text-[#101828] tracking-tight">
              {t("virtualClass.heroTitle1", "Rasakan Pengalaman Belajar di")}{" "}
              <span className="text-[#bc0c11]">
                {t("virtualClass.heroTitle2", "Virtual Class")}
              </span>
            </h1>

            <p className="mt-4 sm:mt-5 font-jakarta text-base sm:text-lg text-[#4a5565] leading-relaxed max-w-2xl">
              {t(
                "virtualClass.heroDesc",
                "Jelajahi Digital Talent Program (DTP) SMK Telkom Sidoarjo melalui sesi interaktif, alur kegiatan yang terarah, dan pengalaman belajar yang lebih dekat dengan suasana sekolah."
              )}
            </p>

            {/* Schedule Info Chip (Date & Time) */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 font-jakarta text-xs sm:text-sm text-[#364153]">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-2xs border border-gray-200/80">
                <Image
                  src="/images/trial-class/calendar-3d-icon.png"
                  alt="Calendar"
                  width={20}
                  height={20}
                  className="object-contain"
                  unoptimized
                />
                <span className="font-semibold text-[#101828]">
                  {t("virtualClass.eventDate", "Minggu, 30 Oktober 2026")}
                </span>
              </div>

              <div className="hidden sm:block h-4 w-px bg-gray-300" />

              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-2xs border border-gray-200/80">
                <Clock className="size-4 text-[#bc0c11]" />
                <span className="font-semibold text-[#101828]">
                  {t("virtualClass.eventTime", "09.00 - 12.30 WIB")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual (Students Illustration with Red Background) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[500px] aspect-[16/11]">
              <Image
                src="/images/trial-class/virtual-hero-students.png"
                alt="Virtual Class Siswa SMK Telkom Sidoarjo"
                fill
                priority
                className="object-contain drop-shadow-md"
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
