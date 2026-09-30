"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { lang, language } = useLanguage();
  const isEn = lang === "EN" || language === "en";

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #bc0c11 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[5%] left-[-8%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #bc0c11 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg"
      >
        {/* Logo */}
        <Link href="/" className="relative h-10 w-[140px] mb-10">
          <Image
            src="/images/common/logo-smk-telkom.png"
            alt="SMK Telkom Sidoarjo"
            fill
            sizes="140px"
            className="object-contain"
            priority
          />
        </Link>

        {/* 404 Big Number */}
        <h1
          className="font-jakarta font-extrabold text-[120px] sm:text-[160px] leading-none tracking-tight text-transparent bg-clip-text select-none"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #bc0c11 0%, #e7000b 40%, #f87171 100%)",
          }}
        >
          404
        </h1>

        {/* Title */}
        <h2 className="font-jakarta font-bold text-2xl sm:text-3xl text-[#101828] mt-2 mb-3">
          {isEn ? "Page Not Found" : "Halaman Tidak Ditemukan"}
        </h2>

        {/* Subtitle */}
        <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed mb-8 max-w-md">
          {isEn
            ? "Sorry, the page you are looking for is unavailable or has been moved. Please return to the homepage to continue."
            : "Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan kembali ke beranda untuk melanjutkan."}
        </p>

        {/* CTA Button */}
        <Link
          href="/"
          className="btn-primary group !px-7 !h-[50px] !min-h-[48px]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-jakarta font-medium text-[15px] leading-none whitespace-nowrap">
            {isEn ? "Back to Homepage" : "Kembali ke Beranda"}
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
