"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, Copy, Check, KeyRound, UserPlus, AlertCircle, Ticket, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { registerTrialClass, checkTrialClassTicket } from "@/services/trialClass";

const MAJOR_OPTIONS_ID = [
  {
    id: "SIJA",
    label: "Sistem Informasi, Jaringan, dan Aplikasi (SIJA - 4 Tahun)",
  },
  {
    id: "TJAT",
    label: "Teknik Jaringan Akses Telekomunikasi (TJAT - 3 Tahun)",
  },
];

const MAJOR_OPTIONS_EN = [
  {
    id: "SIJA",
    label: "Information Systems, Networks, and Applications (SIJA - 4 Years)",
  },
  {
    id: "TJAT",
    label: "Telecommunication Access Network Engineering (TJAT - 3 Years)",
  },
];

interface TrialClassRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (ticketCode: string, fullName: string, major: string) => void;
  initialTab?: "register" | "verify";
}

export default function TrialClassRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  initialTab = "register",
}: TrialClassRegistrationModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, language, t } = useLanguage();
  const isEn = lang === "EN" || language === "en";
  const majorOptions = isEn ? MAJOR_OPTIONS_EN : MAJOR_OPTIONS_ID;

  const [activeTab, setActiveTab] = useState<"register" | "verify">(initialTab);
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
  const [submitError, setSubmitError] = useState("");

  // States for returning students who already have a pass code
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  const selectedMajor =
    majorOptions.find((opt) => opt.id === major) || majorOptions[0];

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
        setIsCopied(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !schoolOrigin || !whatsapp) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const result = await registerTrialClass({
        fullName,
        schoolOrigin,
        whatsapp,
        email,
        major,
      });
      if (!result.success || !result.data?.ticketCode) {
        setSubmitError(result.error || (isEn
          ? "Registration failed. Please try again."
          : "Pendaftaran gagal. Silakan coba lagi."));
        return;
      }

      const code = result.data.ticketCode;
      setTicketCode(code);
      sessionStorage.setItem("trial_pass_code", code);
      sessionStorage.setItem("trial_pass_name", fullName);
      sessionStorage.setItem("trial_pass_major", major);
      setIsSuccess(true);
      onSuccess?.(code, fullName, major);
    } catch {
      setSubmitError(isEn
        ? "Could not connect to the registration service. Please try again."
        : "Tidak dapat terhubung ke layanan pendaftaran. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle verification for returning students who already have a pass code
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = verifyInput.trim().toUpperCase();
    if (!cleanCode) return;

    setIsVerifying(true);
    setVerifyError("");
    try {
      const res = await checkTrialClassTicket(cleanCode);
      if (res.success && res.data) {
        const studentName = res.data.fullName || "Peserta Terdaftar";
        sessionStorage.setItem("trial_pass_code", res.data.ticketCode);
        sessionStorage.setItem("trial_pass_name", studentName);
        sessionStorage.setItem("trial_pass_major", res.data.major);
        onSuccess?.(res.data.ticketCode, studentName, res.data.major);
        onClose();

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("trial_pass_updated", {
              detail: {
                ticketCode: res.data.ticketCode,
                fullName: studentName,
                major: res.data.major,
              },
            })
          );
        }

        // Navigate to virtual class page if not currently there
        if (pathname !== "/trial-class/virtual-class") {
          router.push("/trial-class/virtual-class");
        } else {
          // If already on virtual class page, scroll smoothly to class list
          const target = document.getElementById("pilih-dtp");
          if (target) {
            const topOffset = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: topOffset, behavior: "smooth" });
          }
        }
      } else {
        setVerifyError(
          res.error ||
            (isEn
              ? "Ticket code not found. Please register first."
              : "Kode Trial Pass tidak ditemukan. Silakan periksa kembali atau daftar baru.")
        );
      }
    } catch {
      setVerifyError(
        isEn
          ? "Failed to verify ticket code. Please try again."
          : "Gagal memverifikasi kode tiket. Silakan coba lagi."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Copy ticket code to clipboard
  const handleCopyTicket = async () => {
    if (!ticketCode) return;
    try {
      await navigator.clipboard.writeText(ticketCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleReset = () => {
    setFullName("");
    setSchoolOrigin("");
    setWhatsapp("");
    setEmail("");
    setMajor("SIJA");
    setIsMajorDropdownOpen(false);
    setIsSuccess(false);
    setIsCopied(false);
    setSubmitError("");
    setVerifyInput("");
    setVerifyError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-y-contain">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Centering / Padded flex container */}
          <div className="flex min-h-full items-center justify-center p-4 py-8 sm:p-6 sm:py-10">
            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md md:max-w-lg bg-white rounded-[24px] sm:rounded-[28px] shadow-2xl z-10 border border-gray-100 flex flex-col max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="px-5 pt-6 pb-3.5 sm:px-7 sm:pt-7 sm:pb-4 border-b border-gray-100 bg-white shrink-0 relative">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-5 right-5 size-8.5 sm:size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer z-10"
                  aria-label={isEn ? "Close form" : "Tutup formulir"}
                >
                  <X className="size-4 sm:size-4.5" />
                </button>

              {!isSuccess ? (
                <div className="pr-9 sm:pr-10">
                  <h3 className="font-jakarta text-lg sm:text-xl font-bold text-[#101828] leading-snug">
                    {activeTab === "register"
                      ? t("trialClassPage.modalTitle", "Pendaftaran Virtual Trial Class 2026")
                      : (isEn ? "Masuk dengan Kode Trial Pass" : "Masuk dengan Kode Trial Pass")}
                  </h3>
                  <p className="font-jakarta text-xs text-[#4a5565] mt-1 leading-relaxed line-clamp-2">
                    {activeTab === "register"
                      ? t(
                          "trialClassPage.modalSubtitle",
                          "Amankan kursi virtual kamu untuk merasakan pengalaman belajar digital di SMK Telkom Sidoarjo."
                        )
                      : (isEn
                          ? "Sudah punya kode tiket? Masukkan untuk langsung mengakses materi Virtual Class."
                          : "Sudah punya kode tiket? Masukkan untuk langsung mengakses materi Virtual Class.")}
                  </p>

                  {/* Segmented Tab Switcher */}
                  <div className="flex items-center p-1 bg-gray-100 rounded-xl mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("register");
                        setSubmitError("");
                        setVerifyError("");
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "register"
                          ? "bg-white text-[#bc0c11] shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <UserPlus className="size-3.5" />
                      <span>{isEn ? "New Registration" : "Daftar Baru"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("verify");
                        setSubmitError("");
                        setVerifyError("");
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "verify"
                          ? "bg-white text-[#bc0c11] shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <KeyRound className="size-3.5" />
                      <span>{isEn ? "Have a Pass Code?" : "Sudah Punya Kode"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pr-9 sm:pr-10">
                  <h3 className="font-jakarta text-lg sm:text-xl font-bold text-[#101828] leading-snug">
                    {t("trialClassPage.successTitle", "Pendaftaran Berhasil!")}
                  </h3>
                  <p className="font-jakarta text-xs text-[#4a5565] mt-0.5 leading-relaxed">
                    Kode Tiket Akses Virtual Class
                  </p>
                </div>
              )}
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7 sm:py-5">
              {!isSuccess ? (
                activeTab === "register" ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-[#364153] mb-1">
                        {t("trialClassPage.fullName", "Nama Lengkap Siswa")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isEn ? "e.g., Muhammad Raihan" : "Contoh: Muhammad Raihan"}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
                      />
                    </div>

                    {/* Asal SMP / MTs */}
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-[#364153] mb-1">
                        {t("trialClassPage.schoolOrigin", "Asal SMP / MTs")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={schoolOrigin}
                        onChange={(e) => setSchoolOrigin(e.target.value)}
                        placeholder={isEn ? "e.g., SMP Negeri 1 Sidoarjo" : "Contoh: SMP Negeri 1 Sidoarjo"}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-[#364153] mb-1">
                        {t("trialClassPage.whatsapp", "Nomor WhatsApp (Aktif)")} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-[#364153] mb-1">
                        {t("trialClassPage.email", "Alamat Email")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-jakarta text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
                      />
                    </div>

                    {/* Major Choice */}
                    <div className="relative" ref={majorDropdownRef}>
                      <label
                        id="major-dropdown-label"
                        className="block font-jakarta text-xs font-semibold text-[#364153] mb-1"
                      >
                        {t("trialClassPage.majorChoice", "Pilihan Peminatan Jurusan")}
                      </label>

                      <button
                        type="button"
                        id="major-dropdown-btn"
                        aria-haspopup="listbox"
                        aria-expanded={isMajorDropdownOpen}
                        aria-labelledby="major-dropdown-label"
                        onClick={() => setIsMajorDropdownOpen((prev) => !prev)}
                        className={`w-full px-3.5 py-2 rounded-xl border bg-white text-left flex items-center justify-between transition-all cursor-pointer ${
                          isMajorDropdownOpen
                            ? "border-[#bc0c11] ring-2 ring-[#bc0c11]/15 shadow-xs"
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

                      <AnimatePresence>
                        {isMajorDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.99 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            role="listbox"
                            aria-labelledby="major-dropdown-label"
                            className="absolute left-0 right-0 top-full mt-1 z-40 bg-white rounded-xl border border-gray-200 shadow-xl py-1 overflow-hidden"
                          >
                            {majorOptions.map((item) => {
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
                                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
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

                    {submitError && (
                      <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs text-red-700">
                        {submitError}
                      </p>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full !h-[44px] sm:!h-[46px] cursor-pointer"
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

                    {/* Quick link to verify tab */}
                    <div className="text-center pt-1 pb-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab("verify")}
                        className="text-xs font-jakarta text-gray-500 hover:text-[#bc0c11] transition-colors cursor-pointer"
                      >
                        {isEn ? "Already have a pass code? Enter here" : "Sudah pernah mendaftar? Masuk dengan Kode Pass"} &rarr;
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Verify Existing Pass Code View */
                  <form onSubmit={handleVerifySubmit} className="space-y-3.5">
                    <div>
                      <label className="block font-jakarta text-xs font-semibold text-[#364153] mb-1">
                        {isEn ? "Ticket / Pass Code" : "Kode Tiket / Pass"} *
                      </label>
                      <input
                        type="text"
                        required
                        value={verifyInput}
                        onChange={(e) => {
                          setVerifyInput(e.target.value.toUpperCase());
                          if (verifyError) setVerifyError("");
                        }}
                        placeholder="Contoh: TC-ABC123XY"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm sm:text-base font-mono uppercase tracking-wider text-[#101828] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
                      />
                      <p className="font-jakarta text-[11px] text-gray-500 mt-1">
                        {isEn
                          ? "Enter the code generated when you registered previously."
                          : "Masukkan kode unik yang Anda terima setelah mendaftar Trial Class."}
                      </p>
                    </div>

                    {verifyError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                      >
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <span>{verifyError}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isVerifying || !verifyInput.trim()}
                        className="btn-primary w-full !h-[44px] sm:!h-[46px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isVerifying ? (
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
                            <span>{isEn ? "Verifying..." : "Memverifikasi..."}</span>
                          </>
                        ) : (
                          <>
                            <KeyRound className="size-4" />
                            <span>{isEn ? "Verify & Enter Class" : "Verifikasi & Masuk Kelas"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-center pt-1 pb-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab("register")}
                        className="text-xs font-jakarta text-gray-500 hover:text-[#bc0c11] transition-colors cursor-pointer"
                      >
                        {isEn ? "Don't have a code yet? Register here" : "Belum punya kode tiket? Daftar di sini"} &rarr;
                      </button>
                    </div>
                  </form>
                )
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-2"
                >
                  <div className="size-12 rounded-full bg-green-50 text-green-600 mx-auto flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] max-w-sm mx-auto leading-relaxed">
                    {t(
                      "trialClassPage.successDesc",
                      "Selamat! Data pendaftaran kamu telah kami terima. Simpan kode Trial Pass di bawah ini untuk mengakses Virtual Class kapan saja."
                    )}
                  </p>

                  {/* Ticket Pass Display with Copy Button */}
                  <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-red-50 to-gray-50 border border-red-100 flex flex-col items-center">
                    <span className="font-jakarta text-[11px] font-semibold text-[#bc0c11] tracking-wider uppercase">
                      {t("trialClassPage.ticketPass", "KODE TRIAL PASS:")}
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[#101828] mt-1 tracking-widest selection:bg-red-200">
                      {ticketCode}
                    </span>
                    <span className="font-jakarta text-xs text-gray-500 mt-1 mb-2.5">
                      {fullName} - {major}
                    </span>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={handleCopyTicket}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                        isCopied
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3.5" />
                          <span>{isEn ? "Code Copied!" : "Kode Berhasil Disalin!"}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>{isEn ? "Copy Pass Code" : "Salin Kode Pass"}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-1">
                    <Link
                      href="/trial-class/virtual-class"
                      onClick={handleReset}
                      className="btn-primary w-full !h-[44px] cursor-pointer"
                    >
                      <span>{t("trialClassPage.enterVirtualClass", "Masuk ke Virtual Class Sekarang")}</span>
                      <ArrowRight className="size-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-secondary w-full !h-[40px] !text-xs cursor-pointer"
                    >
                      {t("trialClassPage.close", "Tutup")}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      )}
    </AnimatePresence>
  );
}
