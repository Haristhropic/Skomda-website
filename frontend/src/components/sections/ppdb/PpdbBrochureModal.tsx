"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink, X, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { DocumentItem } from "@/services/documents";

interface PpdbBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  brochure?: DocumentItem | null;
}

const BROCHURE_DATA = {
  titleId: "Brosur PPDB SMK Telkom Sidoarjo 2026/2027",
  titleEn: "SMK Telkom Sidoarjo PPDB Brochure 2026/2027",
  fileUrl: "/documents/brosur-ppdb-smk-telkom-sidoarjo-2026-2027.pdf",
  fileSize: "8.0 MB",
  pageCount: 2,
  descriptionId:
    "Informasi lengkap alur Penerimaan Peserta Didik Baru (PPDB), profil keahlian SIJA dan TJAT, beasiswa, rincian biaya pendidikan, serta fasilitas unggulan.",
  descriptionEn:
    "Comprehensive information on new student admissions (PPDB), SIJA and TJAT major profiles, scholarships, tuition breakdown, and campus facilities.",
};

export default function PpdbBrochureModal({
  isOpen,
  onClose,
  brochure,
}: PpdbBrochureModalProps) {
  const { isEn } = useLanguage();

  const title = brochure?.title || (isEn ? BROCHURE_DATA.titleEn : BROCHURE_DATA.titleId);
  const fileUrl = brochure?.fileUrl || BROCHURE_DATA.fileUrl;
  const fileSize = brochure?.fileSize || BROCHURE_DATA.fileSize;
  const fileType = brochure?.fileType || "PDF";
  const description =
    brochure?.description ||
    (isEn ? BROCHURE_DATA.descriptionEn : BROCHURE_DATA.descriptionId);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative max-w-6xl w-full h-[94vh] max-h-[94vh] bg-white rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-200 gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="text-[#bc0c11] shrink-0">
                  <FileText className="size-6 text-[#bc0c11]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-jakarta font-bold text-base sm:text-lg text-[#101828] leading-snug truncate">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-600 font-jakarta mt-0.5">
                    {fileType} • {fileSize}
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !h-10 !min-h-[40px] !px-3.5 !py-2 !text-xs sm:!text-sm cursor-pointer"
                  title={isEn ? "Open in new tab" : "Buka di tab baru"}
                >
                  <ExternalLink className="size-4" />
                  <span className="hidden sm:inline">
                    {isEn ? "New Tab" : "Buka Tab Baru"}
                  </span>
                </a>

                <a
                  href={fileUrl}
                  download
                  className="btn-primary !h-10 !min-h-[40px] !px-5 !py-2 !text-xs sm:!text-sm cursor-pointer"
                  title={isEn ? "Download PDF" : "Unduh PDF"}
                >
                  <Download className="size-4" />
                  <span className="hidden sm:inline">
                    {isEn ? "Download PDF" : "Unduh PDF"}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="neu-btn-icon !size-10 cursor-pointer"
                  aria-label={isEn ? "Close preview" : "Tutup pratinjau"}
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal Document Area */}
            <div className="relative flex-1 w-full mt-3 overflow-hidden rounded-xl bg-gray-100 border border-gray-200 shadow-inner">
              <iframe
                src={`${fileUrl}#view=FitH&toolbar=1&navpanes=1`}
                className="w-full h-full border-0 rounded-xl bg-white"
                title={title}
              />
            </div>

            {/* Modal Footer Info & Direct Actions */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs font-jakarta text-[#364153] gap-2.5">
              <p className="line-clamp-1 text-center sm:text-left text-gray-600 text-xs">
                {description}
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="https://ppdb.telkomschools.sch.id/signup?lemdik=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#bc0c11] font-bold hover:underline min-h-[36px] py-1"
                >
                  <span>{isEn ? "Enroll Now" : "Daftar PPDB Sekarang"}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
