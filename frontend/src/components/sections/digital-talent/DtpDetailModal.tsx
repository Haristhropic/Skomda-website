"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Code2,
  Server,
  Network,
  Palette,
  Cpu,
  Cloud,
  Bot,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Wrench,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { DtpSpecialization } from "@/data/dtpData";
import { useLanguage } from "@/context/LanguageContext";
import { getCloudinaryUrl } from "@/lib/cloudinary";

interface DtpDetailModalProps {
  item: DtpSpecialization | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DtpDetailModal({
  item,
  isOpen,
  onClose,
}: DtpDetailModalProps) {
  const { t, isEn } = useLanguage();
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

  const renderIcon = () => {
    if (!item) return null;
    switch (item.id) {
      case "software-developer":
        return <Code2 className="size-6 text-[#bc0c11]" aria-hidden="true" />;
      case "network-sysadmin":
        return <Server className="size-6 text-[#bc0c11]" aria-hidden="true" />;
      case "network-infrastructure":
        return <Network className="size-6 text-[#bc0c11]" aria-hidden="true" />;
      case "visual-communication-design":
        return <Palette className="size-6 text-[#bc0c11]" aria-hidden="true" />;
      case "iot-engineer":
        return <Cpu className="size-6 text-[#bc0c11]" aria-hidden="true" />;
      case "cloud-engineer":
        return <Cloud className="size-6 text-[#bc0c11]" aria-hidden="true" />;
      case "ai-specialist":
        return <Bot className="size-6 text-[#bc0c11]" aria-hidden="true" />;
      case "digital-marketing":
        return <TrendingUp className="size-6 text-[#bc0c11]" aria-hidden="true" />;
      case "cyber-security":
      default:
        return <ShieldCheck className="size-6 text-[#bc0c11]" aria-hidden="true" />;
    }
  };

  const getFallbackImage = () => {
    switch (item?.id) {
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

  const displayImage = item?.image || getFallbackImage();

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
            className="relative max-w-3xl w-full bg-white rounded-[28px] p-5 sm:p-7 shadow-2xl flex flex-col border border-gray-200/90 overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="text-[#bc0c11] shrink-0">
                  {renderIcon()}
                </div>
                <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828] leading-snug">
                  {item.title}
                </h3>
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
            <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-6 custom-scrollbar">
              {/* Image Banner Laboratorium / Spesialisasi (Mirip Fasilitas) */}
              <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-[20px] overflow-hidden bg-gray-100 shadow-inner">
                <Image
                  src={getCloudinaryUrl(displayImage, { width: 900, quality: "auto:good" })}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>

              {/* Deskripsi Lengkap */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-jakarta">
                  {t("digitalTalent.specDescription", "Deskripsi Spesialisasi")}
                </h4>
                <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed">
                  {item.fullDesc}
                </p>
              </div>

              {/* Grid: Core Skills vs Supporting Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Core Skills Box */}
                <div className="rounded-[20px] neu-inset-panel p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="size-4 text-[#bc0c11]" />
                    <h5 className="font-jakarta font-bold text-sm text-[#101828]">
                      {t("digitalTalent.coreSkills", "Core Skills (Keahlian Utama)")}
                    </h5>
                  </div>
                  <ul className="space-y-2">
                    {item.coreSkills.map((skill, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#4a5565] font-jakarta">
                        <CheckCircle2 className="size-4 text-[#bc0c11] shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supporting Skills Box */}
                <div className="rounded-[20px] neu-inset-panel p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="size-4 text-[#bc0c11]" />
                    <h5 className="font-jakarta font-bold text-sm text-[#101828]">
                      {t("digitalTalent.supportingSkills", "Kompetensi Pendukung")}
                    </h5>
                  </div>
                  <ul className="space-y-2">
                    {item.supportingSkills.map((skill, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#4a5565] font-jakarta">
                        <span className="size-1.5 rounded-full bg-[#bc0c11] shrink-0 mt-2" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Prospek Karir Box */}
              <div className="rounded-[20px] neu-card-flat p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="size-4 text-[#bc0c11]" />
                  <h5 className="font-jakarta font-bold text-sm text-[#101828]">
                    {t("digitalTalent.careerProspects", "Peluang & Prospek Karir")}
                  </h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.careerProspects.map((career, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium font-jakarta bg-[#f3f4f6] text-[#364153] border border-gray-200"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools & Tech Stack */}
              <div className="rounded-[20px] neu-card-flat p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="size-4 text-[#bc0c11]" />
                  <h5 className="font-jakarta font-bold text-sm text-[#101828]">
                    {t("digitalTalent.toolsTitle", "Tools & Software Industri")}
                  </h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium font-jakarta bg-[#f3f4f6] text-[#364153] border border-gray-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-200 mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn-primary !h-10 !min-h-[40px] !px-6 !text-sm cursor-pointer"
              >
                <span className="leading-none whitespace-nowrap">{t("digitalTalent.closeDetails", "Tutup Informasi")}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
