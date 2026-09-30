"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface ExpenseItem {
  name: string;
  desc: string;
  included: boolean;
}

interface CostTier {
  category: string;
  tag: string;
  badgeColor: string;
  description: string;
  price: string;
  period: string;
  items: ExpenseItem[];
}

const getCostTiers = (isEn: boolean): CostTier[] => [
  {
    category: isEn ? "Sidoarjo Resident" : "Domisili Sidoarjo",
    tag: isEn ? "Living with Family" : "Tinggal Bersama Keluarga",
    badgeColor: "bg-gray-100 text-gray-700",
    description: isEn
      ? "Estimated monthly living expenses for students living within Sidoarjo regency."
      : "Perkiraan biaya akomodasi untuk siswa yang tinggal di wilayah Sidoarjo.",
    price: "Rp400.000",
    period: isEn ? "/ month" : "/ bulan",
    items: [
      {
        name: isEn ? "Daily commute to school" : "Transportasi harian ke sekolah",
        desc: isEn ? "Motorcycle fuel or local public transport" : "Bahan bakar motor / transportasi umum lokal",
        included: true,
      },
      {
        name: isEn ? "Lunch & daily snacks" : "Makan siang & kebutuhan sehari-hari",
        desc: isEn ? "Meals during breaks at school healthy canteen" : "Konsumsi istirahat di kantin sehat sekolah",
        included: true,
      },
      {
        name: isEn ? "Accommodation (Boarding/Rent)" : "Tempat Tinggal (Kos / Sewa)",
        desc: isEn ? "No rental fee required (living at home)" : "Tidak memerlukan sewa (tinggal di rumah pribadi)",
        included: false,
      },
      {
        name: isEn ? "Other expenses" : "Lain-Lainnya",
        desc: isEn ? "Daily workshop supplies and pocket allowance" : "Kebutuhan praktikum harian & uang saku",
        included: true,
      },
    ],
  },
  {
    category: isEn ? "Out-of-Town Students" : "Domisili Luar Sidoarjo",
    tag: isEn ? "Boarding / Rental House" : "Siswa Perantau / Kos",
    badgeColor: "bg-[#bc0c11]/10 text-[#bc0c11]",
    description: isEn
      ? "Estimated monthly expenses for students originating from outside Sidoarjo."
      : "Perkiraan biaya akomodasi untuk siswa yang tinggal di luar wilayah Sidoarjo.",
    price: "Rp2.050.000",
    period: isEn ? "/ month" : "/ bulan",
    items: [
      {
        name: isEn ? "Accommodation Room" : "Tempat Tinggal",
        desc: isEn ? "Private boarding house / student hostel room" : "Sewa kamar kos mandiri / asrama pelajar",
        included: true,
      },
      {
        name: isEn ? "Daily meals & nutrition" : "Makan siang & kebutuhan sehari-hari",
        desc: isEn ? "3 daily meals and student basic supplies" : "Konsumsi makan & kebutuhan harian siswa",
        included: true,
      },
      {
        name: isEn ? "Daily commute to school" : "Transportasi harian ke sekolah",
        desc: isEn ? "Short distance (walking or bicycle to campus)" : "Jarak dekat (jalan kaki / sepeda motor ke kampus)",
        included: true,
      },
      {
        name: isEn ? "Other expenses" : "Lain-Lainnya",
        desc: isEn ? "Laundry, internet quota, emergency, and allowance" : "Laundry, kuota, darurat, dan uang saku",
        included: true,
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function BiayaHidupSection() {
  const { isEn, t } = useLanguage();
  const costTiers = getCostTiers(isEn);

  return (
    <section
      id="biaya-hidup"
      className="relative w-full py-20 lg:py-28 bg-white border-t border-gray-200/60 overflow-hidden scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-2 mb-14 text-center items-center max-w-3xl mx-auto"
        >
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-[#101828]">
            {isEn ? (
              <>
                Estimated Living Cost at{" "}
                <span className="text-[#bc0c11]">SMK Telkom Sidoarjo</span>
              </>
            ) : (
              <>
                Biaya Hidup Selama Bersekolah di{" "}
                <span className="text-[#bc0c11]">SMK Telkom Sidoarjo</span>
              </>
            )}
          </h2>
          <div className="section-title-line" />
          <p className="font-jakarta text-base text-[#4a5565] leading-relaxed mt-1">
            {t("akomodasi.biayaSubtitle")}
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch"
        >
          {costTiers.map((tier) => (
            <motion.div
              key={tier.category}
              variants={cardVariants}
              className="relative rounded-[28px] p-7 sm:p-9 flex flex-col justify-between neu-card-interactive"
            >
              <div>
                {/* Header Info */}
                <div className="flex flex-col gap-2 pb-6 border-b border-gray-100">
                  <span
                    className={`inline-flex self-start items-center rounded-full px-3 py-1 text-xs font-semibold font-jakarta ${tier.badgeColor}`}
                  >
                    {tier.tag}
                  </span>
                  <h3 className="font-jakarta font-bold text-2xl text-[#101828] mt-1">
                    {tier.category}
                  </h3>
                  <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="py-6 flex items-baseline gap-2">
                  <span className="font-jakarta font-extrabold text-3xl sm:text-4xl text-[#bc0c11] tracking-tight">
                    {tier.price}
                  </span>
                  <span className="font-jakarta font-medium text-base text-[#6b7280]">
                    {tier.period}
                  </span>
                </div>

                {/* Breakdown Items List */}
                <div className="flex flex-col gap-3.5 pt-2">
                  <p className="font-jakarta font-bold text-xs uppercase tracking-wider text-[#374151]">
                    {isEn ? "Cost Component Breakdown:" : "Rincian Komponen Biaya:"}
                  </p>
                  {tier.items.map((item) => (
                    <div
                      key={item.name}
                      className={`flex items-start gap-3 text-sm font-jakarta ${
                        item.included ? "text-[#1f2937]" : "text-[#9ca3af]"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.included ? (
                          <div className="flex size-5 items-center justify-center rounded-full bg-[#bc0c11]/10 text-[#bc0c11]">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        ) : (
                          <div className="flex size-5 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-semibold ${item.included ? "text-[#101828]" : "line-through text-gray-400"}`}>
                          {item.name}
                        </span>
                        <span className="text-xs text-[#6b7280] leading-snug mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
