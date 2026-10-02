"use client";

import Image from "next/image";
import {
  Code2,
  Server,
  Network,
  Palette,
  Cpu,
  Cloud,
  Bot,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { DtpSpecialization, getLocalizedDtp } from "@/data/dtpData";
import { getCloudinaryUrl } from "@/lib/cloudinary";

interface DtpSpecializationCardProps {
  item: DtpSpecialization;
  onSelect: (item: DtpSpecialization) => void;
}

export default function DtpSpecializationCard({
  item,
  onSelect,
}: DtpSpecializationCardProps) {
  const { t, isEn } = useLanguage();
  const localizedItem = getLocalizedDtp(item, isEn);

  const renderCategoryIcon = () => {
    switch (item.id) {
      case "software-developer":
        return <Code2 className="size-5 text-[#bc0c11]" aria-hidden="true" />;
      case "network-sysadmin":
        return <Server className="size-5 text-[#bc0c11]" aria-hidden="true" />;
      case "network-infrastructure":
        return <Network className="size-5 text-[#bc0c11]" aria-hidden="true" />;
      case "visual-communication-design":
        return <Palette className="size-5 text-[#bc0c11]" aria-hidden="true" />;
      case "iot-engineer":
        return <Cpu className="size-5 text-[#bc0c11]" aria-hidden="true" />;
      case "cloud-engineer":
        return <Cloud className="size-5 text-[#bc0c11]" aria-hidden="true" />;
      case "ai-specialist":
        return <Bot className="size-5 text-[#bc0c11]" aria-hidden="true" />;
      case "digital-marketing":
        return <TrendingUp className="size-5 text-[#bc0c11]" aria-hidden="true" />;
      case "cyber-security":
      default:
        return <ShieldCheck className="size-5 text-[#bc0c11]" aria-hidden="true" />;
    }
  };

  // Fallback image representatif jika belum diunggah via panel admin
  const getFallbackImage = () => {
    switch (item.id) {
      case "software-developer":
        return "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-1.png";
      case "network-sysadmin":
        return "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-2.png";
      case "network-infrastructure":
        return "/images/tentang-kami/fasilitas/fasilitas-lab-fiber-optik.png";
      case "visual-communication-design":
        return "/images/tentang-kami/fasilitas/fasilitas-studio-multimedia.png";
      case "iot-engineer":
        return "/images/tentang-kami/fasilitas/fasilitas-ruang-tefa.png";
      case "cloud-engineer":
        return "/images/tentang-kami/fasilitas/fasilitas-datacenter.png";
      case "ai-specialist":
        return "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-3.png";
      case "digital-marketing":
        return "/images/tentang-kami/fasilitas/fasilitas-gedung-smk.png";
      case "cyber-security":
      default:
        return "/images/tentang-kami/fasilitas/fasilitas-lab-iot.png";
    }
  };

  const displayImage = item.image || getFallbackImage();

  return (
    <div
      onClick={() => onSelect(item)}
      className="group rounded-[24px] neu-card-interactive overflow-hidden flex flex-col justify-between h-full cursor-pointer transition-all duration-300"
    >
      <div>
        {/* Aspect 16/10 Image Display with Zoom Hover */}
        <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
          <Image
            src={getCloudinaryUrl(displayImage, { width: 720, quality: "auto:good" })}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 84vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6">
          {/* Header Title with Small Category Icon */}
          <div className="flex items-center gap-2 mb-2">
            <div className="shrink-0">{renderCategoryIcon()}</div>
            <h3 className="font-jakarta font-bold text-lg sm:text-xl text-[#101828] group-hover:text-[#bc0c11] transition-colors leading-snug line-clamp-1">
              {localizedItem.title}
            </h3>
          </div>

          {/* Short Description */}
          <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed line-clamp-3">
            {localizedItem.shortDesc}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">
            {isEn ? "Industry Curriculum" : "Kurikulum Industri"}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(localizedItem);
            }}
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#bc0c11] group-hover:translate-x-1 transition-transform cursor-pointer"
          >
            <span>{t("digitalTalent.curriculumDetails", "Detail Kurikulum")}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
