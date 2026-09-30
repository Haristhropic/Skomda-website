"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  Glasses,
  HardHat,
  HandMetal,
  Footprints,
  Anchor,
  Shirt,
  Check,
} from "lucide-react";

interface ApdItem {
  id: string;
  nameId: string;
  nameEn: string;
  code: string;
  specStandard: string;
  icon: React.ReactNode;
  functionId: string;
  functionEn: string;
  areasId: string[];
  areasEn: string[];
}

const apdList: ApdItem[] = [
  {
    id: "glasses",
    nameId: "Kacamata Keselamatan (Safety Glasses)",
    nameEn: "Protective Safety Glasses",
    code: "APD-01",
    specStandard: "Standar ANSI Z87.1 / EN 166",
    icon: <Glasses className="size-6 text-[#bc0c11]" />,
    functionId:
      "Melindungi mata dari loncatan serpihan kaca serat optik mikro saat proses cleaving serta percikan timah cair pada penyolderan.",
    functionEn:
      "Protects eyes from flying optical glass fiber micro-shards during cleaving and molten solder splatter during electronics assembly.",
    areasId: ["Lab Fiber Optik (TJAT)", "Bengkel IoT & Elektronika"],
    areasEn: ["Fiber Optic Lab (TJAT)", "IoT & Electronics Lab"],
  },
  {
    id: "helmet",
    nameId: "Helm Proyek dengan Chin Strap",
    nameEn: "Safety Helmet with Chin Strap",
    code: "APD-02",
    specStandard: "Standar SNI ISO 3873 / EN 397",
    icon: <HardHat className="size-6 text-[#bc0c11]" />,
    functionId:
      "Melindungi kepala dari risiko benturan keras dan jatuhan peralatan saat melakukan pemasangan kabel udara pada tiang telekomunikasi.",
    functionEn:
      "Protects head from impact hazards and falling tools during aerial cabling and pole-mounting operations.",
    areasId: ["Instalasi Jaringan Luar Ruang", "Menara Telekomunikasi"],
    areasEn: ["Outdoor Network Training", "Telecom Tower Training"],
  },
  {
    id: "esd-gloves",
    nameId: "Sarung Tangan ESD & Mekanik",
    nameEn: "ESD & Precision Work Gloves",
    code: "APD-03",
    specStandard: "Standar Anti-Statis EN 1149",
    icon: <HandMetal className="size-6 text-[#bc0c11]" />,
    functionId:
      "Mencegah pelepasan listrik statis yang dapat merusak sirkuit memori server serta melindungi tangan dari goresan plat casing logam.",
    functionEn:
      "Prevents electrostatic discharge to sensitive server microchips while guarding hands against sharp rack chassis edges.",
    areasId: ["Lab Server & Cloud (SIJA)", "Perakitan Komputer"],
    areasEn: ["Server & Cloud Lab (SIJA)", "Hardware Assembly"],
  },
  {
    id: "shoes",
    nameId: "Sepatu Kerja Sol Karet Berisolator",
    nameEn: "Dielectric Safety Work Shoes",
    code: "APD-04",
    specStandard: "Standar Isolasi Listrik 1kV",
    icon: <Footprints className="size-6 text-[#bc0c11]" />,
    functionId:
      "Memberikan cengkeraman anti-licin saat naik tangga serta melindungi tubuh dari risiko tegangan kejut listrik permukaan lantai.",
    functionEn:
      "Provides non-slip grip when climbing ladder rungs while insulating against stray ground voltage and static shocks.",
    areasId: ["Seluruh Area Praktik Vokasi", "Pelatihan Lapangan"],
    areasEn: ["All Vocational Workshops", "Field Training"],
  },
  {
    id: "harness",
    nameId: "Full Body Harness & Double Lanyard",
    nameEn: "Full Body Harness & Lanyard",
    code: "APD-05",
    specStandard: "Standar Fall Arrest EN 361",
    icon: <Anchor className="size-6 text-[#bc0c11]" />,
    functionId:
      "Sistem pencegah jatuh aktif dengan peredam kejut (shock absorber) untuk keselamatan mutlak saat praktik di atas tiang distribusi.",
    functionEn:
      "Active fall-arrest harness with integrated energy shock absorber for maximum security when working elevated on poles.",
    areasId: ["Praktik Tiang Distribusi", "Outdoor Aerial Fiber"],
    areasEn: ["Distribution Pole Practice", "Outdoor Aerial Fiber"],
  },
  {
    id: "wearpack",
    nameId: "Jas Praktikum / Wearpack Skomda",
    nameEn: "Official Skomda Vocational Wearpack",
    code: "APD-06",
    specStandard: "100% Drill Cotton Tahan Aus",
    icon: <Shirt className="size-6 text-[#bc0c11]" />,
    functionId:
      "Seragam praktikum dengan rancangan ergonomis tanpa tali longgar yang berpotensi tersangkut mesin atau kawat kabel penegang.",
    functionEn:
      "Durable non-snag cotton lab coat tailored without loose straps to eliminate entanglement hazards around telecom gear.",
    areasId: ["Lab TJAT & SIJA", "Teaching Factory (TeFa)"],
    areasEn: ["TJAT & SIJA Labs", "Teaching Factory (TeFa)"],
  },
];

export default function K3ApdSection() {
  const { isEn, t } = useLanguage();

  return (
    <section id="apd-wajib" className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#f3f4f6] border-t border-gray-200/60 scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-[#101828] mb-3 tracking-tight">
            {t("k3.apdTitle", "Alat Pelindung Diri (APD) Wajib Praktikum")}
          </h2>

          <div className="mx-auto h-1 w-12 rounded-full bg-[#bc0c11] mb-4" />

          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
            {t(
              "k3.apdSubtitle",
              "Siswa diwajibkan mengenakan perlengkapan pelindung diri sesuai dengan karakteristik ruang laboratorium dan materi praktikum yang sedang berjalan."
            )}
          </p>
        </div>

        {/* 6 APD Cards: Mobile Horizontal Scroll & Desktop Grid */}
        <div dir="ltr" className="flex justify-start overflow-x-auto pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none">
          {apdList.map((apd) => (
            <div
              key={apd.id}
              className="w-[84vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none group rounded-[24px] neu-card-interactive p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Unboxed Icon & Code Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[#bc0c11]">
                    {apd.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {apd.code}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-jakarta font-bold text-base sm:text-lg text-[#101828] mb-1 group-hover:text-[#bc0c11] transition-colors">
                  {isEn ? apd.nameEn : apd.nameId}
                </h3>

                {/* Specification Standard */}
                <p className="font-jakarta text-xs font-semibold text-[#bc0c11] mb-3">
                  {apd.specStandard}
                </p>

                {/* Description */}
                <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed mb-5">
                  {isEn ? apd.functionEn : apd.functionId}
                </p>
              </div>

              {/* Card Footer: Usage Area Chips */}
              <div className="pt-4 border-t border-gray-100">
                <p className="font-jakarta text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {isEn ? "Applicable Labs:" : "Ruang Praktik Wajib:"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(isEn ? apd.areasEn : apd.areasId).map((area, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700"
                    >
                      <Check className="size-3 text-[#bc0c11] shrink-0" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
