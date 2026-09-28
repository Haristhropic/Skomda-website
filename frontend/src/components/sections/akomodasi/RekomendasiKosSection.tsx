"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

type CategoryType = "Semua" | "Kos Putra" | "Kos Putri" | "Asrama / Kontrakan";

interface Accommodation {
  id: string;
  name: string;
  category: "Kos Putra" | "Kos Putri" | "Asrama / Kontrakan";
  location: string;
  price: string;
  featuresId: string[];
  featuresEn: string[];
  contactPerson: string;
  whatsappNumber: string;
}

const accommodations: Accommodation[] = [
  {
    id: "1",
    name: "Kos Graha Telkom Harmoni",
    category: "Kos Putra",
    location: "Sekardangan, Sidoarjo",
    price: "Rp650.000 - Rp1.100.000",
    featuresId: [
      "AC / Kipas & WiFi Cepat",
      "Kamar Mandi Dalam",
      "Kasur, Lemari & Meja",
    ],
    featuresEn: [
      "AC / Fan & Fast WiFi",
      "Private Bathroom",
      "Bed, Wardrobe & Study Desk",
    ],
    contactPerson: "Pak Hendro",
    whatsappNumber: "6281234567890",
  },
  {
    id: "2",
    name: "Wisma Melati Putri Skomda",
    category: "Kos Putri",
    location: "Pecantingan, Sekardangan",
    price: "Rp700.000 - Rp1.250.000",
    featuresId: [
      "AC & Kamar Mandi Dalam",
      "WiFi & Ruang Belajar",
      "Penjaga & CCTV 24 Jam",
    ],
    featuresEn: [
      "AC & Private Bathroom",
      "WiFi & Study Room",
      "Security Guard & 24h CCTV",
    ],
    contactPerson: "Ibu Hj. Aminah",
    whatsappNumber: "6281234567891",
  },
  {
    id: "3",
    name: "Asrama Mahad Pelajar Telkom",
    category: "Asrama / Kontrakan",
    location: "Jl. Raya Jati, Sidoarjo",
    price: "Rp850.000",
    featuresId: [
      "Makan 2x Sehari & Laundry",
      "Pembinaan Karakter Siswa",
      "WiFi & Area Belajar Bersama",
    ],
    featuresEn: [
      "2x Daily Meals & Laundry",
      "Student Character Mentorship",
      "WiFi & Communal Study Area",
    ],
    contactPerson: "Ustadz Rahmat",
    whatsappNumber: "6281234567892",
  },
  {
    id: "4",
    name: "Griya Putri Kusuma",
    category: "Kos Putri",
    location: "Sekardangan Permai, Sidoarjo",
    price: "Rp600.000 - Rp950.000",
    featuresId: [
      "Free Listrik & Air PDAM",
      "WiFi & Kasur Springbed",
      "Lingkungan Tenang & Bersih",
    ],
    featuresEn: [
      "Free Electricity & Tap Water",
      "WiFi & Springbed Mattress",
      "Quiet & Clean Environment",
    ],
    contactPerson: "Ibu Ratna",
    whatsappNumber: "6281234567893",
  },
  {
    id: "5",
    name: "Paviliun Cendekia Putra",
    category: "Asrama / Kontrakan",
    location: "Jl. Pahlawan, Sidoarjo",
    price: "Rp500.000",
    featuresId: [
      "Rumah 3 Kamar Tidur",
      "Dapur & Mesin Cuci",
      "Workspace & WiFi Fiber",
    ],
    featuresEn: [
      "3-Bedroom House",
      "Kitchen & Washing Machine",
      "Workspace & Fiber WiFi",
    ],
    contactPerson: "Pak Dimas",
    whatsappNumber: "6281234567894",
  },
  {
    id: "6",
    name: "Kos Putra Sekardangan Barokah",
    category: "Kos Putra",
    location: "Jl. KH. Mukmin, Sidoarjo",
    price: "Rp550.000 - Rp850.000",
    featuresId: [
      "Kipas / AC & WiFi",
      "Kasur, Lemari & Parkir",
      "Dekat Masjid & Minimarket",
    ],
    featuresEn: [
      "Fan / AC & WiFi",
      "Bed, Wardrobe & Parking Space",
      "Near Mosque & Minimarket",
    ],
    contactPerson: "Pak H. Supardi",
    whatsappNumber: "6281234567895",
  },
];

const categoryList: { key: CategoryType; labelId: string; labelEn: string }[] = [
  { key: "Semua", labelId: "Semua", labelEn: "All" },
  { key: "Kos Putra", labelId: "Kos Putra", labelEn: "Boys Dorm" },
  { key: "Kos Putri", labelId: "Kos Putri", labelEn: "Girls Dorm" },
  { key: "Asrama / Kontrakan", labelId: "Asrama / Kontrakan", labelEn: "Hostel / Rental" },
];

export default function RekomendasiKosSection() {
  const { isEn, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryType>("Semua");

  const filteredItems =
    activeCategory === "Semua"
      ? accommodations
      : accommodations.filter((item) => item.category === activeCategory);

  return (
    <section
      id="rekomendasi-hunian"
      className="relative w-full py-20 lg:py-28 bg-[#f9fafb] border-t border-gray-200/60 overflow-hidden scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h2 className="font-jakarta font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-[#101828]">
              {t("akomodasi.kosTitle")}
            </h2>
            <p className="font-jakarta text-base text-[#4a5565] leading-relaxed">
              {t("akomodasi.kosSubtitle")}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap gap-2 scrollbar-none overscroll-x-contain">
            {categoryList.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCategory === cat.key
                    ? "bg-[#bc0c11] text-white shadow-sm"
                    : "bg-white text-[#4a5565] border border-gray-200 hover:border-[#bc0c11] hover:text-[#bc0c11]"
                }`}
              >
                {isEn ? cat.labelEn : cat.labelId}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation Grid & Mobile Horizontal Scroll */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          dir="ltr"
          className="flex justify-start overflow-x-auto pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none"
        >
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="w-[84vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none group relative h-full rounded-[24px] bg-white p-6 sm:p-7 flex flex-col justify-between border-2 border-dashed border-[#d1d5dc] transition-all duration-300 hover:border-[#bc0c11] hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                {/* Header: Category + Name + Location */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#bc0c11] tracking-wide font-jakarta">
                    {isEn
                      ? item.category === "Kos Putra"
                        ? "Boys Dorm"
                        : item.category === "Kos Putri"
                        ? "Girls Dorm"
                        : "Hostel / Rental"
                      : item.category}
                  </span>
                  <h3 className="font-jakarta font-bold text-lg text-[#101828] group-hover:text-[#bc0c11] transition-colors leading-snug mt-0.5">
                    {item.name}
                  </h3>
                  <p className="font-jakarta text-xs text-[#6b7280]">
                    {item.location}
                  </p>
                </div>

                {/* Key Features: 3 Clean Bullet Points */}
                <ul className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                  {(isEn ? item.featuresEn : item.featuresId).map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2 text-xs text-[#4a5565] font-jakarta"
                    >
                      <span className="size-1.5 rounded-full bg-[#bc0c11] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Bar: Clean Price + Contact Button */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-jakarta font-bold text-sm text-[#bc0c11]">
                    {item.price}
                  </span>
                  <span className="font-jakarta text-[11px] text-gray-500">
                    {isEn ? "per month" : "per bulan"}
                  </span>
                </div>

                <a
                  href={`https://wa.me/${item.whatsappNumber}?text=Halo%20${encodeURIComponent(
                    item.contactPerson
                  )},%20saya%20calon%20wali%20murid/siswa%20SMK%20Telkom%20Sidoarjo%20ingin%20bertanya%20mengenai%20informasi%20kamar%20di%20${encodeURIComponent(
                    item.name
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] px-4 py-2 text-xs font-semibold text-white transition-all duration-200 shadow-xs hover:shadow-sm font-jakarta shrink-0 active:scale-95"
                >
                  <span>{isEn ? "Contact" : "Hubungi"}</span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
