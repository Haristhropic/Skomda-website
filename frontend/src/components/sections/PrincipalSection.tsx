"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function PrincipalSection() {
  const { t } = useLanguage();

  return (
    <section
      id="sambutan"
      className="relative w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-24 shadow-sm scroll-mt-24"
      data-node-id="67:2"
    >
      {/* Background Watermark Logo Telkom Schools (Desktop only) */}
      <div className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 h-[450px] w-[550px] md:h-[550px] md:w-[650px] rotate-[12deg] opacity-[0.06] select-none hidden lg:block">
        <Image
          src="/images/common/telkom-schools-icon.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 650px"
          className="object-contain"
        />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 xl:gap-20">

          {/* Mobile/Tablet: Text first, then image (flex-col default) */}
          {/* Desktop: Image left, Text right (lg:flex-row with lg:order) */}

          {/* Sambutan Message (appears first on mobile, second on desktop) */}
          <div className="z-10 flex flex-col items-center text-center lg:items-start lg:text-left max-w-[540px] order-1 lg:order-2">
            {/* Heading */}
            <h2 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight text-[#101828]">
              <span>{t("principal.title1")} </span>
              <br />
              <span className="text-[#bc0c11]">{t("principal.title2")}</span>
            </h2>

            {/* Accent Line Underline */}
            <div className="section-title-line mx-auto lg:mx-0" />

            {/* Sambutan Paragraph Text */}
            <p className="font-poppins text-sm sm:text-[15px] leading-relaxed text-[#515151]">
              {t("principal.message")}
            </p>

            {/* Desktop Signature Name with horizontal bar */}
            <div className="mt-7 hidden lg:flex items-center gap-3">
              <div className="h-0.5 w-8 rounded-full bg-black/80" />
              <span className="font-poppins font-medium text-lg text-black">
                Abror S.Hum., M.Pd.
              </span>
            </div>
          </div>

          {/* Graphic Column (appears second on mobile, first on desktop) */}
          <div className="flex flex-col items-center justify-center shrink-0 pt-0 lg:pt-12 order-2 lg:order-1">
            <div className="relative h-[240px] sm:h-[300px] lg:h-[353px] w-[280px] sm:w-[350px] lg:w-[409px] flex items-center justify-center transition-transform duration-300 hover:scale-105">
              {/* 1. Background Art from (Node 96:350 / image 6) */}
              <div
                className="absolute inset-0 pointer-events-none"
                data-node-id="96:350"
                data-name="image 6"
              >
                <Image
                  src="/images/home/hero/image6.png"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 410px"
                  className="object-contain"
                />
              </div>

              {/* 2. Kepsek Person Photo */}
              <div
                className="absolute -top-[50px] sm:-top-12 bottom-5 sm:bottom-11 left-[7%] sm:left-[7.5%] w-[80%] pointer-events-none flex items-center justify-center"
                data-node-id="67:118"
                data-name="kepsek"
              >
                <div className="relative w-full h-full scale-[1.10] origin-bottom">
                  <Image
                    src={getCloudinaryUrl("/images/home/kepsek.png", { width: 600, quality: "auto:good" })}
                    alt="Abror S.Hum., M.Pd. - Kepala Sekolah SMK Telkom Sidoarjo"
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 400px"
                    className="object-contain object-bottom drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Kepsek Name below photo on mobile/tablet */}
            <div className="mt-3 flex flex-col items-center text-center lg:hidden">
              <div className="mb-2 h-0.5 w-10 rounded-full bg-black/80" />
              <h3 className="font-poppins text-lg font-semibold text-[#101828]">
                Abror S.Hum., M.Pd.
              </h3>
              <p className="font-poppins text-sm text-[#4b5563]">
                {t("principal.role")}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
