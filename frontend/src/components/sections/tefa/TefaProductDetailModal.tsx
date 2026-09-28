"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TefaProductItem } from "./TefaCatalogSection";
import { useLanguage } from "@/context/LanguageContext";

interface TefaProductDetailModalProps {
  product: TefaProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestThisProduct?: (product: TefaProductItem) => void;
}

export default function TefaProductDetailModal({
  product,
  isOpen,
  onClose,
  onRequestThisProduct,
}: TefaProductDetailModalProps) {
  const { lang, language } = useLanguage();
  const isEn = lang === "EN" || language === "en";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-white rounded-[28px] overflow-hidden shadow-2xl border border-gray-200/90 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? "Close modal" : "Tutup modal"}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-black shadow-sm transition-all cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Modal Header Image */}
          <div className="relative w-full h-[190px] sm:h-[230px] bg-gray-100 shrink-0">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <h3 id="detail-modal-title" className="font-jakarta font-bold text-2xl sm:text-3xl text-white">
                  {product.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Modal Content Scrollable with Search-like Custom Scrollbar */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-6 sm:px-8 py-5 sm:py-6">
            <div className="space-y-6 pr-2">
              {/* Description & Badge */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {product.majorBadge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-jakarta font-semibold bg-[#ffebed] text-[#bc0c11]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {product.majorBadge}
                    </span>
                  )}
                  {product.duration && (
                    <span className="inline-block px-3 py-1 rounded-md text-xs font-jakarta font-medium bg-gray-100 text-[#4a5565]">
                      {isEn ? "Estimated: " : "Estimasi: "}{product.duration}
                    </span>
                  )}
                </div>
                <p className="font-jakarta text-sm sm:text-base text-[#364153] leading-relaxed">
                  {product.desc}
                </p>
              </div>

              {/* Features Included */}
              {product.features && (
                <div>
                  <h4 className="font-jakarta font-bold text-sm text-[#101828] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#bc0c11]" />
                    {isEn ? "Features & Scope of Work" : "Fitur & Lingkup Kerja"}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-jakarta text-[#4a5565]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#bc0c11] mt-0.5">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deliverables */}
              {product.deliverables && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-jakarta font-bold text-xs text-[#364153] uppercase tracking-wider mb-2">
                    {isEn ? "What You Receive:" : "Apa yang Anda Dapatkan:"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.deliverables.map((deliv, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-jakarta bg-white border border-gray-200 text-[#364153]">
                        ✓ {deliv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar Sticky at Bottom */}
          <div className="px-6 sm:px-8 py-4 border-t border-dashed border-gray-200 flex items-center justify-between gap-4 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-gray-300 text-sm font-jakarta font-medium text-[#4a5565] hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
            >
              {isEn ? "Back" : "Kembali"}
            </button>

            <Link
              href={`/tefa/request?service=${encodeURIComponent(product.title)}`}
              onClick={onClose}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-7 py-3 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white text-base font-jakarta font-medium transition-all active:scale-[0.98] cursor-pointer"
              style={{
                boxShadow:
                  "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
              }}
            >
              <span className="text-[15px] leading-none whitespace-nowrap">
                {isEn ? "Consult This Service" : "Konsultasikan Layanan Ini"}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
