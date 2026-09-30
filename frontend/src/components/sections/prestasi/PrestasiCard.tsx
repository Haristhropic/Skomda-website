"use client";

import Image from "next/image";
import { Trophy, Medal, Award, Sparkles, ArrowRight, User, Eye } from "lucide-react";
import { PrestasiItem } from "@/data/prestasiData";
import { useLanguage } from "@/context/LanguageContext";

interface PrestasiCardProps {
  item: PrestasiItem;
  onSelect: (item: PrestasiItem) => void;
}

export default function PrestasiCard({ item, onSelect }: PrestasiCardProps) {
  const { isEn } = useLanguage();

  // Pick suitable clean unboxed icon based on category
  const renderCategoryIcon = () => {
    switch (item.category) {
      case "IT & AI":
        return <Sparkles className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "Olahraga":
        return <Medal className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "Seni & Kreatif":
        return <Award className="size-7 text-[#bc0c11]" aria-hidden="true" />;
      case "Kepemimpinan":
      default:
        return <Trophy className="size-7 text-[#bc0c11]" aria-hidden="true" />;
    }
  };

  const hasValidImage = Boolean(item.image && item.image.trim() !== "");

  return (
    <div className="group rounded-[24px] neu-card-interactive p-6 sm:p-7 flex flex-col justify-between h-full">
      <div>
        {/* Top Header: Unboxed Icon & Year */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[#bc0c11] shrink-0">
            {renderCategoryIcon()}
          </div>
          <span className="font-jakarta font-extrabold text-2xl sm:text-3xl text-gray-300 group-hover:text-[#bc0c11]/40 transition-colors">
            {item.year}
          </span>
        </div>

        {/* Optional Image: Only rendered if image is present */}
        {hasValidImage && (
          <div
            onClick={() => onSelect(item)}
            className="relative w-full aspect-[16/10] rounded-[16px] overflow-hidden mb-4 bg-gray-100 cursor-pointer border border-gray-100"
          >
            <Image
              src={item.image!}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Hover Hint Overlay matching Unduh Informasi style */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[1px]">
              <div className="bg-white text-[#101828] font-jakarta font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <Eye className="size-3.5 text-[#bc0c11]" />
                <span>{isEn ? "View Details" : "Lihat Detail"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Award Highlight */}
        <p className="font-jakarta text-xs font-bold text-[#bc0c11] tracking-wide mb-1.5 uppercase">
          {item.award}
        </p>

        {/* Title */}
        <h3 className="font-jakarta font-bold text-lg text-[#101828] group-hover:text-[#bc0c11] transition-colors mb-2 line-clamp-2 leading-snug">
          {item.title}
        </h3>

        {/* Competition Name & Organizer */}
        <p className="font-jakarta text-xs text-gray-500 font-medium mb-3 line-clamp-1">
          {item.competition}
        </p>

        {/* Description Snippet */}
        <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>
      </div>

      {/* Card Footer: Student Info & Action Button */}
      <div className="pt-4 border-t border-gray-100 font-jakarta text-xs text-gray-500 font-medium flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 flex items-center gap-1.5">
          <User className="size-3.5 text-[#bc0c11] shrink-0" aria-hidden="true" />
          <span className="truncate text-gray-700 font-semibold" title={item.studentName}>
            {item.studentName}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(item)}
          className="btn-primary !h-8 !min-h-[32px] !px-3.5 !text-xs !gap-1.5 shrink-0"
        >
          <span>{isEn ? "View Details" : "Lihat Detail"}</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
