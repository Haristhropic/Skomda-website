"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Eye,
  Search,
  X,
  Calendar,
  HardDrive,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDocumentList } from "@/services/documents";

export interface DownloadDoc {
  id: string;
  title: string;
  category: "Brosur PPDB" | "Sertifikasi & Akreditasi" | "Regulasi & Standar";
  group: string;
  uploadDate: string;
  fileSize: string;
  fileUrl: string;
  thumbnailUrl: string;
  description: string;
  pageCount: number;
}

export const DOWNLOAD_DOCUMENTS: DownloadDoc[] = [
  {
    id: "brosur-ppdb-2026",
    title: "Brosur PPDB SMK Telkom Sidoarjo 2026/2027",
    category: "Brosur PPDB",
    group: "Brosur & Informasi PPDB",
    uploadDate: "04 Mei 2026",
    fileSize: "8.0 MB",
    fileUrl: "/documents/brosur-ppdb-smk-telkom-sidoarjo-2026-2027.pdf",
    thumbnailUrl: "/documents/thumbnails/thumb-brosur-ppdb.jpg",
    description:
      "Informasi lengkap alur Penerimaan Peserta Didik Baru (PPDB), profil keahlian SIJA & TJAT, beasiswa, rincian biaya pendidikan, serta fasilitas unggulan.",
    pageCount: 2,
  },
  {
    id: "sertifikat-akreditasi",
    title: "Sertifikat Akreditasi 'A' SMK Telkom Sidoarjo",
    category: "Sertifikasi & Akreditasi",
    group: "Sertifikat & Akreditasi Sekolah",
    uploadDate: "04 Mei 2026",
    fileSize: "1.8 MB",
    fileUrl: "/documents/sertifikat-akreditasi-a-smk-telkom-sidoarjo.pdf",
    thumbnailUrl: "/documents/thumbnails/thumb-sertifikat-akreditasi.jpg",
    description:
      "Sertifikat resmi Akreditasi 'A' Unggul dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-SM) Nomor: 1336/BAN-SM/SK/2021 dengan nilai memuaskan.",
    pageCount: 1,
  },
  {
    id: "sertifikat-iso-21001",
    title: "Sertifikat ISO 21001:2018 SMK Telkom Sidoarjo",
    category: "Sertifikasi & Akreditasi",
    group: "Sertifikat & Akreditasi Sekolah",
    uploadDate: "04 Mei 2026",
    fileSize: "480 KB",
    fileUrl: "/documents/sertifikat-iso-21001-smk-telkom-sidoarjo.pdf",
    thumbnailUrl: "/documents/thumbnails/thumb-sertifikat-iso-21001.jpg",
    description:
      "Standar Internasional Sistem Manajemen Organisasi Pendidikan (EOMS) untuk penjaminan mutu tata kelola pendidikan dan pembelajaran vokasi modern.",
    pageCount: 1,
  },
  {
    id: "persekjen-17-2022",
    title: "PERSEKJENMENRISTEK RI No. 17 Tahun 2022",
    category: "Regulasi & Standar",
    group: "Tindak Kekerasan & Kekerasan Seksual",
    uploadDate: "04 Mei 2026",
    fileSize: "326 KB",
    fileUrl: "/documents/persekjenmenristek-no-17-tahun-2022.pdf",
    thumbnailUrl: "/documents/thumbnails/thumb-persekjen-17-2022.jpg",
    description:
      "Petunjuk Teknis Pencegahan dan Penanganan Kekerasan Seksual di Satuan Pendidikan sebagai komitmen lingkungan belajar aman dan inklusif.",
    pageCount: 74,
  },
  {
    id: "permendikbudristek-30-2021",
    title: "PERMENDIKBUDRISTEK RI No. 30 Tahun 2021",
    category: "Regulasi & Standar",
    group: "Tindak Kekerasan & Kekerasan Seksual",
    uploadDate: "04 Mei 2026",
    fileSize: "171 KB",
    fileUrl: "/documents/permendikbudristek-no-30-tahun-2021.pdf",
    thumbnailUrl: "/documents/thumbnails/thumb-permendikbudristek-30-2021.jpg",
    description:
      "Salinan Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi tentang Pencegahan dan Penanganan Kekerasan Seksual.",
    pageCount: 35,
  },
  {
    id: "permendikbud-82-2015",
    title: "PERMENDIKBUD RI No. 82 Tahun 2015",
    category: "Regulasi & Standar",
    group: "Tindak Kekerasan & Kekerasan Seksual",
    uploadDate: "04 Mei 2026",
    fileSize: "110 KB",
    fileUrl: "/documents/permendikbud-no-82-tahun-2015.pdf",
    thumbnailUrl: "/documents/thumbnails/thumb-permendikbud-82-2015.jpg",
    description:
      "Peraturan Menteri Pendidikan dan Kebudayaan RI tentang Pencegahan dan Penanggulangan Tindak Kekerasan di Lingkungan Satuan Pendidikan.",
    pageCount: 16,
  },
];

const CATEGORY_OPTIONS = [
  { key: "Semua", id: "Semua", en: "All" },
  { key: "Brosur PPDB", id: "Brosur PPDB", en: "PPDB Brochure" },
  { key: "Sertifikasi & Akreditasi", id: "Sertifikasi & Akreditasi", en: "Certifications & Accreditation" },
  { key: "Regulasi & Standar", id: "Regulasi & Standar", en: "Regulations & Standards" },
];

export default function UnduhInformasiClient() {
  const { lang, isEn, t } = useLanguage();
  const [docsList, setDocsList] = useState<DownloadDoc[]>(DOWNLOAD_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewDoc, setPreviewDoc] = useState<DownloadDoc | null>(null);

  useEffect(() => {
    let isMounted = true;
    getDocumentList()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          const publicDocs = data.filter(
            (d) =>
              d.isPublic !== false &&
              d.category !== "Dokumen K3" &&
              d.category !== "Kurikulum"
          );
          if (publicDocs.length > 0) {
            setDocsList(
              publicDocs.map((d) => {
                const existing = DOWNLOAD_DOCUMENTS.find(
                  (ex) => ex.title.toLowerCase() === d.title.toLowerCase()
                );
                const isBrochure =
                  d.category === "Brosur PPDB" ||
                  d.title.toLowerCase().includes("brosur");
                const isCert =
                  d.category === "Sertifikasi & Akreditasi" ||
                  d.title.toLowerCase().includes("sertifikat") ||
                  d.title.toLowerCase().includes("akreditasi") ||
                  d.title.toLowerCase().includes("iso");

                const detectedCategory: DownloadDoc["category"] = isBrochure
                  ? "Brosur PPDB"
                  : isCert
                  ? "Sertifikasi & Akreditasi"
                  : existing?.category || "Regulasi & Standar";

                const detectedGroup = isBrochure
                  ? "Brosur & Informasi PPDB"
                  : isCert
                  ? "Sertifikat & Akreditasi Sekolah"
                  : existing?.group || "Dokumen Regulasi Resmi";

                return {
                  id: String(d.id),
                  title: d.title,
                  category: detectedCategory,
                  group: detectedGroup,
                  uploadDate: existing?.uploadDate || "Terbaru",
                  fileSize: d.fileSize || existing?.fileSize || "1.0 MB",
                  fileUrl: d.fileUrl,
                  thumbnailUrl:
                    existing?.thumbnailUrl ||
                    (isBrochure
                      ? "/documents/thumbnails/thumb-brosur-ppdb.jpg"
                      : "/documents/thumbnails/thumb-persekjen-17-2022.jpg"),
                  description: d.description || existing?.description || "",
                  pageCount: existing?.pageCount || 2,
                };
              })
            );
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewDoc(null);
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

  const filteredDocs = useMemo(() => {
    let list = [...docsList];
    if (selectedCategory !== "Semua") {
      list = list.filter((d) => d.category === selectedCategory);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.group.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen pt-36 sm:pt-40 lg:pt-44 pb-20 sm:pb-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ─── Breadcrumb ─── */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm font-jakarta text-[#6a7282]"
        >
          <Link href="/" className="hover:text-[#bc0c11] transition-colors font-medium">
            {t("nav.home")}
          </Link>
          <ChevronRight className="size-3.5 text-gray-400 shrink-0" />
          <span className="text-[#101828] font-semibold">{t("unduh.breadcrumb")}</span>
        </nav>

        {/* ─── Header Section ─── */}
        <div className="mb-10 sm:mb-12 flex flex-col gap-3">
          <h1 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight tracking-tight text-[#101828]">
            {t("unduh.title1")} <span className="text-[#bc0c11]">{t("unduh.title2")}</span>
          </h1>

          <p className="font-jakarta text-base sm:text-lg text-[#4a5565] max-w-3xl leading-relaxed">
            {t("unduh.description")}
          </p>
        </div>

        {/* ─── Search & Category Filters ─── */}
        <div className="mb-10 flex flex-col gap-4">
          {/* Search Box */}
          <div className="relative w-full">
            <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search className="size-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("unduh.searchPlaceholder")}
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

          {/* Category Chips - Full-bleed horizontal slide on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none overscroll-x-contain">
            {CATEGORY_OPTIONS.map((cat) => {
              const isActive = selectedCategory === cat.key;
              const label = isEn ? cat.en : cat.id;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`shrink-0 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#bc0c11] text-white shadow-xs"
                      : "bg-white text-[#4a5565] border border-gray-200/80 hover:border-[#bc0c11] hover:text-[#bc0c11]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Documents Cards Grid ─── */}
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredDocs.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between rounded-[22px] bg-white p-5 sm:p-6 border-2 border-dashed border-[#d1d5dc] transition-all duration-300 hover:border-[#bc0c11] hover:shadow-lg"
              >
                <div className="flex flex-col gap-4">
                  {/* Thumbnail Preview with Zoom Overlay */}
                  <div
                    onClick={() => setPreviewDoc(doc)}
                    className="relative w-full aspect-[16/10] rounded-[14px] overflow-hidden bg-gray-100 cursor-pointer border border-gray-100 shadow-2xs"
                  >
                    <Image
                      src={doc.thumbnailUrl}
                      alt={doc.title}
                      fill
                      unoptimized
                      className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Hover Hint */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-white text-[#101828] font-jakarta font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <Eye className="size-3.5 text-[#bc0c11]" />
                        <span>{t("unduh.view")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata: Date & Size */}
                  <div className="flex items-center justify-between text-xs text-[#6a7282] font-jakarta">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-gray-400" />
                      <span>{doc.uploadDate}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#101828] bg-gray-100 px-2 py-0.5 rounded-md">
                      <HardDrive className="size-3 text-gray-500" />
                      <span>{doc.fileSize}</span>
                    </span>
                  </div>

                  {/* Document Title & Description */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-jakarta font-bold text-base sm:text-lg text-[#101828] leading-snug group-hover:text-[#bc0c11] transition-colors">
                      {doc.title}
                    </h3>
                    <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed line-clamp-3">
                      {doc.description}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-gray-100 hover:bg-[#bc0c11]/10 text-[#101828] hover:text-[#bc0c11] py-2.5 px-4 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 active:scale-[0.97] cursor-pointer"
                  >
                    <Eye className="size-4" />
                    <span>{t("unduh.view")}</span>
                  </button>

                  <a
                    href={doc.fileUrl}
                    download
                    className="group flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white py-2.5 px-4 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 active:scale-[0.97] cursor-pointer"
                    style={{
                      boxShadow:
                        "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                    }}
                  >
                    <Download className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                    <span>{t("unduh.download")}</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-16 text-center">
            <p className="font-jakarta text-sm sm:text-base text-[#4a5565] mb-4">
              {isEn ? "No documents match your search " : "Tidak ada dokumen yang sesuai dengan pencarian "}
              &ldquo;<strong className="text-[#101828]">{searchQuery}</strong>&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 active:scale-[0.97] cursor-pointer"
              style={{
                boxShadow:
                  "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
              }}
            >
              <span>{isEn ? "Reset Search" : "Reset Pencarian"}</span>
            </button>
          </div>
        )}

        {/* ─── Table Summary Section ─── */}
        <div className="mt-16 sm:mt-20 bg-white rounded-[24px] p-6 sm:p-8 border border-gray-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-gray-100">
            <div>
              <h2 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828]">
                {t("unduh.tableTitle")}
              </h2>
              <p className="font-jakarta text-xs sm:text-sm text-[#6a7282] mt-0.5">
                {t("unduh.tableSubtitle")}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left font-jakarta border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-[#101828] uppercase tracking-wider">
                  <th className="py-3.5 px-3">{t("unduh.colNo")}</th>
                  <th className="py-3.5 px-4">{t("unduh.colName")}</th>
                  <th className="py-3.5 px-4">{t("unduh.colCategory")}</th>
                  <th className="py-3.5 px-4">{t("unduh.colDate")}</th>
                  <th className="py-3.5 px-4">{t("unduh.colSize")}</th>
                  <th className="py-3.5 px-4 text-center">{t("unduh.colAction")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-[#364153]">
                {DOWNLOAD_DOCUMENTS.map((doc, i) => (
                  <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-3 font-semibold text-gray-500">{i + 1}</td>
                    <td className="py-4 px-4 font-bold text-[#101828]">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-[#bc0c11] shrink-0" />
                        <span>{doc.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {doc.group}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{doc.uploadDate}</td>
                    <td className="py-4 px-4 font-semibold text-gray-700">{doc.fileSize}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 hover:bg-[#bc0c11]/10 text-[#101828] hover:text-[#bc0c11] px-3.5 py-1.5 text-xs font-semibold font-jakarta transition-all duration-200 active:scale-95 cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                          <span>{t("unduh.view")}</span>
                        </button>
                        <a
                          href={doc.fileUrl}
                          download
                          className="group inline-flex items-center gap-1.5 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white px-3.5 py-1.5 text-xs font-semibold font-jakarta transition-all duration-200 active:scale-95 cursor-pointer"
                          style={{
                            boxShadow:
                              "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                          }}
                        >
                          <Download className="size-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
                          <span>{t("unduh.download")}</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Fullscreen Document Preview Modal ─── */}
      <AnimatePresence>
        {previewDoc && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setPreviewDoc(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative max-w-6xl w-full h-[94vh] max-h-[94vh] bg-white rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-200 gap-4">
                <h3 className="font-jakarta font-bold text-base sm:text-lg text-[#101828] leading-snug truncate min-w-0 flex-1">
                  {previewDoc.title}
                </h3>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#101828] px-3.5 py-2 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    title={lang === "EN" ? "Open in new tab" : "Buka di tab baru"}
                  >
                    <ExternalLink className="size-4" />
                    <span className="hidden sm:inline">{lang === "EN" ? "New Tab" : "Buka Tab Baru"}</span>
                  </a>

                  <a
                    href={previewDoc.fileUrl}
                    download
                    className="group inline-flex items-center gap-2 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white px-4 py-2 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 active:scale-[0.97] cursor-pointer"
                    style={{
                      boxShadow:
                        "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                    }}
                  >
                    <Download className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                    <span className="hidden sm:inline">{t("unduh.download")}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setPreviewDoc(null)}
                    className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
                    aria-label={lang === "EN" ? "Close preview" : "Tutup pratinjau"}
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Modal Document Area (Interactive Multi-page PDF Viewer with Native Zoom & Scroll) */}
              <div className="relative flex-1 w-full mt-3 overflow-hidden rounded-xl bg-gray-100 border border-gray-200/90 shadow-inner">
                <iframe
                  src={`${previewDoc.fileUrl}#view=FitH&toolbar=1&navpanes=1`}
                  className="w-full h-full border-0 rounded-xl bg-white"
                  title={previewDoc.title}
                />
              </div>

              {/* Modal Footer Info */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs font-jakarta text-[#6a7282] gap-2">
                <div className="flex items-center gap-2">
                  <span>{isEn ? "Size:" : "Ukuran:"} <strong className="text-[#101828]">{previewDoc.fileSize}</strong></span>
                  <span className="text-gray-300">•</span>
                  <span>{isEn ? "Pages:" : "Jumlah:"} <strong className="text-[#101828]">{previewDoc.pageCount} {isEn ? "Pages" : "Halaman"}</strong></span>
                </div>
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#bc0c11] font-bold hover:underline shrink-0"
                >
                  <span>{isEn ? "Open Fullscreen" : "Buka Layar Penuh"}</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
