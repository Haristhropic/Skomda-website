"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function TrialClassFeelingsSection() {
  const { t } = useLanguage();

  const items = [
    {
      num: "01",
      title: t("trialClassPage.exploreTitle", "Explore"),
      desc: t(
        "trialClassPage.exploreDesc",
        "Jelajahi Virtual Class SMK Telkom Sidoarjo"
      ),
    },
    {
      num: "02",
      title: t("trialClassPage.interactTitle", "Interact"),
      desc: t(
        "trialClassPage.interactDesc",
        "Ikuti aktivitas secara langsung bersama guru dan mentor"
      ),
    },
    {
      num: "03",
      title: t("trialClassPage.discoverTitle", "Discover"),
      desc: t(
        "trialClassPage.discoverDesc",
        "Kenali pengalaman belajar nyata di SMK Telkom Sidoarjo"
      ),
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 sm:mb-16 flex flex-col items-center text-center"
        >
          <h2 className="font-jakarta text-3xl sm:text-4xl font-bold text-[#101828] tracking-tight">
            {t("trialClassPage.feelingsTitle", "Apa Yang Akan Kamu Rasakan?")}
          </h2>
          <div className="section-title-line" />
        </motion.div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-0 items-stretch">
          {items.map((item, index) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className={`relative flex flex-col justify-between ${
                index === 0
                  ? "lg:pr-10"
                  : index === 1
                  ? "lg:px-10"
                  : "lg:pl-10"
              }`}
            >
              {/* Desktop Vertical Divider before item 1 and 2 */}
              {index > 0 && (
                <div
                  className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[180px] bg-[#e5e7eb] rounded-full"
                  aria-hidden="true"
                />
              )}

              {/* Mobile/Tablet Horizontal divider */}
              {index > 0 && (
                <div
                  className="block lg:hidden w-full h-px bg-gray-200 mb-6"
                  aria-hidden="true"
                />
              )}

              <div>
                {/* Number */}
                <span className="font-jakarta text-3xl sm:text-4xl font-bold text-[#747878] block">
                  {item.num}
                </span>

                {/* Title */}
                <h3 className="font-jakarta text-2xl sm:text-3xl font-bold text-black mt-2 mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-jakarta text-base sm:text-lg text-[#787878] font-light leading-relaxed max-w-xs">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
