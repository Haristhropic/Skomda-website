"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface WhyCard {
  id: string;
  titleKey: string;
  descKey: string;
  iconSrc: string;
  isHighlight: boolean;
  href?: string;
}

const whyCards: WhyCard[] = [
  {
    id: "67:180",
    titleKey: "why.card1Title",
    descKey: "why.card1Desc",
    iconSrc: "/images/home/why-us/why-icon-1.svg",
    isHighlight: false,
  },
  {
    id: "67:235",
    titleKey: "why.card2Title",
    descKey: "why.card2Desc",
    iconSrc: "/images/home/why-us/why-icon-2.svg",
    isHighlight: true, // Red card highlight
    href: "/program/digital-talent",
  },
  {
    id: "67:214",
    titleKey: "why.card3Title",
    descKey: "why.card3Desc",
    iconSrc: "/images/home/why-us/why-icon-3.svg",
    isHighlight: false,
  },
  {
    id: "67:248",
    titleKey: "why.card4Title",
    descKey: "why.card4Desc",
    iconSrc: "/images/home/why-us/why-icon-4.svg",
    isHighlight: false,
  },
  {
    id: "67:261",
    titleKey: "why.card5Title",
    descKey: "why.card5Desc",
    iconSrc: "/images/home/why-us/why-icon-5.svg",
    isHighlight: false,
  },
  {
    id: "67:274",
    titleKey: "why.card6Title",
    descKey: "why.card6Desc",
    iconSrc: "/images/home/why-us/why-icon-6.svg",
    isHighlight: false,
  },
];

export default function WhyChooseUsSection() {
  const { t } = useLanguage();

  return (
    <section id="keunggulan" className="w-full bg-[#f3f4f6] py-14 sm:py-20 lg:py-24 scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Header Row 67:126 & 67:140) */}
        <div className="flex flex-col gap-5 sm:gap-6 sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12">
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta font-bold text-3xl sm:text-[36px] leading-[40px] text-[#101828]">
              {t("why.title1")}
            </h2>
            <span className="font-jakarta font-bold text-3xl sm:text-[36px] leading-[40px] text-[#bc0c11]">
              {t("why.title2")}
            </span>
          </div>

          {/* CTA Daftar Sekarang Button 67:140) */}
          <div className="shrink-0">
            <Link
              href="#ppdb"
              className="group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-[#990a0e] active:scale-[0.98]"
              style={{
                boxShadow:
                  "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
              }}
            >
              <span className="font-jakarta font-medium text-base">{t("why.applyNow")}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* 6 Feature Cards Grid nodes 67:180, 67:235, 67:214, 67:248, 67:261, 67:274) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyCards.map((card) => {
            if (card.isHighlight) {
              return (
                <Link
                  key={card.id}
                  href={card.href || "#"}
                  data-node-id={card.id}
                  className="group relative rounded-[25px] bg-[#bc0c11] px-6 sm:px-7 py-6 text-white shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)] flex items-center gap-4 sm:gap-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer border-2 border-dashed border-white/50 hover:border-white min-h-[120px]"
                >
                  {/* White circle icon 23:120 / 67:237) */}
                  <div className="flex size-[64px] sm:size-[70px] shrink-0 items-center justify-center rounded-full bg-white shadow-sm p-3 transition-transform duration-300 group-hover:scale-105">
                    <div className="relative size-[36px] sm:size-[40px]">
                      <Image
                        src={card.iconSrc}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Text column 67:242) */}
                  <div className="flex flex-col items-start min-w-0">
                    <h3 className="font-jakarta font-bold text-base sm:text-[18px] lg:text-[20px] text-white leading-[26px] sm:leading-[28px] relative inline-flex items-center gap-1.5">
                      <span className="relative pb-0.5">
                        {t(card.titleKey)}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white rounded-full transition-all duration-300 group-hover:w-full" />
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                      >
                        <path
                          d="M7 17L17 7M17 7H7M17 7V17"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </h3>
                    <p className="mt-1 font-jakarta text-xs sm:text-[13px] leading-[18px] sm:leading-[20px] text-white/90">
                      {t(card.descKey)}
                    </p>
                  </div>
                </Link>
              );
            }

            return (
              <div
                key={card.id}
                data-node-id={card.id}
                className="group relative rounded-[25px] bg-white px-6 sm:px-7 py-6 shadow-[0px_4px_4.5px_rgba(0,0,0,0.08)] flex items-center gap-4 sm:gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-2 border-dashed border-[#d1d5dc] hover:border-[#bc0c11] min-h-[120px]"
              >
                {/* Light pink/red circle icon 67:145) */}
                <div className="flex size-[64px] sm:size-[70px] shrink-0 items-center justify-center rounded-full bg-[#ffebed] p-3 transition-transform duration-300 group-hover:scale-105">
                  <div className="relative size-[36px] sm:size-[40px]">
                    <Image
                      src={card.iconSrc}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Text column 67:177) */}
                <div className="flex flex-col items-start min-w-0">
                  <h3 className="font-jakarta font-bold text-base sm:text-[18px] lg:text-[20px] text-[#101828] leading-[26px] sm:leading-[28px]">
                    {t(card.titleKey)}
                  </h3>
                  <p className="mt-1 font-jakarta text-xs sm:text-[13px] leading-[18px] sm:leading-[20px] text-[#4a5565]">
                    {t(card.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
