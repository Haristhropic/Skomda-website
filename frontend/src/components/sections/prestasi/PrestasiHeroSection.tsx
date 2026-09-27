"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function PrestasiHeroSection() {
  const { isEn } = useLanguage();

  const scrollToPrestasi = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("daftar-prestasi");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-32 pb-16 lg:pt-40 lg:pb-24 bg-[#f3f4f6] overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Visual Artwork (LKS Winners & Medals) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div className="relative w-full max-w-[580px] aspect-[601/400] flex items-center justify-center">
              <Image
                src="/images/tentang-kami/prestasi/hero-prestasi-lks.png"
                alt={isEn ? "SMK Telkom Sidoarjo Student Achievements" : "Prestasi Siswa SMK Telkom Sidoarjo"}
                fill
                sizes="(max-width: 768px) 100vw, 580px"
                className="object-contain drop-shadow-md select-none"
                priority
              />
            </div>
          </motion.div>

          {/* Right Column: Breadcrumb, Heading, Description, and CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col items-start order-1 lg:order-2"
          >
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 mb-4 text-sm font-jakarta text-[#4a5565] flex-wrap"
            >
              <Link
                href="/tentang-kami/profil-sekolah"
                className="hover:text-[#bc0c11] transition-colors"
              >
                {isEn ? "About Us" : "Tentang Kami"}
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
                {isEn ? "Achievements" : "Prestasi"}
              </span>
            </nav>

            {/* Main Heading */}
            <div className="relative mb-5 sm:mb-6">
              <h1 className="font-jakarta font-bold text-4xl sm:text-5xl lg:text-[58px] leading-[1.15] tracking-tight text-[#101828]">
                {isEn ? "Achievements" : "Prestasi"}
              </h1>
              <div className="mt-3.5 h-[3px] w-14 bg-[#bc0c11] rounded-full" />
            </div>

            {/* Description Paragraph from */}
            <p className="font-jakarta text-base sm:text-lg text-[#364153] leading-relaxed max-w-xl mb-8">
              {isEn
                ? "Every student has the potential to grow and excel. Through relevant learning, teacher mentoring, and diverse competition opportunities, SMK Telkom Sidoarjo encourages students to continuously explore, innovate, and produce tangible achievements in both academic and non-academic domains."
                : "Setiap siswa punya potensi untuk berkembang dan berprestasi. Dengan pembelajaran yang relevan, pendampingan guru, dan berbagai kesempatan kompetisi, SMK Telkom Sidoarjo mendorong siswa untuk terus mencoba, berinovasi, dan menghasilkan pencapaian nyata di bidang akademik maupun nonakademik."}
            </p>

            {/* CTA Button */}
            <div>
              <a
                href="#daftar-prestasi"
                onClick={scrollToPrestasi}
                className="group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] px-7 py-3.5 min-h-[48px] text-base font-medium text-white transition-all duration-300 hover:bg-[#990a0e] active:scale-[0.98] cursor-pointer shadow-card-cta"
                style={{
                  boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                }}
              >
                <span className="font-jakarta font-semibold text-[15px] leading-none whitespace-nowrap">
                  {isEn ? "Explore Achievements" : "Jelajahi Prestasi"}
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
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
