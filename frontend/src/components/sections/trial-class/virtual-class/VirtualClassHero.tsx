"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, UserCheck } from "lucide-react";
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
    <section className="relative w-full overflow-hidden lg:min-h-[100dvh] lg:flex lg:items-center pt-28 sm:pt-32 lg:pt-32 pb-8 sm:pb-12 lg:pb-20 bg-[#f3f4f6]">
      <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        {/* Personalized Welcome Banner if registered */}
        {ticketCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-white border border-red-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Text Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Breadcrumb Path - aligned and directly connected to the hero title */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 mb-2.5 sm:mb-3.5 text-xs sm:text-sm font-jakarta text-[#4a5565] flex-wrap"
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
              <Link href="/trial-class" className="hover:text-[#bc0c11] transition-colors">
                Trial Class
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
                {t("virtualClass.breadcrumb", "Virtual Class")}
              </span>
            </nav>

            <h1 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-[40px] xl:text-[44px] leading-tight text-[#101828] tracking-tight">
              {t("virtualClass.heroTitle1", "Rasakan Pengalaman Belajar di")}{" "}
              <span className="text-[#bc0c11]">
                {t("virtualClass.heroTitle2", "Virtual Class")}
              </span>
            </h1>

            {/* Red accent line */}
            <div className="h-[3px] w-14 rounded-full bg-[#bc0c11] mt-2.5 mb-1.5" />

            <p className="mt-3 sm:mt-4 font-jakarta text-sm sm:text-base lg:text-lg text-[#4a5565] leading-relaxed max-w-2xl">
              {t(
                "virtualClass.heroDesc",
                "Jelajahi Digital Talent Program (DTP) SMK Telkom Sidoarjo melalui sesi interaktif, alur kegiatan yang terarah, dan pengalaman belajar yang lebih dekat dengan suasana sekolah."
              )}
            </p>

            {/* Schedule Info (Flat, minimal - no pill wrappers) */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-jakarta text-xs sm:text-sm text-[#364153]">
              <div className="inline-flex items-center gap-2">
                <Image
                  src="/images/trial-class/calendar-3d-icon.png"
                  alt="Tanggal"
                  width={18}
                  height={18}
                  className="object-contain opacity-70"
                  unoptimized
                />
                <span className="font-medium text-[#364153]">
                  {t("virtualClass.eventDate", "Minggu, 30 Oktober 2026")}
                </span>
              </div>

              <span className="text-gray-300 font-light select-none">|</span>

              <div className="inline-flex items-center gap-2">
                <Clock className="size-4 text-[#364153] opacity-60" />
                <span className="font-medium text-[#364153]">
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
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px] aspect-[16/11]">
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
