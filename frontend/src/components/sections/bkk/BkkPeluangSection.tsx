"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { PELUANG_KARIER_ITEMS, PeluangKarierItem } from "@/data/bkkData";
import { getBKKJobs } from "@/services/bkk";
import { useLanguage } from "@/context/LanguageContext";
import { Search, MapPin, Briefcase, ChevronRight, X, Copy, Check, Send } from "lucide-react";

export default function BkkPeluangSection() {
  const { isEn } = useLanguage();

  const [jobsList, setJobsList] = useState<PeluangKarierItem[]>(PELUANG_KARIER_ITEMS);
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<PeluangKarierItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getBKKJobs("active")
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setJobsList(
            data.map((j) => {
              // find matching item in PELUANG_KARIER_ITEMS if any for rich details
              const existing = PELUANG_KARIER_ITEMS.find((e) => e.title.toLowerCase() === j.title.toLowerCase() || e.company.toLowerCase() === j.company.toLowerCase());
              return {
                id: String(j.id),
                title: j.title,
                company: j.company,
                logo: j.companyLogo || existing?.logo || "/images/partners/logo-telkom-indonesia.jpg",
                location: j.location,
                type: (j.jobType === "Internship" ? "Internship" : "Full Time") as any,
                jurusan: existing?.jurusan || "SIJA & TJAT",
                postedDate: existing?.postedDate || "September 2026",
                deadline: j.deadline || "Segera",
                salaryRange: j.salary || existing?.salaryRange,
                description: j.description || existing?.description || "",
                responsibilities: existing?.responsibilities || [],
                requirements: existing?.requirements || (j.requirements ? j.requirements.split(".").map(s => s.trim()).filter(Boolean) : []),
                applyEmail: existing?.applyEmail || (j.applyUrl ? j.applyUrl.replace("mailto:", "") : "karir@smktelkom-sda.sch.id"),
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

  const filterOptions = isEn
    ? ["All", "SIJA", "TJAT", "Internship", "Full Time"]
    : ["Semua", "SIJA", "TJAT", "Internship", "Full Time"];

  // Filter jobs based on active category & search query
  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (activeFilter === "Semua" || activeFilter === "All") return true;
      if (activeFilter === "SIJA") return job.jurusan.includes("SIJA");
      if (activeFilter === "TJAT") return job.jurusan.includes("TJAT");
      if (activeFilter === "Internship") return job.type === "Internship";
      if (activeFilter === "Full Time") return job.type === "Full Time";

      return true;
    });
  }, [activeFilter, searchQuery]);

  // Displayed jobs: show top 4 when not expanded and no active search/filter
  const displayedJobs = useMemo(() => {
    const isFiltered =
      (activeFilter !== "Semua" && activeFilter !== "All") || searchQuery.trim() !== "";
    if (isFiltered || showAll) {
      return filteredJobs;
    }
    return filteredJobs.slice(0, 4);
  }, [filteredJobs, activeFilter, searchQuery, showAll]);

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
    const isFiltered =
      (activeFilter !== "Semua" && activeFilter !== "All") || searchQuery.trim() !== "";
    if (isFiltered) {
      setActiveFilter(isEn ? "All" : "Semua");
      setSearchQuery("");
      setShowAll(true);
    } else {
      setShowAll((prev) => !prev);
    }
    const el = document.getElementById("peluang-karier");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="peluang-karier" className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#f9fafb] border-t border-gray-200/60 overflow-hidden scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
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

          <div className="h-1 w-12 rounded-full bg-[#bc0c11] mb-3" />

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

          {/* Category Filter Pills - Full-bleed horizontal slide on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none overscroll-x-contain">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? "bg-[#bc0c11] text-white shadow-xs"
                      : "bg-white text-[#4a5565] border border-gray-200/90 hover:border-[#bc0c11] hover:text-[#bc0c11]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Opportunity Cards List */}
        <div className="flex flex-col gap-4 mb-8">
          {displayedJobs.length > 0 ? (
            displayedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-[24px] border-2 border-dashed border-[#d1d5dc] px-5 sm:px-7 py-5 sm:py-6 hover:shadow-md hover:border-[#bc0c11] transition-all duration-300 group"
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

                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-dashed border-gray-200 gap-2">
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
            ))
          ) : (
            <div className="bg-white rounded-[24px] p-10 text-center border-2 border-dashed border-[#d1d5dc]">
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
                  setActiveFilter(isEn ? "All" : "Semua");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer shadow-xs"
              >
                <span>{isEn ? "Reset Search" : "Atur Ulang Pencarian"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Expand / View All Opportunities Link */}
        <div className="flex justify-center">
          <button
            onClick={handleToggleViewAll}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-dashed border-[#bc0c11]/50 text-sm font-jakarta font-bold text-[#bc0c11] hover:border-[#bc0c11] hover:bg-red-50/60 transition-all group cursor-pointer shadow-xs"
          >
            <span>
              {!showAll ||
              (activeFilter !== "Semua" && activeFilter !== "All") ||
              searchQuery.trim() !== ""
                ? isEn
                  ? `View All Opportunities (${PELUANG_KARIER_ITEMS.length})`
                  : `Lihat Semua Peluang (${PELUANG_KARIER_ITEMS.length} Lowongan)`
                : isEn
                ? "Show Less"
                : "Tampilkan Lebih Sedikit"}
            </span>
            <ChevronRight
              className={`size-4 text-[#bc0c11] transition-transform ${
                showAll &&
                searchQuery.trim() === "" &&
                (activeFilter === "Semua" || activeFilter === "All")
                  ? "-rotate-90"
                  : "rotate-90"
              }`}
            />
          </button>
        </div>

      </div>

      {/* Modal Dialog for Job Details */}
      {selectedJob && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-job-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-[28px] border border-gray-200/90 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              aria-label="Tutup Detail Lowongan"
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
                  src={selectedJob.logo}
                  alt={selectedJob.company}
                  width={120}
                  height={36}
                  className="object-contain object-left"
                />
              </div>
              <div>
                <h3 id="modal-job-title" className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828]">
                  {selectedJob.title}
                </h3>
                <p className="font-jakarta text-sm font-medium text-[#4a5565]">
                  {selectedJob.company}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs font-jakarta">
                  <span className="bg-gray-100 text-[#4a5565] px-2.5 py-1 rounded-md font-medium">
                    {selectedJob.location}
                  </span>
                  <span className="bg-gray-100 text-[#4a5565] px-2.5 py-1 rounded-md font-medium">
                    {selectedJob.type}
                  </span>
                  <span className="bg-red-50 text-[#bc0c11] px-2.5 py-1 rounded-md font-bold">
                    {isEn ? "Major: " : "Jurusan: "}{selectedJob.jurusan}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline & Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#f9fafb] border-2 border-dashed border-[#d1d5dc] mb-6 text-xs font-jakarta">
              <div>
                <span className="text-gray-400 block mb-0.5">{isEn ? "Deadline" : "Batas Lamaran"}</span>
                <span className="font-semibold text-[#101828]">{selectedJob.deadline}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">{isEn ? "Posted Date" : "Tanggal Terbit"}</span>
                <span className="font-semibold text-[#101828]">{selectedJob.postedDate}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-400 block mb-0.5">{isEn ? "Salary Range" : "Kisaran Gaji"}</span>
                <span className="font-semibold text-[#bc0c11]">
                  {selectedJob.salaryRange || (isEn ? "Standard / Competitive" : "Sesuai Standar")}
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <h4 className="font-jakarta font-bold text-sm text-[#101828] mb-2 uppercase tracking-wider">
                {isEn ? "Job Description" : "Deskripsi Pekerjaan"}
              </h4>
              <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="mb-6">
              <h4 className="font-jakarta font-bold text-sm text-[#101828] mb-2 uppercase tracking-wider">
                {isEn ? "Key Responsibilities" : "Tanggung Jawab Utama"}
              </h4>
              <ul className="space-y-1.5 list-disc list-inside font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed">
                {selectedJob.responsibilities.map((resp, idx) => (
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
                {selectedJob.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-dashed border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => copyEmail(selectedJob.applyEmail)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-xs sm:text-sm font-jakarta font-semibold text-[#4a5565] hover:border-[#bc0c11] hover:text-[#bc0c11] transition-colors cursor-pointer"
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
                href={`mailto:${selectedJob.applyEmail}?subject=Lamaran%20Posisi%20${encodeURIComponent(selectedJob.title)}%20-%20Alumni%20SMK%20Telkom%20Sidoarjo`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#bc0c11] text-xs sm:text-sm font-jakarta font-bold text-white hover:bg-[#990a0e] transition-colors shadow-sm cursor-pointer"
              >
                <span>{isEn ? "Submit Application / CV" : "Kirim Lamaran / CV"}</span>
                <Send className="size-4" />
              </a>
            </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
