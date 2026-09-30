"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MITRA_BKK_LOGOS } from "@/data/bkkData";
import { getBKKPartners } from "@/services/bkk";
import { useLanguage } from "@/context/LanguageContext";

export default function BkkMitraSection() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [partnerLogos, setPartnerLogos] = useState<{ name: string; src: string }[]>(MITRA_BKK_LOGOS);

  useEffect(() => {
    let isMounted = true;
    getBKKPartners()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setPartnerLogos(
            data.map((p) => ({
              name: p.name,
              src: p.logo || "/images/partners/logo-telkom-indonesia.jpg",
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-gray-200/60 overflow-hidden scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Red Bar Divider */}
        <div className="mb-10 sm:mb-12 max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-[#101828] mb-3">
            {isEn ? "Connected with the " : "Terhubung dengan "}
            <span className="text-[#bc0c11]">
              {isEn ? "Industrial World" : "Dunia Industri"}
            </span>
          </h2>

          <div className="section-title-line" />

          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
            {isEn
              ? "Together with leading industry partners, we continuously open broader career and internship opportunities for SKOMDA students and alumni."
              : "Bersama mitra industri terkemuka, kami terus membuka peluang kerja, magang bersertifikat, dan rekrutmen prioritas bagi siswa dan alumni SKOMDA."}
          </p>
        </div>

        {/* Partner Logos Grid with Signature Dashed Border Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4 items-center">
          {partnerLogos.map((mitra) => (
            <div
              key={mitra.name}
              title={mitra.name}
              className="h-24 sm:h-28 rounded-[20px] neu-card-interactive p-3 sm:p-4 flex flex-col items-center justify-center text-center group"
            >
              <div className="relative w-full h-12 flex items-center justify-center">
                <Image
                  src={mitra.src}
                  alt={`Logo ${mitra.name}`}
                  width={110}
                  height={44}
                  className="max-h-10 w-auto max-w-[90px] object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
