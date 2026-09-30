"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const MAJOR_OPTIONS = [
  {
    id: "SIJA",
    label: "Sistem Informasi, Jaringan, dan Aplikasi (SIJA - 4 Tahun)",
  },
  {
    id: "TJKT",
    label: "Teknik Komputer & Jaringan (TJKT - 3 Tahun)",
  },
  {
    id: "RPL",
    label: "Rekayasa Perangkat Lunak (RPL)",
  },
];

interface TrialClassRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialClassRegistrationModal({
  isOpen,
  onClose,
}: TrialClassRegistrationModalProps) {
  const { t } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [schoolOrigin, setSchoolOrigin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("SIJA");
  const [isMajorDropdownOpen, setIsMajorDropdownOpen] = useState(false);
  const majorDropdownRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketCode, setTicketCode] = useState("");

  const selectedMajor =
    MAJOR_OPTIONS.find((opt) => opt.id === major) || MAJOR_OPTIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        majorDropdownRef.current &&
        !majorDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMajorDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isMajorDropdownOpen) {
          setIsMajorDropdownOpen(false);
          return;
        }
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isMajorDropdownOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Reset after animation
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !schoolOrigin || !whatsapp) return;

    setIsSubmitting(true);
    // Simulate submission & save to session
    setTimeout(() => {
      const code = "TC-" + Math.floor(100000 + Math.random() * 900000);
      setTicketCode(code);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trial_pass_code", code);
        sessionStorage.setItem("trial_pass_name", fullName);
        sessionStorage.setItem("trial_pass_major", major);
      }
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const handleReset = () => {
    setFullName("");
    setSchoolOrigin("");
    setWhatsapp("");
    setEmail("");
    setMajor("SIJA");
    setIsMajorDropdownOpen(false);
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl p-6 sm:p-8 z-10 my-8 border border-gray-100"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer z-20"
              aria-label="Tutup formulir"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!isSuccess ? (
              <div>
                {/* Header */}
                <div className="mb-6 pr-10 sm:pr-12">
                  <h3 className="font-jakarta text-2xl font-bold text-[#101828] leading-tight">
                    {t("trialClassPage.modalTitle", "Pendaftaran Virtual Trial Class 2026")}
                  </h3>
                  <p className="font-jakarta text-sm text-[#4a5565] mt-2 leading-relaxed">
                    {t(
                      "trialClassPage.modalSubtitle",
                      "Amankan kursi virtual kamu untuk merasakan pengalaman belajar digital di SMK Telkom Sidoarjo."
                    )}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-[#364153] mb-1.5">
                      {t("trialClassPage.fullName", "Nama Lengkap Siswa")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Muhammad Raihan"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
                    />
                  </div>

                  {/* Asal SMP / MTs */}
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-[#364153] mb-1.5">
                      {t("trialClassPage.schoolOrigin", "Asal SMP / MTs")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={schoolOrigin}
                      onChange={(e) => setSchoolOrigin(e.target.value)}
                      placeholder="Contoh: SMP Negeri 1 Sidoarjo"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-[#364153] mb-1.5">
                      {t("trialClassPage.whatsapp", "Nomor WhatsApp (Aktif)")} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-jakarta text-xs font-semibold text-[#364153] mb-1.5">
                      {t("trialClassPage.email", "Alamat Email")}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
                    />
                  </div>

                  {/* Major Choice */}
                  <div className="relative" ref={majorDropdownRef}>
                    <label
                      id="major-dropdown-label"
                      className="block font-jakarta text-xs font-semibold text-[#364153] mb-1.5"
                    >
                      {t("trialClassPage.majorChoice", "Pilihan Peminatan Jurusan")}
                    </label>

                    {/* Custom Trigger Button */}
                    <button
                      type="button"
                      id="major-dropdown-btn"
                      aria-haspopup="listbox"
                      aria-expanded={isMajorDropdownOpen}
                      aria-labelledby="major-dropdown-label"
                      onClick={() => setIsMajorDropdownOpen((prev) => !prev)}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-white text-left flex items-center justify-between transition-all cursor-pointer ${
                        isMajorDropdownOpen
                          ? "border-[#bc0c11] ring-2 ring-[#bc0c11]/15 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                      }`}
                    >
                      <span className="text-[#101828] font-normal text-xs sm:text-sm truncate pr-2">
                        {selectedMajor.label}
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
                          isMajorDropdownOpen ? "rotate-180 text-[#bc0c11]" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Custom Dropdown Menu */}
                    <AnimatePresence>
                      {isMajorDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.99 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.99 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          role="listbox"
                          aria-labelledby="major-dropdown-label"
                          className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 overflow-hidden"
                        >
                          {MAJOR_OPTIONS.map((item) => {
                            const isSelected = major === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                  setMajor(item.id);
                                  setIsMajorDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 sm:py-3 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
                                  isSelected
                                    ? "bg-red-50/70 text-[#bc0c11]"
                                    : "hover:bg-gray-50 text-[#364153]"
                                }`}
                              >
                                <span
                                  className={`text-xs sm:text-sm font-jakarta truncate ${
                                    isSelected
                                      ? "font-semibold text-[#bc0c11]"
                                      : "font-normal text-[#101828] group-hover:text-[#bc0c11] transition-colors"
                                  }`}
                                >
                                  {item.label}
                                </span>
                                {isSelected && (
                                  <svg
                                    width="16"
                                    height="16"
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

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-full bg-[#bc0c11] text-white font-jakarta font-semibold text-sm hover:bg-[#990a0e] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                          <span>{t("trialClassPage.submitting", "Mengirim Pendaftaran...")}</span>
                        </>
                      ) : (
                        <span>{t("trialClassPage.submitRegistration", "Kirim Pendaftaran")}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="font-jakarta text-2xl font-bold text-[#101828]">
                  {t("trialClassPage.successTitle", "Pendaftaran Berhasil!")}
                </h3>
                <p className="font-jakarta text-sm text-[#4a5565] mt-2 max-w-sm mx-auto leading-relaxed">
                  {t(
                    "trialClassPage.successDesc",
                    "Selamat! Data pendaftaran kamu telah kami terima. Detail akses dan Trial Pass akan dikirimkan ke WhatsApp & Email kamu."
                  )}
                </p>

                {/* Ticket Pass Display */}
                <div className="my-6 p-4 rounded-2xl bg-gradient-to-br from-red-50 to-gray-50 border border-red-100 flex flex-col items-center">
                  <span className="font-jakarta text-xs font-semibold text-[#bc0c11] tracking-wider uppercase">
                    {t("trialClassPage.ticketPass", "KODE TRIAL PASS:")}
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#101828] mt-1 tracking-widest">
                    {ticketCode}
                  </span>
                  <span className="font-jakarta text-xs text-gray-500 mt-2">
                    {fullName} - {major}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/trial-class/virtual-class?ticket=${encodeURIComponent(ticketCode)}&name=${encodeURIComponent(fullName)}&major=${encodeURIComponent(major)}`}
                    onClick={handleReset}
                    className="w-full py-3.5 px-6 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white font-jakarta font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.97] cursor-pointer"
                    style={{
                      boxShadow:
                        "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                    }}
                  >
                    <span>{t("trialClassPage.enterVirtualClass", "Masuk ke Virtual Class Sekarang")}</span>
                    <ArrowRight className="size-4.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-jakarta font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    {t("trialClassPage.close", "Tutup")}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
