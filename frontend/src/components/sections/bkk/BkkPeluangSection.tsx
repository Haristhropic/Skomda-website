"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { PELUANG_KARIER_ITEMS, PeluangKarierItem, getLocalizedPeluangKarier } from "@/data/bkkData";
import { getBKKJobs } from "@/services/bkk";
import { useLanguage } from "@/context/LanguageContext";
import { Search, MapPin, Briefcase, ChevronRight, ChevronDown, ChevronUp, X, Copy, Check, Send, RotateCcw } from "lucide-react";

export default function BkkPeluangSection() {
  const { isEn } = useLanguage();

  const [jobsList, setJobsList] = useState<PeluangKarierItem[]>(PELUANG_KARIER_ITEMS);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<PeluangKarierItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Mengambil lowongan yang berstatus 'active' (yang telah disetujui / di-ACC admin)
    const fetchActiveJobs = () => {
      getBKKJobs("active")
        .then((data) => {
          if (!isMounted) return;
          if (Array.isArray(data) && data.length > 0) {
            // Dobel filter sisi klien untuk memastikan hanya lowongan berstatus 'active' yang tampil
            const activeJobsOnly = data.filter(
              (j) => (j.status || "active").toLowerCase() === "active"
            );

            if (activeJobsOnly.length > 0) {
              setJobsList(
                activeJobsOnly.map((j) => {
                  const existing = PELUANG_KARIER_ITEMS.find(
                    (e) =>
                      e.title.toLowerCase() === (j.title || "").toLowerCase() ||
                      e.company.toLowerCase() === (j.company || "").toLowerCase()
                  );

                  const isIntern =
                    (j.jobType || "").toLowerCase().includes("magang") ||
                    (j.jobType || "").toLowerCase().includes("pkl") ||
                    (j.jobType || "").toLowerCase().includes("intern");

                  const parsedRequirements = j.requirements?.trim()
                    ? j.requirements
                        .split(/\r?\n|•|\*/)
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0)
                    : existing?.requirements || [];

                  return {
                    id: String(j.id),
                    title: j.title || "Lowongan Kerja",
                    company: j.company || "Mitra Industri",
                    logo:
                      j.companyLogo ||
                      existing?.logo ||
                      "/images/partners/logo-telkom-indonesia.jpg",
                    location: j.location || "Sidoarjo",
                    type: (isIntern ? "Internship" : "Full Time") as "Internship" | "Full Time",
                    jurusan: j.jurusan || existing?.jurusan || "SIJA & TJAT",
                    postedDate: existing?.postedDate || "Oktober 2026",
                    deadline: j.deadline || "Segera",
                    salaryRange: j.salary || existing?.salaryRange || "Standar Industri",
                    description: j.description || existing?.description || "",
                    responsibilities: existing?.responsibilities || [],
                    requirements: parsedRequirements,
                    applyEmail:
                      j.applyUrl?.replace("mailto:", "") ||
                      existing?.applyEmail ||
                      "karir@smktelkom-sda.sch.id",
                  };
                })
              );
            }
          }
        })
        .catch(() => {
          // Fallback jika API backend belum terhubung/offline: tetap gunakan default data
        });
    };

    fetchActiveJobs();

    // Auto refresh saat pengguna beralih kembali ke tab halaman ini (misal setelah approve di Admin)
    window.addEventListener("focus", fetchActiveJobs);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", fetchActiveJobs);
    };
  }, []);

  const filterOptions = [
    { key: "all", label: isEn ? "All" : "Semua" },
    { key: "sija", label: "SIJA" },
    { key: "tjat", label: "TJAT" },
    { key: "internship", label: isEn ? "Internship" : "Magang" },
    { key: "full_time", label: isEn ? "Full Time" : "Penuh Waktu" },
  ];

  // Filter jobs based on active category & search query (recalculates whenever jobsList updates)
  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (job.title || "").toLowerCase().includes(q) ||
        (job.company || "").toLowerCase().includes(q) ||
        (job.location || "").toLowerCase().includes(q);

      if (!matchSearch) return false;

      const jur = (job.jurusan || "").toUpperCase();
      if (activeFilter === "all") return true;
      if (activeFilter === "sija") return jur.includes("SIJA");
      if (activeFilter === "tjat") return jur.includes("TJAT");
      if (activeFilter === "internship") return job.type === "Internship";
      if (activeFilter === "full_time") return job.type === "Full Time";

      return true;
    });
  }, [jobsList, activeFilter, searchQuery]);

  // Displayed jobs: show top 4 when not expanded, or all matching jobs when showAll is true
  const displayedJobs = useMemo(() => {
    if (showAll) {
      return filteredJobs;
    }
    return filteredJobs.slice(0, 4);
  }, [filteredJobs, showAll]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedJob(null);
      }
    };
    if (selectedJob) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedJob]);

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleViewAll = () => {
    setShowAll((prev) => !prev);
  };

  const handleResetFiltersAndShowAll = () => {
    setActiveFilter("all");
    setSearchQuery("");
    setShowAll(true);
  };

  return (
    <section id="peluang-karier" className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#f9fafb] border-t border-gray-200/60 overflow-x-clip scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-[#101828] mb-2">
            {isEn ? (
              <>
                Latest <span className="text-[#bc0c11]">Career Opportunities</span>
              </>
            ) : (
              <>
                Peluang <span className="text-[#bc0c11]">Karier Terbaru</span>
              </>
            )}
          </h2>

          <div className="section-title-line" />

          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] max-w-3xl leading-relaxed">
            {isEn
              ? "Find verified career openings and industrial internships matching your vocational competencies."
              : "Temukan kesempatan karier dan magang industri terverifikasi yang sesuai dengan kompetensi keahlianmu."}
          </p>
        </div>

        {/* ─── Search & Category Filters (Consistent with Site Standards) ─── */}
        <div className="mb-10 flex flex-col gap-4">
          {/* Full-Width Clean Search Box */}
          <div className="relative w-full">
            <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search className="size-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search position, company, or location..." : "Cari posisi, perusahaan, atau lokasi..."}
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
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setActiveFilter(opt.key)}
                  className={isActive ? "neu-pill-active" : "neu-pill"}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter & Active Filter Bar */}
        <div className="flex items-center justify-between gap-3 mb-4 px-1 flex-wrap">
          <p className="text-xs sm:text-sm font-jakarta font-semibold text-[#4a5565]">
            {isEn
              ? `Menampilkan ${displayedJobs.length} dari ${filteredJobs.length} peluang karier`
              : `Menampilkan ${displayedJobs.length} dari ${filteredJobs.length} lowongan kerja`}
          </p>
          {(activeFilter !== "all" || searchQuery.trim() !== "") && (
            <button
              type="button"
              onClick={handleResetFiltersAndShowAll}
              className="text-xs font-jakarta font-bold text-[#bc0c11] hover:underline cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="size-3" />
              <span>{isEn ? "Reset Filter" : "Atur Ulang Filter"}</span>
            </button>
          )}
        </div>

        {/* Job Opportunity Cards List */}
        <div className="flex flex-col gap-4 mb-8">
          {displayedJobs.length > 0 ? (
            displayedJobs.map((rawJob) => {
              const job = getLocalizedPeluangKarier(rawJob, isEn);
              return (
              <div
                key={job.id}
                className="rounded-[24px] neu-card-interactive px-5 sm:px-7 py-5 sm:py-6 group transition-all duration-200 animate-in fade-in-0"
              >
                {/* Desktop Aligned Row Layout (>= 1024px) */}
                <div className="hidden lg:flex items-center justify-between gap-6">
                  
                  {/* Column 1: Unboxed Large Company Logo */}
                  <div className="w-36 shrink-0 h-10 flex items-center justify-start">
                    <Image
                      src={job.logo}
                      alt={job.company}
                      width={130}
                      height={38}
                      className="object-contain object-left max-h-10 max-w-[130px]"
                    />
                  </div>

                  {/* Column 2: Job Title & Company Name */}
                  <div className="flex-1 min-w-[220px]">
                    <h3 className="font-jakarta font-bold text-base sm:text-lg text-[#101828] truncate group-hover:text-[#bc0c11] transition-colors">
                      {job.title}
                    </h3>
                    <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] truncate mt-0.5">
                      {job.company}
                    </p>
                  </div>

                  {/* Column 3: Location */}
                  <div className="w-32 shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-jakarta text-[#4a5565]">
                    <MapPin className="size-4 text-[#bc0c11] shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>

                  {/* Column 4: Job Type */}
                  <div className="w-28 shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-jakarta text-[#4a5565]">
                    <Briefcase className="size-4 text-[#bc0c11] shrink-0" />
                    <span>{job.type}</span>
                  </div>

                  {/* Column 5: Jurusan Badge */}
                  <div className="w-24 shrink-0 text-left">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-jakarta font-semibold bg-red-50 text-[#bc0c11] border border-red-100">
                      {job.jurusan}
                    </span>
                  </div>

                  {/* Column 6: Action Button */}
                  <div className="w-32 shrink-0 text-right">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="inline-flex items-center gap-1.5 text-sm font-jakarta font-semibold text-[#bc0c11] hover:text-[#990a0e] group-hover:translate-x-0.5 transition-all cursor-pointer"
                    >
                      <span>{isEn ? "View Details" : "Lihat Detail"}</span>
                      <ChevronRight className="size-4 text-[#bc0c11]" />
                    </button>
                  </div>

                </div>

                {/* Mobile & Tablet Responsive Card Layout (< 1024px) */}
                <div className="flex lg:hidden flex-col gap-3.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-9 w-28 shrink-0 flex items-center">
                      <Image
                        src={job.logo}
                        alt={job.company}
                        width={110}
                        height={34}
                        className="object-contain object-left max-h-9 max-w-[110px]"
                      />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-jakarta font-semibold bg-red-50 text-[#bc0c11] border border-red-100">
                      {job.jurusan}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-jakarta font-bold text-base text-[#101828] group-hover:text-[#bc0c11] transition-colors">
                      {job.title}
                    </h3>
                    <p className="font-jakarta text-xs text-[#4a5565] mt-0.5">
                      {job.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 gap-2">
                    <div className="flex items-center gap-3 text-xs font-jakarta text-[#4a5565]">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-[#bc0c11] shrink-0" />
                        {job.location}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="size-3.5 text-[#bc0c11] shrink-0" />
                        {job.type}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedJob(job)}
                      className="inline-flex items-center gap-1 text-xs font-jakarta font-semibold text-[#bc0c11] hover:text-[#990a0e] cursor-pointer"
                    >
                      <span>{isEn ? "View Details" : "Lihat Detail"}</span>
                      <ChevronRight className="size-3.5 text-[#bc0c11]" />
                    </button>
                  </div>
                </div>

              </div>
            );
            })
          ) : (
            <div className="neu-inset-panel rounded-[24px] p-10 text-center">
              <p className="font-jakarta font-semibold text-base text-[#101828] mb-1">
                {isEn ? "No matching opportunities found" : "Tidak ada lowongan yang sesuai"}
              </p>
              <p className="font-jakarta text-sm text-[#4a5565] mb-4">
                {isEn
                  ? "Try adjusting your search terms or selecting another category filter."
                  : "Coba ubah kata kunci pencarian atau pilih filter kategori lainnya."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
                className="btn-primary !h-10 !min-h-[40px] !px-6 !text-xs sm:!text-sm cursor-pointer"
              >
                <span>{isEn ? "Reset Search" : "Atur Ulang Pencarian"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Expand / View All Opportunities Controls */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2">
          {filteredJobs.length > 4 ? (
            <>
              <button
                type="button"
                onClick={handleToggleViewAll}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white border border-red-200/90 text-sm font-jakarta font-bold text-[#bc0c11] shadow-2xs hover:bg-[#bc0c11] hover:text-white hover:border-[#bc0c11] hover:shadow-md active:scale-[0.98] transition-all duration-200 group cursor-pointer"
              >
                <span>
                  {showAll
                    ? isEn
                      ? "Show Less"
                      : "Tampilkan Lebih Sedikit"
                    : isEn
                    ? `View All Opportunities (${filteredJobs.length} Jobs)`
                    : `Lihat Semua Lowongan (${filteredJobs.length} Lowongan)`}
                </span>
                {showAll ? (
                  <ChevronUp className="size-4.5 transition-transform group-hover:-translate-y-0.5" />
                ) : (
                  <ChevronDown className="size-4.5 transition-transform group-hover:translate-y-0.5" />
                )}
              </button>
              <p className="text-xs font-jakarta text-[#64748b]">
                {isEn
                  ? `Showing ${displayedJobs.length} of ${filteredJobs.length} available opportunities`
                  : `Menampilkan ${displayedJobs.length} dari ${filteredJobs.length} lowongan yang tersedia`}
              </p>
            </>
          ) : (activeFilter !== "all" || searchQuery.trim() !== "") && jobsList.length > filteredJobs.length ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-jakarta text-[#64748b]">
                {isEn
                  ? `Showing ${filteredJobs.length} opportunities for this filter`
                  : `Menampilkan ${filteredJobs.length} lowongan untuk filter ini`}
              </p>
              <button
                type="button"
                onClick={handleResetFiltersAndShowAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-xs sm:text-sm font-jakarta font-bold text-slate-700 hover:border-[#bc0c11] hover:text-[#bc0c11] transition-all shadow-2xs cursor-pointer"
              >
                <RotateCcw className="size-3.5 text-[#bc0c11]" />
                <span>
                  {isEn
                    ? `Show All Opportunities (${jobsList.length} Jobs)`
                    : `Lihat Semua Lowongan (${jobsList.length} Lowongan)`}
                </span>
              </button>
            </div>
          ) : jobsList.length > 0 ? (
            <p className="text-xs font-jakarta text-[#64748b]">
              {isEn
                ? `All ${jobsList.length} available opportunities are displayed`
                : `Semua ${jobsList.length} lowongan terverifikasi telah ditampilkan`}
            </p>
          ) : null}
        </div>

      </div>

      {/* Modal Dialog for Job Details */}
      {selectedJob && (() => {
        const modalJob = getLocalizedPeluangKarier(selectedJob, isEn);
        return (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-job-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="relative w-full max-w-2xl neu-card rounded-[28px] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              aria-label={isEn ? "Close job details" : "Tutup Detail Lowongan"}
              className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Scrollable Modal Content */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 sm:p-8">

            {/* Header Job Info */}
            <div className="flex items-start gap-4 mb-6 pr-8">
              <div className="w-32 h-10 shrink-0 flex items-center">
                <Image
                  src={modalJob.logo}
                  alt={modalJob.company}
                  width={120}
                  height={36}
                  className="object-contain object-left"
                />
              </div>
              <div>
                <h3 id="modal-job-title" className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828]">
                  {modalJob.title}
                </h3>
                <p className="font-jakarta text-sm font-medium text-[#4a5565]">
                  {modalJob.company}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs font-jakarta">
                  <span className="bg-gray-100 text-[#4a5565] px-2.5 py-1 rounded-md font-medium">
                    {modalJob.location}
                  </span>
                  <span className="bg-gray-100 text-[#4a5565] px-2.5 py-1 rounded-md font-medium">
                    {modalJob.type}
                  </span>
                  <span className="bg-red-50 text-[#bc0c11] px-2.5 py-1 rounded-md font-bold">
                    {isEn ? "Major: " : "Jurusan: "}{modalJob.jurusan}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline & Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl neu-inset-panel mb-6 text-xs font-jakarta">
              <div>
                <span className="text-gray-400 block mb-0.5">{isEn ? "Deadline" : "Batas Lamaran"}</span>
                <span className="font-semibold text-[#101828]">{modalJob.deadline}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">{isEn ? "Posted Date" : "Tanggal Terbit"}</span>
                <span className="font-semibold text-[#101828]">{modalJob.postedDate}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-400 block mb-0.5">{isEn ? "Salary Range" : "Kisaran Gaji"}</span>
                <span className="font-semibold text-[#bc0c11]">
                  {modalJob.salaryRange || (isEn ? "Standard / Competitive" : "Sesuai Standar")}
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <h4 className="font-jakarta font-bold text-sm text-[#101828] mb-2 uppercase tracking-wider">
                {isEn ? "Job Description" : "Deskripsi Pekerjaan"}
              </h4>
              <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed">
                {modalJob.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="mb-6">
              <h4 className="font-jakarta font-bold text-sm text-[#101828] mb-2 uppercase tracking-wider">
                {isEn ? "Key Responsibilities" : "Tanggung Jawab Utama"}
              </h4>
              <ul className="space-y-1.5 list-disc list-inside font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed">
                {modalJob.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h4 className="font-jakarta font-bold text-sm text-[#101828] mb-2 uppercase tracking-wider">
                {isEn ? "Qualifications & Requirements" : "Kualifikasi & Persyaratan"}
              </h4>
              <ul className="space-y-1.5 list-disc list-inside font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed">
                {modalJob.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => copyEmail(modalJob.applyEmail)}
                className="btn-secondary w-full sm:w-auto !h-[44px] !px-5 !text-xs sm:!text-sm cursor-pointer"
              >
                <span>
                  {copied
                    ? isEn
                      ? "Email Copied!"
                      : "Email Disalin!"
                    : isEn
                    ? "Copy Company Email"
                    : "Salin Email Perusahaan"}
                </span>
                {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              </button>

              <a
                href={`mailto:${modalJob.applyEmail}?subject=Lamaran%20Posisi%20${encodeURIComponent(modalJob.title)}%20-%20Alumni%20SMK%20Telkom%20Sidoarjo`}
                className="btn-primary w-full sm:w-auto !h-[44px] !px-6 !text-xs sm:!text-sm cursor-pointer"
              >
                <span>{isEn ? "Submit Application / CV" : "Kirim Lamaran / CV"}</span>
                <Send className="size-4" />
              </a>
            </div>

            </div>
          </div>
        </div>
        );
      })()}

    </section>
  );
}
