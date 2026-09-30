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

        {/* Header Row */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <h2 className="font-jakarta font-bold text-3xl sm:text-[36px] leading-[40px] text-[#101828]">
            {t("why.title1")}{" "}
            <span className="text-[#bc0c11]">{t("why.title2")}</span>
          </h2>
          {/* Red Accent Line */}
          <div className="section-title-line" />
        </div>

        {/* 6 Feature Cards Grid nodes 67:180, 67:235, 67:214, 67:248, 67:261, 67:274) */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyCards.map((card) => {
            if (card.isHighlight) {
              return (
                <Link
                  key={card.id}
                  href={card.href || "#"}
                  data-node-id={card.id}
                  className="group relative rounded-[22px] sm:rounded-[25px] neu-card-red px-4 sm:px-7 py-4 sm:py-6 text-white flex items-center gap-3.5 sm:gap-5 cursor-pointer min-h-[105px] sm:min-h-[120px]"
                >
                  {/* White circle icon */}
                  <div className="flex size-[52px] sm:size-[70px] shrink-0 items-center justify-center rounded-full bg-white shadow-sm p-2 sm:p-3 transition-transform duration-300 group-hover:scale-105">
                    <div className="relative size-[30px] sm:size-[40px]">
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
                className="relative rounded-[22px] sm:rounded-[25px] neu-card px-4 sm:px-7 py-4 sm:py-6 flex items-center gap-3.5 sm:gap-5 min-h-[105px] sm:min-h-[120px]"
              >
                {/* Light pink/red circle icon 67:145) */}
                <div className="flex size-[52px] sm:size-[70px] shrink-0 items-center justify-center rounded-full bg-[#ffebed] p-2 sm:p-3">
                  <div className="relative size-[30px] sm:size-[40px]">
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
