"use client";

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
import { DtpSpecialization } from "@/data/dtpData";

interface DtpSpecializationCardProps {
  item: DtpSpecialization;
  onSelect: (item: DtpSpecialization) => void;
}

export default function DtpSpecializationCard({
  item,
  onSelect,
}: DtpSpecializationCardProps) {
  const { t } = useLanguage();
  const renderCategoryIcon = () => {
    switch (item.id) {
      case "software-developer":
        return <Code2 className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "network-sysadmin":
        return <Server className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "network-infrastructure":
        return <Network className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "visual-communication-design":
        return <Palette className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "iot-engineer":
        return <Cpu className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "cloud-engineer":
        return <Cloud className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "ai-specialist":
        return <Bot className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "digital-marketing":
        return <TrendingUp className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "cyber-security":
      default:
        return <ShieldCheck className="size-7 text-[#bc0c11]" aria-hidden="true" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group rounded-[24px] neu-card-interactive p-6 sm:p-7 flex flex-col justify-between h-full cursor-pointer"
    >
      <div>
        {/* Top Header: Unboxed Icon & Large Number */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[#bc0c11] shrink-0">
            {renderCategoryIcon()}
          </div>
          <span className="font-jakarta font-extrabold text-2xl sm:text-3xl text-gray-300 group-hover:text-[#bc0c11]/40 transition-colors">
            {item.number}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-jakarta font-bold text-lg sm:text-xl text-[#101828] mb-2 group-hover:text-[#bc0c11] transition-colors">
          {item.title}
        </h3>

        {/* Short Description */}
        <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed line-clamp-3">
          {item.shortDesc}
        </p>
      </div>

      {/* Card Footer: Action Button */}
      <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-end">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#bc0c11] group-hover:translate-x-1 transition-transform cursor-pointer"
        >
          <span>{t("digitalTalent.curriculumDetails", "Detail Kurikulum")}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
