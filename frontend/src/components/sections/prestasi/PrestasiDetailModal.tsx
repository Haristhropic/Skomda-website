"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, User, School, Building, Award } from "lucide-react";
import { PrestasiItem } from "@/data/prestasiData";
import { useLanguage } from "@/context/LanguageContext";

interface PrestasiDetailModalProps {
  item: PrestasiItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrestasiDetailModal({
  item,
  isOpen,
  onClose,
}: PrestasiDetailModalProps) {
  const { isEn } = useLanguage();

  // Close on Escape key & Lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const hasValidImage = Boolean(item?.image && item.image.trim() !== "");

  return (
    <AnimatePresence>
      {isOpen && item && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative max-w-2xl w-full bg-white rounded-[28px] p-5 sm:p-7 shadow-2xl flex flex-col border border-gray-200/90 overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-200 gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="text-[#bc0c11] shrink-0 mt-0.5">
                  <Trophy className="size-6 text-[#bc0c11]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#bc0c11] uppercase tracking-wide mb-1">
                    {item.award} • {item.category}
                  </p>
                  <h3 className="font-jakarta font-bold text-lg sm:text-xl text-[#101828] leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="size-9 sm:size-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label={isEn ? "Close modal" : "Tutup modal"}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-5 custom-scrollbar">
              {/* Optional Full Image */}
              {hasValidImage && (
                <div className="relative w-full aspect-[16/10] rounded-[18px] overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={item.image!}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 650px"
                  />
                </div>
              )}

              {/* Information Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-[18px] bg-[#f8f9fb] border border-gray-100 text-xs sm:text-sm font-jakarta">
                <div className="flex items-start gap-2.5">
                  <User className="size-4 text-[#bc0c11] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block text-[11px] font-medium">
                      {isEn ? "Student / Team" : "Siswa / Tim"}
                    </span>
                    <strong className="text-[#101828] font-semibold">{item.studentName}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <School className="size-4 text-[#bc0c11] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block text-[11px] font-medium">
                      {isEn ? "Class / Major" : "Kelas / Jurusan"}
                    </span>
                    <strong className="text-[#101828] font-semibold">{item.studentClass}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="size-4 text-[#bc0c11] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block text-[11px] font-medium">
                      {isEn ? "Competition" : "Ajang Kompetisi"}
                    </span>
                    <strong className="text-[#101828] font-semibold">{item.competition}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Building className="size-4 text-[#bc0c11] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block text-[11px] font-medium">
                      {isEn ? "Organizer & Year" : "Penyelenggara & Tahun"}
                    </span>
                    <strong className="text-[#101828] font-semibold">
                      {item.organizer} ({item.year})
                    </strong>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="font-jakarta font-bold text-sm text-[#101828] mb-2">
                  {isEn ? "Achievement Overview" : "Ulasan Pencapaian"}
                </h4>
                <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Modal Footer with Clean Action Buttons */}
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex items-center justify-end bg-white">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-full border border-gray-200 hover:border-gray-300 text-sm font-jakarta font-medium text-[#4a5565] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {isEn ? "Close" : "Tutup"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
