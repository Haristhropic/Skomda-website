"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilHeroSection() {
  const { t } = useLanguage();

  const scrollToVisiMisi = () => {
    const element = document.getElementById("visi-misi");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Visual Artwork */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[1122/1402] select-none flex items-center justify-center">
              <Image
                src="/images/tentang-kami/profil-sekolah/profil-hero-character.png"
                alt="Siswi SMK Telkom Sidoarjo"
                fill
                priority
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 380px, 420px"
                className="object-contain drop-shadow-xl"
              />
            </div>
          </motion.div>

          {/* Right Column: Information Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start order-1 lg:order-2"
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 text-sm font-jakarta">
              <Link
                href="/tentang-kami/profil-sekolah"
                className="text-[#4a5565] hover:text-[#bc0c11] transition-colors"
              >
                {t("nav.aboutUs", "Tentang Kami")}
              </Link>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#4a5565] shrink-0"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium text-[#101828]">{t("profilSekolah.breadcrumb", "Profil Sekolah")}</span>
            </div>

            {/* Main Heading */}
            <div className="relative mb-6">
              <h1 className="font-jakarta font-bold text-4xl sm:text-5xl lg:text-[56px] leading-tight tracking-tight text-[#101828]">
                {t("profilSekolah.heroTitle1", "Profil")}{" "}
                <span className="text-[#e7000b]">{t("profilSekolah.heroTitle2", "Sekolah")}</span>
              </h1>
              {/* Red Accent Underline Bar */}
              <div className="mt-3.5 h-[3px] w-14 bg-[#bc0c11] rounded-full" />
            </div>

            {/* Description Paragraph */}
            <p className="font-jakarta text-base sm:text-lg text-[#364153] leading-relaxed max-w-2xl mb-8">
              {t("profilSekolah.heroDesc")}
            </p>

            {/* CTA Button */}
            <button
              onClick={scrollToVisiMisi}
              className="group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] px-7 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-[#990a0e] active:scale-[0.98] cursor-pointer"
              style={{
                boxShadow:
                  "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
              }}
            >
              <span className="font-jakarta font-medium text-[15px] leading-none whitespace-nowrap">
                {t("profilSekolah.heroCta", "Jelajahi")}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
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
          </motion.div>

        </div>
      </div>
    </section>
  );
}
