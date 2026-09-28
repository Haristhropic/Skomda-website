"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, Network, Lightbulb, Layers, ArrowRight } from "lucide-react";

interface TefaNeedSectionProps {
  onSelectCategory?: (category: string) => void;
  onRequestProject?: () => void;
  onViewAllServices: () => void;
}

export default function TefaNeedSection({
  onSelectCategory,
  onRequestProject,
  onViewAllServices,
}: TefaNeedSectionProps) {
  const { t } = useLanguage();

  const needs = [
    {
      id: "01",
      titleKey: "tefa.need1Title",
      descKey: "tefa.need1Desc",
      icon: <Globe className="size-7 sm:size-8 text-[#bc0c11]" />,
      action: () => onSelectCategory?.("Web & Software"),
    },
    {
      id: "02",
      titleKey: "tefa.need2Title",
      descKey: "tefa.need2Desc",
      icon: <Network className="size-7 sm:size-8 text-[#bc0c11]" />,
      action: () => onSelectCategory?.("Network"),
    },
    {
      id: "03",
      titleKey: "tefa.need3Title",
      descKey: "tefa.need3Desc",
      icon: <Lightbulb className="size-7 sm:size-8 text-[#bc0c11]" />,
      href: "/tefa/request",
    },
    {
      id: "04",
      titleKey: "tefa.need4Title",
      descKey: "tefa.need4Desc",
      icon: <Layers className="size-7 sm:size-8 text-[#bc0c11]" />,
      action: onViewAllServices,
    },
  ];

  return (
    <section id="layanan" className="relative w-full bg-white scroll-mt-24 overflow-hidden border-t border-gray-200/60">
      <div className="w-full flex flex-col lg:flex-row items-stretch">
        {/* Left Column: Eyebrow, Title & 4 Numbered Rows */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:pl-[max(1.5rem,calc((100vw-1280px)/2+2rem))] lg:pr-10 xl:pr-14 z-10">
          
          {/* Section Title with Signature Red Accent Bar */}
          <div className="mb-8">
            <h2 className="font-jakarta font-bold text-3xl sm:text-[36px] lg:text-[40px] leading-tight text-[#101828] mb-3 tracking-tight">
              {t("tefa.needTitle")}
            </h2>
            <div className="h-1 w-12 rounded-full bg-[#bc0c11] mb-3" />
            <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed max-w-lg">
              {t("tefa.needEyebrow")}
            </p>
          </div>

          {/* 4 Numbered Rows with Unboxed Icons */}
          <div className="flex flex-col">
            {needs.map((item) => (
              <div key={item.id} className="w-full">
                {/* Clean Dashed Divider */}
                <div className="w-full border-t border-dashed border-gray-200" />

                {item.href ? (
                  <Link
                    href={item.href}
                    className="group w-full flex items-center gap-4 sm:gap-5 py-4 sm:py-5 text-left transition-all duration-200 hover:bg-gray-50/90 rounded-2xl px-3 sm:px-4 -mx-3 sm:-mx-4 cursor-pointer"
                  >
                    {/* Number */}
                    <span className="font-jakarta font-extrabold text-2xl sm:text-3xl text-gray-300 w-9 sm:w-12 shrink-0 text-left group-hover:text-[#bc0c11]/40 transition-colors leading-none select-none">
                      {item.id}
                    </span>

                    {/* Unboxed Icon */}
                    <div className="shrink-0 group-hover:scale-105 transition-transform duration-200">
                      {item.icon}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h3 className="font-jakarta font-bold text-base sm:text-[17px] text-[#101828] group-hover:text-[#bc0c11] transition-colors leading-snug mb-1">
                        {t(item.titleKey)}
                      </h3>
                      <p className="font-jakarta text-xs sm:text-[13px] text-[#4a5565] leading-relaxed font-normal">
                        {t(item.descKey)}
                      </p>
                    </div>

                    <ArrowRight className="size-4 text-gray-300 group-hover:text-[#bc0c11] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.action}
                    className="group w-full flex items-center gap-4 sm:gap-5 py-4 sm:py-5 text-left transition-all duration-200 hover:bg-gray-50/90 rounded-2xl px-3 sm:px-4 -mx-3 sm:-mx-4 cursor-pointer"
                  >
                    {/* Number */}
                    <span className="font-jakarta font-extrabold text-2xl sm:text-3xl text-gray-300 w-9 sm:w-12 shrink-0 text-left group-hover:text-[#bc0c11]/40 transition-colors leading-none select-none">
                      {item.id}
                    </span>

                    {/* Unboxed Icon */}
                    <div className="shrink-0 group-hover:scale-105 transition-transform duration-200">
                      {item.icon}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h3 className="font-jakarta font-bold text-base sm:text-[17px] text-[#101828] group-hover:text-[#bc0c11] transition-colors leading-snug mb-1">
                        {t(item.titleKey)}
                      </h3>
                      <p className="font-jakarta text-xs sm:text-[13px] text-[#4a5565] leading-relaxed font-normal">
                        {t(item.descKey)}
                      </p>
                    </div>

                    <ArrowRight className="size-4 text-gray-300 group-hover:text-[#bc0c11] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                )}
              </div>
            ))}
            {/* Bottom Closing Dashed Divider */}
            <div className="w-full border-t border-dashed border-gray-200" />
          </div>
        </div>

        {/* Right Column: TeFa Building Photo completely filling the right side top-to-bottom and right edge */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:w-1/2 relative min-h-[440px] sm:min-h-[480px] lg:min-h-0 flex flex-col justify-end overflow-hidden"
        >
          {/* Building Photo with integrated dark grey banner filling right half */}
          <div className="absolute inset-0 select-none">
            <Image
              src="/images/tefa/tefa-building-banner.png"
              alt="Gedung Teaching Factory SMK Telkom Sidoarjo"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-right-bottom"
              priority
            />
          </div>

          {/* Overlay Text Content sitting seamlessly over the dark banner area */}
          <div className="relative z-10 w-full flex flex-col justify-end lg:justify-center h-auto lg:h-[32%] lg:min-h-[180px] pt-14 pb-7 sm:pb-8 lg:py-0 pl-6 sm:pl-[20%] lg:pl-[22%] xl:pl-[20%] pr-6 sm:pr-8 lg:pr-10 xl:pr-14 bg-gradient-to-t from-[#16181d] via-[#16181d]/85 to-transparent lg:bg-none">
            <h4 className="font-jakarta font-bold text-xl sm:text-2xl lg:text-[26px] xl:text-[28px] text-white leading-[1.25] mb-0 max-w-[360px] sm:max-w-[440px] lg:max-w-[480px] tracking-tight">
              {t("tefa.buildingCardTitle")}
            </h4>
            {/* Red Accent Line */}
            <div className="w-20 sm:w-28 lg:w-36 h-[3px] sm:h-[3.5px] bg-[#bc0c11] rounded-full my-2 sm:my-2.5 lg:my-3" />
            <p className="font-jakarta text-xs sm:text-sm lg:text-base text-gray-200/95 font-normal leading-relaxed max-w-[340px] sm:max-w-[420px] lg:max-w-[460px]">
              {t("tefa.buildingCardDesc")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
