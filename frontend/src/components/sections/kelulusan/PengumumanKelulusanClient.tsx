"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronLeft, ChevronRight, FileText, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";
import initialAlumniData from "@/data/alumni-angkatan-6.json";
import { AlumniItem, getAlumniList } from "@/services/alumni";

const ITEMS_PER_PAGE = 15;

export default function PengumumanKelulusanClient() {
  const { lang, language, t } = useLanguage();
  const isEn = lang === "EN" || language === "en";

  const formatKeterangan = (text?: string) => {
    if (!text) return "";
    if (!isEn) return text;
    return text
      .replace(/Lulusan Tahun Ajaran\s*/gi, "Graduate of Academic Year ")
      .replace(/Lulusan\s*/gi, "Graduate of ")
      .replace(/Tahun Ajaran\s*/gi, "Academic Year ");
  };

  const [alumniList, setAlumniList] = useState<AlumniItem[]>(initialAlumniData as AlumniItem[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniItem | null>(null);

  // Fetch dynamic data from API on mount
  useEffect(() => {
    getAlumniList()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAlumniList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    return [
      { key: "Semua", label: isEn ? "All Students" : "Semua Siswa", count: alumniList.length },
      { key: "Melanjutkan Studi", label: isEn ? "Higher Education" : "Melanjutkan Kuliah", count: alumniList.filter((a) => a.kategori === "Melanjutkan Studi").length },
      { key: "Bekerja", label: isEn ? "Employed" : "Bekerja", count: alumniList.filter((a) => a.kategori === "Bekerja").length },
      { key: "Wirausaha", label: isEn ? "Entrepreneurship" : "Wirausaha", count: alumniList.filter((a) => a.kategori === "Wirausaha").length },
      { key: "Mencari Kerja", label: isEn ? "Career Preparation" : "Persiapan Karir", count: alumniList.filter((a) => a.kategori === "Mencari Kerja").length },
      { key: "Alumni", label: isEn ? "Registered Alumni" : "Alumni Terdaftar", count: alumniList.filter((a) => a.kategori === "Alumni").length },
    ];
  }, [alumniList, isEn]);

  // Filter alumni based on search query and category
  const filteredAlumni = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return alumniList.filter((item) => {
      const matchCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;
      if (!matchCategory) return false;

      if (!q) return true;
      const matchName = item.name.toLowerCase().includes(q);
      const matchInstitusi = item.institusi ? item.institusi.toLowerCase().includes(q) : false;
      const matchKeterangan = item.keterangan ? item.keterangan.toLowerCase().includes(q) : false;
      return matchName || matchInstitusi || matchKeterangan;
    });
  }, [searchQuery, selectedCategory, alumniList]);

  // Read search query from URL parameter if available (e.g. from Global Navbar Search)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || params.get("nama") || params.get("search");
      if (q) {
        setSearchQuery(q);
        setTimeout(() => {
          const el = document.getElementById("portal-kelulusan");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  }, []);

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Handle ESC key to close modal & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedAlumni(null);
      }
    };
    if (selectedAlumni) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedAlumni]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE) || 1;
  const paginatedAlumni = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAlumni.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAlumni, currentPage]);

  return (
    <>
      {/* ── 1. Hero Section ── */}
      <PageHeroSection
        breadcrumbs={[
          { label: t("nav.information", "Informasi"), href: "/informasi/berita" },
          { label: t("informasi.kelulusanBreadcrumb", "Pengumuman Kelulusan"), href: "/informasi/pengumuman-kelulusan" },
        ]}
        titlePrefix={t("informasi.kelulusanTitle1", "Pengumuman")}
        titleHighlight={t("informasi.kelulusanTitle2", "Kelulusan Siswa")}
        titleHighlightColor="text-[#bc0c11]"
        showAccentBar={true}
        description={t(
          "informasi.kelulusanDesc",
          "Akses informasi resmi penetapan kelulusan peserta didik SMK Telkom Sidoarjo tahun ajaran berjalan, prosedur verifikasi berkas, dan panduan transisi ke dunia kerja maupun perguruan tinggi."
        )}
        studentImage="/images/informasi/pengumuman-kelulusan/hero-student-kelulusan.png"
        studentAlt={`${t("informasi.kelulusanBreadcrumb", "Pengumuman Kelulusan")} SMK Telkom Sidoarjo`}
        ctaText={t("informasi.kelulusanCta", "Jelajahi")}
        ctaHref="#portal-kelulusan"
        imagePosition="right"
        isIntegratedArtwork={true}
      />

      {/* ── 2. Main Portal & Search Section ── */}
      <section id="portal-kelulusan" className="py-16 sm:py-20 bg-[#f3f4f6] scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-[34px] text-[#101828] leading-tight">
              {isEn ? "Student Graduation Status Search" : "Pencarian Status Kelulusan Siswa"}
            </h2>
            <div className="section-title-line" />
            <p className="font-jakarta text-sm sm:text-base text-[#4b5563]">
              {isEn
                ? "Enter student name or select a category to view official graduation records and Graduation Certificate (SKL) details."
                : "Masukkan nama siswa atau pilih kategori status untuk melihat informasi kelulusan resmi dan detail Surat Keterangan Lulus (SKL)."}
            </p>
          </div>

          {/* ── Search & Filter Controls (Minimalist & Consistent with Berita / Prestasi pages) ── */}
          <div className="mb-8 flex flex-col gap-4">
            {/* Search Input Bar */}
            <div className="relative w-full">
              <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search className="size-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search student name, university, or company..." : "Cari nama siswa, perguruan tinggi, atau perusahaan..."}
                className="w-full rounded-full bg-white pl-14 sm:pl-16 pr-12 sm:pr-14 py-3.5 sm:py-4 text-sm sm:text-base font-jakarta text-[#101828] placeholder-gray-400 border border-gray-200/90 focus:border-[#bc0c11] focus:outline-none shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 size-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={isEn ? "Clear search" : "Hapus pencarian"}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills - Full-bleed horizontal slide on mobile with ample padding to avoid shadow clipping */}
            <div className="neu-filter-container">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`group shrink-0 transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
                      isActive ? "neu-pill-active" : "neu-pill"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[11px] rounded-full px-2 py-0.5 font-bold transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-200/70 text-[#4a5565] group-hover:bg-red-50 group-hover:text-[#bc0c11]"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between mb-6 px-1">
            <p className="font-jakarta text-xs sm:text-sm text-[#4b5563]">
              {isEn ? (
                <>
                  Found <span className="font-bold text-[#101828]">{filteredAlumni.length}</span> students
                  {selectedCategory !== "Semua" && (
                    <span> in category <span className="font-semibold text-[#bc0c11]">
                      {categories.find((c) => c.key === selectedCategory)?.label || selectedCategory}
                    </span></span>
                  )}
                  {searchQuery.trim() && <span> for keyword &quot;<span className="font-semibold text-[#101828]">{searchQuery}</span>&quot;</span>}
                </>
              ) : (
                <>
                  Ditemukan <span className="font-bold text-[#101828]">{filteredAlumni.length}</span> siswa
                  {selectedCategory !== "Semua" && <span> pada kategori <span className="font-semibold text-[#bc0c11]">{selectedCategory}</span></span>}
                  {searchQuery.trim() && <span> dengan kata kunci &quot;<span className="font-semibold text-[#101828]">{searchQuery}</span>&quot;</span>}
                </>
              )}
            </p>
            <span className="text-xs text-[#4b5563] hidden sm:block">
              {isEn ? `Page ${currentPage} of ${totalPages}` : `Halaman ${currentPage} dari ${totalPages}`}
            </span>
          </div>

          {/* ── Table List Siswa Kelulusan (Per Baris) ── */}
          <div className="rounded-[24px] neu-card shadow-xs overflow-hidden">
            {paginatedAlumni.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-jakarta border-collapse">
                  <thead>
                    <tr className="bg-[#f9fafb] border-b border-gray-200 text-xs font-bold text-[#101828] uppercase tracking-wider">
                      <th className="py-4 px-4 sm:px-6 w-16 text-center">No</th>
                      <th className="py-4 px-4 sm:px-6">{isEn ? "Student Name" : "Nama Siswa"}</th>
                      <th className="py-4 px-4 hidden sm:table-cell w-36">Status</th>
                      <th className="py-4 px-4 hidden md:table-cell">{isEn ? "Activity & Placement" : "Aktivitas & Penempatan"}</th>
                      <th className="py-4 px-4 sm:px-6 text-center w-28 sm:w-36">{isEn ? "Action" : "Aksi"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-[#364153]">
                    {paginatedAlumni.map((item, idx) => {
                      const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedAlumni(item)}
                          className="hover:bg-red-50/30 transition-colors group cursor-pointer"
                        >
                          <td className="py-4 px-4 sm:px-6 font-semibold text-gray-400 text-center text-xs sm:text-sm">
                            {globalIndex}
                          </td>
                          <td className="py-4 px-4 sm:px-6 font-bold text-[#101828]">
                            <p className="font-semibold text-sm sm:text-base text-[#101828] group-hover:text-[#bc0c11] transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-[#6a7282] md:hidden mt-0.5 truncate font-normal">
                              {formatKeterangan(item.keterangan)}
                            </p>
                          </td>
                          <td className="py-4 px-4 hidden sm:table-cell">
                            <span className="text-xs sm:text-sm font-semibold text-emerald-600">
                              {isEn ? "Graduated" : "Lulus"}
                            </span>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell text-xs sm:text-sm text-[#364153]">
                            <p className="line-clamp-1 font-medium text-[#364153]">
                              {formatKeterangan(item.keterangan)}
                            </p>
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => setSelectedAlumni(item)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#bc0c11] hover:border-[#bc0c11] border border-gray-200/90 rounded-full px-3.5 py-1.5 bg-white transition-all cursor-pointer shadow-2xs hover:bg-red-50/40"
                              title={isEn ? "View Graduation Certificate" : "Lihat Surat Keterangan Lulus"}
                            >
                              <FileText className="size-3.5 shrink-0 text-[#bc0c11]" />
                              <span className="hidden sm:inline">{isEn ? "View SKL" : "Lihat SKL"}</span>
                              <span className="sm:hidden">SKL</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 p-8 max-w-xl mx-auto">
                <p className="font-jakarta text-sm sm:text-base text-[#4a5565] mb-4">
                  {isEn ? (
                    <>
                      No student graduation records matched your search{" "}
                      {searchQuery && (
                        <>
                          for keyword &ldquo;<strong className="text-[#101828]">{searchQuery}</strong>&rdquo;
                        </>
                      )}
                      {selectedCategory !== "Semua" && (
                        <>
                          {searchQuery ? " in" : ""} category &ldquo;<strong className="text-[#101828]">{categories.find((c) => c.key === selectedCategory)?.label || selectedCategory}</strong>&rdquo;
                        </>
                      )}
                      .
                    </>
                  ) : (
                    <>
                      Tidak ada data kelulusan siswa yang sesuai dengan pencarian{" "}
                      {searchQuery && (
                        <>
                          kata kunci &ldquo;<strong className="text-[#101828]">{searchQuery}</strong>&rdquo;
                        </>
                      )}
                      {selectedCategory !== "Semua" && (
                        <>
                          {searchQuery ? " pada" : ""} kategori &ldquo;<strong className="text-[#101828]">{selectedCategory}</strong>&rdquo;
                        </>
                      )}
                      .
                    </>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Semua");
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <span>{isEn ? "Reset Search" : "Atur Ulang Pencarian"}</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Pagination Bar ── */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-10 px-4 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-semibold font-jakarta text-[#4a5565] hover:border-[#bc0c11] hover:text-[#bc0c11] disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
              >
                <ChevronLeft className="size-4" />
                <span>{isEn ? "Previous" : "Sebelumnya"}</span>
              </button>

              <div className="flex items-center gap-1 sm:gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;
                    return (
                      <div key={p} className="flex items-center">
                        {showEllipsis && <span className="px-2 text-xs text-gray-400">...</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`size-10 rounded-full text-xs sm:text-sm font-semibold font-jakarta transition-all cursor-pointer flex items-center justify-center ${
                            currentPage === p
                              ? "bg-[#bc0c11] text-white shadow-xs font-bold"
                              : "border border-gray-200 bg-white text-[#4a5565] hover:border-[#bc0c11] hover:text-[#bc0c11] shadow-xs"
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    );
                  })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-10 px-4 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-semibold font-jakarta text-[#4a5565] hover:border-[#bc0c11] hover:text-[#bc0c11] disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>{isEn ? "Next" : "Berikutnya"}</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ── 3. Modal SKL Digital Pop-up (Minimalist & Professional) ── */}
      <AnimatePresence>
        {selectedAlumni && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setSelectedAlumni(null)}
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? `Graduation Certificate ${selectedAlumni.name}` : `SKL ${selectedAlumni.name}`}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative max-w-xl w-full bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 shadow-2xl flex flex-col border border-gray-200/90 overflow-hidden max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-red-50 text-[#bc0c11] shrink-0 border border-red-100">
                    <GraduationCap className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#bc0c11] uppercase tracking-wider">
                      {isEn ? "Graduation Certificate (SKL)" : "Surat Keterangan Lulus (SKL)"}
                    </p>
                    <h3 className="font-jakarta font-bold text-base sm:text-lg text-[#101828] leading-tight truncate">
                      SMK Telkom Sidoarjo
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedAlumni(null)}
                  className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label={isEn ? "Close modal" : "Tutup modal"}
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Body / Certificate Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto mt-5 space-y-5 pr-1">
                {/* Certificate Sub-Header */}
                <div className="text-center pb-2">
                  <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                    {isEn ? "Official Graduation Registry" : "Pangkalan Data Resmi Kelulusan"}
                  </span>
                  <h4 className="font-jakarta font-bold text-lg sm:text-xl text-[#101828] mt-0.5">
                    {selectedAlumni.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {isEn ? "Verification No." : "No. Verifikasi"}: SKL/2024/{String(selectedAlumni.id).padStart(4, "0")}
                  </p>
                </div>

                {/* Data List (Clean & Minimalist Definition List) */}
                <div className="rounded-2xl bg-gray-50/70 border border-gray-100 p-4 sm:p-5 space-y-3 font-jakarta text-xs sm:text-sm">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-500">{isEn ? "Educational Unit" : "Satuan Pendidikan"}</span>
                    <span className="font-semibold text-[#101828]">SMK Telkom Sidoarjo</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-500">{isEn ? "Academic Year" : "Tahun Ajaran"}</span>
                    <span className="font-medium text-[#101828]">{selectedAlumni.tahunAjaran}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-500">{isEn ? "Graduation Status" : "Status Kelulusan"}</span>
                    <span className="font-bold text-emerald-600">{isEn ? "Eligible & Graduated" : "Lulus Memenuhi Syarat"}</span>
                  </div>
                  <div className="flex justify-between items-start py-1.5">
                    <span className="text-gray-500 shrink-0">{isEn ? "Activity & Placement" : "Aktivitas & Penempatan"}</span>
                    <span className="font-semibold text-[#101828] text-right ml-4">
                      {formatKeterangan(selectedAlumni.keterangan)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAlumni(null)}
                  className="rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2 text-xs sm:text-sm font-semibold font-jakarta transition-colors cursor-pointer"
                >
                  {isEn ? "Close" : "Tutup"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
