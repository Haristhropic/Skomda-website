"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  FileText,
  Eye,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  K3_DOCUMENTS,
  type K3Document,
} from "@/data/k3Documents";
import { getDocumentList } from "@/services/documents";

const CATEGORIES = [
  "Semua",
  "SOP & Pedoman",
  "Rute & Denah Evakuasi",
  "Regulasi Pemerintah",
  "Standar Internasional",
  "Formulir & Checklist",
];

const ITEMS_PER_PAGE = 10;

export default function K3DocumentsListSection() {
  const { isEn } = useLanguage();
  const [k3Docs, setK3Docs] = useState<K3Document[]>(K3_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDoc, setPreviewDoc] = useState<K3Document | null>(null);

  useEffect(() => {
    let isMounted = true;
    getDocumentList("Dokumen K3")
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setK3Docs(
            data.map((d) => {
              const existing = K3_DOCUMENTS.find((ex) => ex.title.toLowerCase() === d.title.toLowerCase());
              return {
                id: String(d.id),
                driveId: existing?.driveId || "",
                title: d.title,
                category: existing?.category || "SOP & Pedoman",
                fileSize: d.fileSize || existing?.fileSize || "1.0 MB",
                format: "PDF",
                viewUrl: existing?.viewUrl || d.fileUrl,
                driveUrl: d.fileUrl,
              };
            })
          );
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Close preview modal on ESC key & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewDoc(null);
      }
    };
    if (previewDoc) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewDoc]);

  // Filter documents
  const filteredDocs = useMemo(() => {
    return k3Docs.filter((doc) => {
      const matchesSearch = doc.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === "Semua" || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, k3Docs]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE) || 1;
  const paginatedDocs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDocs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDocs, currentPage]);

  return (
    <section
      id="berkas-k3"
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#f9fafb] border-t border-gray-200/60 scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 flex flex-col gap-3">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] text-[#101828] tracking-tight leading-tight">
            {isEn
              ? "Official K3 Documents & Regulations Catalog"
              : "Katalog Berkas & Regulasi K3 Skomda"}
          </h2>

          <div className="h-1 w-12 rounded-full bg-[#bc0c11]" />

          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] max-w-3xl leading-relaxed">
            {isEn
              ? "A complete list of laboratory SOP manuals, evacuation maps, safety regulations, and official OSH standards at SMK Telkom Sidoarjo."
              : "Daftar lengkap berkas SOP, denah jalur evakuasi, regulasi keselamatan, dan pedoman K3 resmi SMK Telkom Sidoarjo."}
          </p>
        </div>

        {/* ─── Search & Category Filters (Identik dengan Halaman Unduh Informasi) ─── */}
        <div className="mb-8 flex flex-col gap-4">
          {/* Search Box */}
          <div className="relative w-full">
            <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search className="size-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? "Search laboratory SOPs, evacuation maps, or safety files..."
                  : "Cari dokumen SOP, jalur evakuasi, atau berkas K3..."
              }
              className="w-full rounded-full bg-white pl-14 sm:pl-16 pr-12 sm:pr-14 py-3.5 sm:py-4 text-sm sm:text-base font-jakarta text-[#101828] placeholder-gray-400 border border-gray-200/90 focus:border-[#bc0c11] focus:outline-none shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 size-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Hapus pencarian"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#bc0c11] text-white shadow-xs"
                      : "bg-white text-[#4a5565] border border-gray-200/80 hover:border-[#bc0c11] hover:text-[#bc0c11]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Documents Table List ─── */}
        <div className="rounded-[24px] bg-white border-2 border-dashed border-[#d1d5dc] shadow-xs overflow-hidden">
          {paginatedDocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-jakarta border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-gray-200 text-xs font-bold text-[#101828] uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-6 w-14 text-center">No</th>
                    <th className="py-4 px-4 sm:px-6">{isEn ? "Document Name" : "Nama Berkas / Dokumen"}</th>
                    <th className="py-4 px-4 hidden md:table-cell">{isEn ? "Category" : "Kategori"}</th>
                    <th className="py-4 px-4 hidden sm:table-cell">{isEn ? "Size" : "Ukuran"}</th>
                    <th className="py-4 px-4 sm:px-6 text-center w-28 sm:w-36">{isEn ? "Action" : "Aksi"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-[#364153]">
                  {paginatedDocs.map((doc, idx) => {
                    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    return (
                      <tr
                        key={doc.id}
                        className="hover:bg-red-50/40 transition-colors group cursor-pointer"
                        onClick={() => setPreviewDoc(doc)}
                      >
                        <td className="py-4 px-4 sm:px-6 font-semibold text-gray-400 text-center">
                          {globalIndex}
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-bold text-[#101828]">
                          <div className="flex items-center gap-3">
                            <FileText className="size-5 text-[#bc0c11] shrink-0" />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-[#101828] group-hover:text-[#bc0c11] transition-colors">
                                {doc.title}
                              </p>
                              <p className="text-xs text-gray-500 sm:hidden mt-0.5">
                                {doc.category} ({doc.fileSize})
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell font-semibold text-gray-600">
                          {doc.fileSize}
                        </td>
                        <td
                          className="py-4 px-4 sm:px-6 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="min-h-[38px] inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-[#bc0c11] text-[#bc0c11] hover:text-white px-4 py-1.5 text-xs font-bold transition-all cursor-pointer active:scale-95"
                            title={isEn ? "Preview Document" : "Lihat Dokumen"}
                          >
                            <Eye className="size-3.5" />
                            <span>{isEn ? "View" : "Lihat"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="size-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="size-6" />
              </div>
              <h3 className="font-jakarta font-bold text-base text-[#101828] mb-1">
                {isEn ? "No documents found" : "Tidak ada berkas yang cocok"}
              </h3>
              <p className="font-jakarta text-xs text-gray-500 mb-4">
                {isEn
                  ? "Try using different keywords or reset the category filter."
                  : "Coba gunakan kata kunci lain atau reset filter kategori."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                }}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-full bg-[#bc0c11] text-white px-5 py-2 text-xs font-bold cursor-pointer"
              >
                <span>{isEn ? "Reset Filter" : "Reset Filter"}</span>
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-[#f9fafb] text-xs font-jakarta">
              <span className="text-gray-500">
                {isEn ? "Page" : "Halaman"} <strong className="text-[#101828]">{currentPage}</strong>{" "}
                {isEn ? "of" : "dari"} <strong className="text-[#101828]">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="min-h-[36px] px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                  <span className="hidden sm:inline">{isEn ? "Previous" : "Sebelumnya"}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`size-8 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                        currentPage === page
                          ? "bg-[#bc0c11] text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="min-h-[36px] px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline">{isEn ? "Next" : "Berikutnya"}</span>
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Fullscreen Document Preview Modal (Sama seperti halaman Unduh Informasi) ─── */}
      <AnimatePresence>
        {previewDoc && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative max-w-6xl w-full h-[94vh] max-h-[94vh] bg-white rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-200 gap-4">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <FileText className="size-5 text-[#bc0c11] shrink-0" />
                  <h3 className="font-jakarta font-bold text-sm sm:text-base text-[#101828] leading-snug truncate">
                    {previewDoc.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(null)}
                    className="min-h-[40px] size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Tutup preview"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Modal Document Area */}
              <div className="relative flex-1 w-full mt-3 overflow-hidden rounded-xl bg-gray-100 border border-gray-200/90 shadow-inner">
                <iframe
                  src={previewDoc.viewUrl}
                  className="w-full h-full border-0 rounded-xl bg-white"
                  title={previewDoc.title}
                  allow="autoplay"
                />
              </div>

              {/* Modal Footer Info */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs font-jakarta text-[#6a7282] gap-2">
                <div className="flex items-center gap-3">
                  <p>
                    {isEn ? "Category:" : "Kategori:"}{" "}
                    <strong className="text-[#101828]">{previewDoc.category}</strong>
                  </p>
                  <p>
                    {isEn ? "Size:" : "Ukuran:"}{" "}
                    <strong className="text-[#101828]">{previewDoc.fileSize}</strong>
                  </p>
                  <p>
                    Format: <strong className="text-[#101828]">PDF</strong>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
