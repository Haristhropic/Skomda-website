"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SERVICE_OPTIONS = [
  "Website & Sistem Digital",
  "UI/UX & Desain Digital",
  "Instalasi & Konfigurasi Jaringan",
  "IT Maintenance & Hardware Care",
  "Kebutuhan Kustom / Proyek Lainnya",
];

export default function TefaRequestPageClient() {
  const { lang, language, t } = useLanguage();
  const isEn = lang === "EN" || language === "en";
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("Website & Sistem Digital");
  const [description, setDescription] = useState("");
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const serviceParam = searchParams.get("service") || searchParams.get("layanan");
    if (!serviceParam) return;

    const lower = serviceParam.toLowerCase();
    if (lower.includes("web") || lower.includes("company profile")) {
      setService("Website & Sistem Digital");
    } else if (lower.includes("ui") || lower.includes("desain") || lower.includes("design")) {
      setService("UI/UX & Desain Digital");
    } else if (lower.includes("jaringan") || lower.includes("network")) {
      setService("Instalasi & Konfigurasi Jaringan");
    } else if (lower.includes("maintenance") || lower.includes("it")) {
      setService("IT Maintenance & Hardware Care");
    } else {
      setService("Kebutuhan Kustom / Proyek Lainnya");
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const targetPhone = "628113021919";
    const textMessage = `Halo Tim Teaching Factory SMK Telkom Sidoarjo,
Saya ingin mengajukan request project:

- *Nama*: ${name.trim()}
- *Instansi/Perusahaan*: ${organization.trim() || "-"}
- *Kontak*: ${phone.trim()}
- *Kategori Layanan*: ${service}
- *Keterangan*:
${description.trim() || "Tidak ada keterangan tambahan"}

Mohon informasi ketersediaan jadwal konsultasi dan alur kerja samanya. Terima kasih!`;

    const encoded = encodeURIComponent(textMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setIsSent(true);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#f3f4f6] pt-32 sm:pt-36 lg:pt-40 pb-0">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb matching */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm font-jakarta text-[#4a5565] mb-8"
        >
          <Link href="/tefa" className="hover:text-[#bc0c11] transition-colors">
            TeFa
          </Link>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0 text-[#9ca3af]"
            aria-hidden="true"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Link href="/tefa/produk" className="hover:text-[#bc0c11] transition-colors">
            {isEn ? "Products & Services" : "Produk & Jasa"}
          </Link>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0 text-[#9ca3af]"
            aria-hidden="true"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold text-[#101828]" aria-current="page">
            Request
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start lg:items-stretch">
          {/* Left Column: Heading, Subtitle, Motto & Student Collage (Flush to footer) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-start justify-between h-full"
          >
            <div className="w-full flex flex-col items-start">
              {/* Main Title matching 271:43 */}
              <h1 className="font-jakarta font-bold text-4xl sm:text-5xl lg:text-[52px] leading-[1.12] tracking-tight text-[#101828] mb-6">
                {isEn ? (
                  <>
                    Tell Us <br />
                    About Your <br />
                    <span className="text-[#bc0c11]">Project Needs</span>
                  </>
                ) : (
                  <>
                    Ceritakan <br />
                    Kebutuhan <br />
                    <span className="text-[#bc0c11]">Project Anda</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="font-jakarta text-base sm:text-lg text-[#364153] leading-relaxed mb-6 max-w-lg font-normal">
                {isEn
                  ? "Share your requirements and the Teaching Factory team will review your request before deciding on the next steps. Together, let us build impactful solutions."
                  : "Sampaikan kebutuhan Anda dan tim Teaching Factory akan meninjau request sebelum menentukan langkah selanjutnya. Bersama, kita wujudkan solusi nyata yang berdampak."}
              </p>

              {/* Motto */}
              <div className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828] tracking-tight mb-8">
                {isEn ? "“From ideas, to real creations”" : "“Dari ide, menjadi karya nyata”"}
              </div>
            </div>

            {/* Desktop Student Collage (Flush to footer in the left column) */}
            <div className="hidden lg:flex relative w-full max-w-[500px] h-[620px] items-end justify-start mt-auto mb-0">
              {/* Decorative Concentric Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-4">
                <div className="w-[420px] h-[420px] rounded-full border border-red-200/50" />
                <div className="w-[520px] h-[520px] rounded-full border border-red-200/30 absolute" />
              </div>

              {/* Angled Red Rectangle / Card */}
              <div className="absolute w-[320px] h-[400px] bg-[#bc0c11] rounded-[42px] -rotate-12 shadow-2xl shadow-red-950/25 bottom-0 left-8" />

              {/* Student Cutout Image (rests directly on footer) */}
              <div className="relative z-10 w-[430px] h-[600px] flex items-end">
                <Image
                  src="/images/tefa/request-student-thinking.png"
                  alt="Siswa Teaching Factory SMK Telkom Sidoarjo"
                  fill
                  priority
                  sizes="430px"
                  className="object-contain object-bottom select-none pointer-events-none"
                />
              </div>

              {/* Floating Quote Card - Positioned in the upper right, away from face */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="absolute -right-4 top-20 z-20 bg-white rounded-[24px] p-5 shadow-xl border border-gray-100/90 max-w-[220px]"
              >
                <Quote
                  className="size-5 text-[#bc0c11] fill-[#bc0c11] mb-2 shrink-0"
                  aria-hidden="true"
                />
                <p className="font-jakarta font-bold text-xs text-[#101828] leading-snug">
                  {isEn
                    ? "Great ideas always start with a single request!"
                    : "Ide besar selalu berawal dari satu permintaan, lho!"}
                </p>
                <div className="w-10 h-1 bg-[#bc0c11] rounded-full mt-2.5" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: 3 Students Graphic + Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7 w-full flex flex-col items-center pb-8 sm:pb-12 lg:pb-28"
          >
            {/* Top 3 Students Image from (node 278:407: 3 students in batik looking at tablet) */}
            <div className="relative w-full max-w-[460px] sm:max-w-[500px] h-[260px] sm:h-[320px] -mb-10 sm:-mb-14 z-0 pointer-events-none select-none">
              <Image
                src="/images/tefa/request-students-three.png"
                alt={
                  isEn
                    ? "Teaching Factory Student Team SMK Telkom Sidoarjo"
                    : "Tim Siswa Teaching Factory SMK Telkom Sidoarjo"
                }
                fill
                priority
                sizes="(max-width: 1024px) 460px, 500px"
                className="object-contain object-bottom drop-shadow-md"
              />
            </div>

            {/* Form Card (Form fields and logic preserved intact) */}
            <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] shadow-xl border border-gray-200/80 p-6 sm:p-8 lg:p-10 relative z-10">
              {isSent ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-jakarta font-bold text-2xl text-[#101828] mb-2">
                    {isEn ? "Request Successfully Opened!" : "Request Berhasil Dibuka!"}
                  </h3>
                  <p className="text-[#4a5565] font-jakarta text-sm sm:text-base max-w-md">
                    {isEn
                      ? "Your WhatsApp has opened with formatted consultation details. Please send the message so the TeFa team can respond promptly."
                      : "WhatsApp Anda telah terbuka dengan format data konsultasi. Silakan kirimkan pesan tersebut agar tim TeFa segera merespons."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSent(false)}
                    className="btn-primary mt-6 !h-10 !min-h-[40px] !px-6 !text-sm cursor-pointer"
                  >
                    {isEn ? "Send Another Request" : "Kirim Request Lain"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="border-b border-gray-100 pb-4 mb-1">
                    <h2 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828]">
                      {isEn ? "Project Request Form" : "Formulir Pengajuan Proyek"}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4a5565] font-jakarta mt-1">
                      {isEn
                        ? "Fill in the brief information below to initiate a consultation session."
                        : "Lengkapi data singkat di bawah ini untuk memulai sesi konsultasi."}
                    </p>
                  </div>

                  {/* Nama */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold font-jakarta text-[#101828] mb-1.5">
                      {isEn ? "Full Name" : "Nama Lengkap"} <span className="text-[#bc0c11]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isEn ? "Enter your name" : "Masukkan nama Anda"}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all"
                    />
                  </div>

                  {/* Instansi */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold font-jakarta text-[#101828] mb-1.5">
                      {isEn ? "Institution / Company / School" : "Instansi / Perusahaan / Sekolah"}
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={isEn ? "e.g. PT Digital Works / Individual" : "Contoh: PT Digital Karya / Pribadi"}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all"
                    />
                  </div>

                  {/* Kontak WA */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold font-jakarta text-[#101828] mb-1.5">
                      {isEn ? "WhatsApp / Phone Number" : "Nomor WhatsApp / HP"} <span className="text-[#bc0c11]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all"
                    />
                  </div>

                  {/* Kategori Layanan (Simple & Minimalist Dropdown) */}
                  <div className="relative" ref={dropdownRef}>
                    <label
                      id="service-dropdown-label"
                      className="block text-xs sm:text-sm font-bold font-jakarta text-[#101828] mb-1.5"
                    >
                      {isEn ? "Required Service Category" : "Kategori Layanan yang Dibutuhkan"}
                    </label>

                    {/* Trigger Button */}
                    <button
                      type="button"
                      id="service-dropdown-btn"
                      aria-haspopup="listbox"
                      aria-expanded={isDropdownOpen}
                      aria-labelledby="service-dropdown-label"
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm font-jakarta text-left flex items-center justify-between transition-all cursor-pointer ${
                        isDropdownOpen
                          ? "border-[#bc0c11] ring-1 ring-[#bc0c11]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-[#101828] font-normal truncate">
                        {service}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180 text-[#bc0c11]" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Minimalist Dropdown Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          role="listbox"
                          aria-labelledby="service-dropdown-label"
                          className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-xl border border-gray-200 shadow-lg py-1 overflow-hidden"
                        >
                          {SERVICE_OPTIONS.map((item) => {
                            const isSelected = service === item;
                            return (
                              <button
                                key={item}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                  setService(item);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-sm font-jakarta text-left flex items-center justify-between transition-colors cursor-pointer ${
                                  isSelected
                                    ? "bg-red-50/70 text-[#bc0c11] font-medium"
                                    : "text-[#364153] hover:bg-gray-50 hover:text-[#101828]"
                                }`}
                              >
                                <span>{item}</span>
                                {isSelected && (
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-[#bc0c11] shrink-0"
                                    aria-hidden="true"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Deskripsi Singkat */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold font-jakarta text-[#101828] mb-1.5">
                      {isEn ? "Describe Your Project Requirements" : "Ceritakan Kebutuhan Proyek Anda"}
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        isEn
                          ? "Explain project requirements, system overview, or target timeframe..."
                          : "Jelaskan kebutuhan, gambaran sistem, atau target waktu pengerjaan..."
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all resize-none custom-scrollbar overflow-y-auto"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="btn-primary group w-full !h-[50px] !min-h-[48px] cursor-pointer"
                    >
                      <span className="font-jakarta font-semibold text-[15px] leading-none">
                        {isEn ? "Send Request via WhatsApp" : "Kirim Request via WhatsApp"}
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Mobile Student Collage (Resting flush above the footer at the bottom of the page) */}
        <div className="block lg:hidden w-full flex justify-center mt-6 -mb-1 select-none">
          <div className="relative w-full max-w-[360px] sm:max-w-[440px] h-[400px] sm:h-[480px] flex items-end justify-center">
            {/* Decorative Concentric Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-4">
              <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-red-200/50" />
              <div className="w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full border border-red-200/30 absolute" />
            </div>

            {/* Angled Red Rectangle / Card */}
            <div className="absolute w-[220px] h-[270px] sm:w-[280px] sm:h-[340px] bg-[#bc0c11] rounded-[28px] sm:rounded-[36px] -rotate-12 shadow-2xl shadow-red-950/25 bottom-0 left-4 sm:left-8" />

            {/* Student Cutout Image (rests flush on footer) */}
            <div className="relative z-10 w-[260px] sm:w-[340px] h-[390px] sm:h-[470px] flex items-end">
              <Image
                src="/images/tefa/request-student-thinking.png"
                alt="Siswa Teaching Factory SMK Telkom Sidoarjo"
                fill
                priority
                sizes="(max-width: 640px) 260px, 340px"
                className="object-contain object-bottom select-none pointer-events-none"
              />
            </div>

            {/* Floating Quote Card - Positioned in the upper right away from the face */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="absolute right-0 sm:right-2 top-2 sm:top-8 z-20 bg-white rounded-[18px] sm:rounded-[22px] p-3 sm:p-4 shadow-xl border border-gray-100/90 max-w-[155px] sm:max-w-[185px]"
            >
              <Quote
                className="size-4 text-[#bc0c11] fill-[#bc0c11] mb-1.5 shrink-0"
                aria-hidden="true"
              />
              <p className="font-jakarta font-bold text-[10.5px] sm:text-xs text-[#101828] leading-snug">
                {isEn
                  ? "Great ideas always start with a single request!"
                  : "Ide besar selalu berawal dari satu permintaan, lho!"}
              </p>
              <div className="w-8 h-1 bg-[#bc0c11] rounded-full mt-2" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
