"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { registerTrialClass } from "@/services/trialClass";

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
}

export default function TrialClassRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: TrialClassRegistrationModalProps) {
  const { lang, language, t } = useLanguage();
  const isEn = lang === "EN" || language === "en";
  const majorOptions = isEn ? MAJOR_OPTIONS_EN : MAJOR_OPTIONS_ID;

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
      sessionStorage.setItem("trial_pass_name", "Peserta Terdaftar");
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

  const handleReset = () => {
    setFullName("");
    setSchoolOrigin("");
    setWhatsapp("");
    setEmail("");
    setMajor("SIJA");
    setIsMajorDropdownOpen(false);
    setIsSuccess(false);
    setSubmitError("");
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
              aria-label={isEn ? "Close form" : "Tutup formulir"}
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
                      placeholder={isEn ? "e.g., Muhammad Raihan" : "Contoh: Muhammad Raihan"}
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
                      placeholder={isEn ? "e.g., SMP Negeri 1 Sidoarjo" : "Contoh: SMP Negeri 1 Sidoarjo"}
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

                  {submitError && (
                    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </p>
                  )}

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full !h-[48px] cursor-pointer"
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
                  <a
                    href={`https://api.whatsapp.com/send?phone=628113021919&text=${encodeURIComponent(
                      `Halo Panitia PPDB & Trial Class SMK Telkom Sidoarjo,\nSaya telah mendaftar Trial Class:\n- *Kode Tiket*: ${ticketCode}\n- *Nama*: ${fullName}\n- *Asal Sekolah*: ${schoolOrigin}\n- *Pilihan Jurusan*: ${major}\n- *No. WhatsApp*: ${whatsapp}\n\nMohon konfirmasi jadwal dan akses kelas. Terima kasih!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full !h-[48px] rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-jakarta font-semibold text-sm transition-colors shadow-xs cursor-pointer"
                  >
                    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
                    </svg>
                    <span>Konfirmasi ke WhatsApp Panitia</span>
                  </a>

                  <Link
                    href="/trial-class/virtual-class"
                    onClick={handleReset}
                    className="btn-primary w-full !h-[48px] cursor-pointer"
                  >
                    <span>{t("trialClassPage.enterVirtualClass", "Masuk ke Virtual Class Sekarang")}</span>
                    <ArrowRight className="size-4.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-secondary w-full !h-[44px] !text-xs sm:!text-sm cursor-pointer"
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
