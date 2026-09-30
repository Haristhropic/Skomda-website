"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight } from "lucide-react";

interface TefaCtaBannerProps {
  onRequestProject?: () => void;
}

export default function TefaCtaBanner({ onRequestProject }: TefaCtaBannerProps) {
  const { t } = useLanguage();

  return (
    <section id="request-project" className="relative w-full bg-[#f3f4f6] pb-20 lg:pb-24 scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-[28px] sm:rounded-[32px] neu-card-red p-8 sm:p-12 lg:p-14 text-white overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12 relative z-10">
            {/* Left Column: Heading & Description */}
            <div className="max-w-2xl">
              {/* Headline */}
              <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight text-white mb-3 tracking-tight">
                {t("tefa.ctaTitle")}
              </h2>

              {/* Subtitle */}
              <p className="font-jakarta text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                {t("tefa.ctaDesc")}
              </p>
            </div>

            {/* Right Column: CTA Button */}
            <div className="shrink-0">
              <Link
                href="/tefa/request"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-jakarta font-bold text-[#bc0c11] transition-all duration-300 hover:bg-[#f3f4f6] hover:shadow-lg active:scale-[0.98] cursor-pointer shadow-md"
              >
                <span className="whitespace-nowrap">
                  {t("tefa.ctaButton")}
                </span>
                <ArrowRight className="size-4 text-[#bc0c11] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
