"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { submitPublicBKKJob } from "@/services/bkk";
import {
  Handshake,
  X,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  ChevronDown,
  Building2,
  User,
  Mail,
  Briefcase,
  Layers,
  FileText,
  Loader2,
  Calendar,
} from "lucide-react";

export default function BkkKerjasamaSection() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    emailOrWa: "",
    positionTitle: "",
    jobType: "Full Time",
    jurusanNeeded: "SIJA & TJAT",
    deadline: "",
    notes: "",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };
    if (modalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.positionTitle.trim()) {
      setErrorMessage(
        isEn
          ? "Company Name and Position Title are required."
          : "Nama Perusahaan dan Posisi yang dibuka wajib diisi."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await submitPublicBKKJob({
      title: formData.positionTitle.trim(),
      company: formData.companyName.trim(),
      contactPerson: formData.contactPerson.trim(),
      emailOrWa: formData.emailOrWa.trim(),
      jobType: formData.jobType,
      jurusan: formData.jurusanNeeded,
      deadline: formData.deadline || "Segera",
      requirements: `Jurusan yang dibutuhkan: ${formData.jurusanNeeded}. ${formData.notes || ""}`.trim(),
      description: `Kualifikasi / Catatan Tambahan: ${formData.notes || "-"}\nNarahubung: ${formData.contactPerson} (${formData.emailOrWa})`,
      status: "pending",
      source: "mitra",
    });

    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setModalOpen(false);
        setFormData({
          companyName: "",
          contactPerson: "",
          emailOrWa: "",
          positionTitle: "",
          jobType: "Full Time",
          jurusanNeeded: "SIJA & TJAT",
          deadline: "",
          notes: "",
        });
      }, 3500);
    } else {
      setErrorMessage(
        res.error ||
          (isEn
            ? "Failed to submit vacancy. Please try again later."
            : "Gagal mengirim pengajuan lowongan. Silakan coba beberapa saat lagi.")
      );
    }
  };

  return (
    <section id="kerjasama-rekrutmen" className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#f9fafb] border-t border-gray-200/60 overflow-hidden scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        {/* Main Box with Neumorphic Card Styling */}
        <div className="relative rounded-[32px] neu-card p-8 sm:p-12 lg:p-14 overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 z-10">
              {/* Title */}
              <h2 className="font-jakarta font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-[#101828] mb-3">
                {isEn ? "Partner with " : "Bekerja Sama dengan "}
                <span className="text-[#bc0c11]">SKOMDA</span>
              </h2>

              <div className="section-title-line !mx-0" />

              {/* Description */}
              <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed max-w-xl mb-8">
                {isEn
                  ? "BKK SMK Telkom Sidoarjo opens opportunities for companies to connect directly with highly competent students and alumni tailored to industry needs."
                  : "BKK SMK Telkom Sidoarjo membuka kesempatan bagi perusahaan untuk terhubung langsung dengan talenta vokasi terbaik sesuai kebutuhan rekrutmen industri."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-primary group !px-7 !h-[50px] !min-h-[48px] cursor-pointer"
                >
                  <span>{isEn ? "Post a Job" : "Pasang Lowongan"}</span>
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <a
                  href={
                    isEn
                      ? "https://wa.me/628113021919?text=Hello%20BKK%20SMK%20Telkom%20Sidoarjo,%20we%20would%20like%20to%20collaborate%20for%20talent%20recruitment"
                      : "https://wa.me/628113021919?text=Halo%20BKK%20SMK%20Telkom%20Sidoarjo,%20kami%20ingin%20berkolaborasi%20untuk%20kebutuhan%20rekrutmen%20talenta"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline group !px-7 !h-[50px] !min-h-[48px] cursor-pointer"
                >
                  <MessageSquare className="size-4" />
                  <span>{isEn ? "Contact BKK" : "Hubungi BKK"}</span>
                </a>
              </div>
            </div>

            {/* Right Tagline Box with Unboxed Icon & Clean Quotes */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center text-center lg:text-right">
              <div className="relative p-6 sm:p-8 rounded-[24px] neu-inset-panel max-w-sm">
                <Handshake className="size-9 text-[#bc0c11] mb-3 mx-auto lg:ml-auto lg:mr-0" />
                <p className="font-jakarta italic text-base sm:text-lg font-semibold text-[#101828] leading-snug mb-3">
                  {isEn
                    ? "\u201CCollaborating for the Future of Indonesian Talents\u201D"
                    : "\u201CKolaborasi untuk Masa Depan Talenta Indonesia\u201D"}
                </p>
                <span className="font-jakarta text-xs font-bold text-[#bc0c11] tracking-wide uppercase">
                  {isEn ? "SKOMDA Career Center (BKK)" : "Bursa Kerja Khusus SKOMDA"}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Recruiter Job Posting Submission Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-recruiter-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-[28px] border border-gray-200/90 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              aria-label={isEn ? "Close Job Form" : "Tutup Form Lowongan"}
              className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Scrollable Modal Content */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 sm:p-8">
              {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="size-14 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-jakarta font-bold text-xl text-[#101828] mb-2">
                  {isEn ? "Request Successfully Sent!" : "Permintaan Berhasil Terkirim!"}
                </h3>
                <p className="font-jakarta text-sm text-[#4a5565]">
                  {isEn
                    ? "The BKK SMK Telkom Sidoarjo team will contact your company shortly for verification and vacancy publication."
                    : "Tim BKK SMK Telkom Sidoarjo akan segera menghubungi perusahaan Anda untuk proses verifikasi dan publikasi lowongan."}
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-jakarta font-bold uppercase tracking-wider text-[#bc0c11] block mb-1">
                    {isEn ? "Recruitment Partnership" : "Kemitraan Rekrutmen"}
                  </span>
                  <h3 id="modal-recruiter-title" className="font-jakarta font-bold text-xl text-[#101828]">
                    {isEn ? "Post Job / Internship Vacancy" : "Pasang Lowongan Kerja / Magang"}
                  </h3>
                  <div className="h-1 w-10 rounded-full bg-[#bc0c11] my-2" />
                  <p className="font-jakarta text-xs text-gray-500 mt-1">
                    {isEn
                      ? "Please fill in your company recruitment requirements to be shared with SKOMDA students and alumni."
                      : "Silakan isi data kebutuhan rekrutmen perusahaan Anda untuk dipublikasikan ke siswa dan alumni SKOMDA."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 font-jakarta text-xs sm:text-sm">
                  <div>
                    <label className="flex items-center gap-1.5 font-semibold text-[#101828] mb-1.5">
                      <Building2 className="size-4 text-[#bc0c11]" />
                      <span>{isEn ? "Company / Institution Name *" : "Nama Perusahaan / Institusi *"}</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={isEn ? "e.g. PT Teknologi Inovasi Bersama" : "Contoh: PT Teknologi Inovasi Bersama"}
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[#101828] placeholder-gray-400 focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all hover:border-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 font-semibold text-[#101828] mb-1.5">
                        <User className="size-4 text-[#bc0c11]" />
                        <span>{isEn ? "PIC / HR Name *" : "Nama PIC / HR *"}</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={isEn ? "Contact person name" : "Nama narahubung"}
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[#101828] placeholder-gray-400 focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all hover:border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 font-semibold text-[#101828] mb-1.5">
                        <Mail className="size-4 text-[#bc0c11]" />
                        <span>{isEn ? "WhatsApp No. / Email *" : "No. WhatsApp / Email *"}</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="0812... / hr@perusahaan.com"
                        value={formData.emailOrWa}
                        onChange={(e) => setFormData({ ...formData, emailOrWa: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[#101828] placeholder-gray-400 focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all hover:border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 font-semibold text-[#101828] mb-1.5">
                        <Briefcase className="size-4 text-[#bc0c11]" />
                        <span>{isEn ? "Open Position *" : "Posisi yang Dibuka *"}</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={isEn ? "e.g. Network Technician" : "Contoh: Network Technician"}
                        value={formData.positionTitle}
                        onChange={(e) => setFormData({ ...formData, positionTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[#101828] placeholder-gray-400 focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all hover:border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 font-semibold text-[#101828] mb-1.5">
                        <Layers className="size-4 text-[#bc0c11]" />
                        <span>{isEn ? "Job Type" : "Tipe Pekerjaan"}</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.jobType}
                          onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                          className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white text-[#101828] focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all cursor-pointer hover:border-gray-300"
                        >
                          <option value="Full Time">Full Time</option>
                          <option value="Internship">{isEn ? "Internship" : "Internship / Magang"}</option>
                          <option value="Contract">{isEn ? "Project Contract" : "Kontrak Proyek"}</option>
                        </select>
                        <ChevronDown className="size-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 font-semibold text-[#101828] mb-1.5">
                        <Layers className="size-4 text-[#bc0c11]" />
                        <span>{isEn ? "Target Major" : "Jurusan yang Dibutuhkan"}</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.jurusanNeeded}
                          onChange={(e) => setFormData({ ...formData, jurusanNeeded: e.target.value })}
                          className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white text-[#101828] focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all cursor-pointer hover:border-gray-300"
                        >
                          <option value="SIJA & TJAT">{isEn ? "Both (SIJA & TJAT)" : "Keduanya (SIJA & TJAT)"}</option>
                          <option value="SIJA">SIJA ({isEn ? "Information Systems, Networks, and Applications" : "Sistem Informasi Jaringan & Aplikasi"})</option>
                          <option value="TJAT">TJAT ({isEn ? "Telecommunications Access Network Engineering" : "Teknik Jaringan Akses Telekomunikasi"})</option>
                          <option value="Semua Jurusan">{isEn ? "All Majors" : "Semua Jurusan"}</option>
                        </select>
                        <ChevronDown className="size-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 font-semibold text-[#101828] mb-1.5">
                        <Calendar className="size-4 text-[#bc0c11]" />
                        <span>{isEn ? "Application Deadline" : "Batas Pendaftaran"}</span>
                      </label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-[#101828] focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all hover:border-gray-300 cursor-pointer text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 font-semibold text-[#101828] mb-1.5">
                      <FileText className="size-4 text-[#bc0c11]" />
                      <span>{isEn ? "Brief Qualifications / Notes" : "Kualifikasi Ringkas / Catatan"}</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder={
                        isEn
                          ? "Describe key requirements or provide vacancy document links..."
                          : "Tuliskan kualifikasi utama atau tautan dokumen lowongan..."
                      }
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-[#101828] placeholder-gray-400 focus:outline-none focus:border-[#bc0c11] focus:ring-1 focus:ring-[#bc0c11] transition-all hover:border-gray-300 custom-scrollbar"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary group w-full !h-[48px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin shrink-0" />
                          <span>{isEn ? "Submitting..." : "Mengirim Permohonan..."}</span>
                        </>
                      ) : (
                        <>
                          <span>{isEn ? "Submit Vacancy Details" : "Kirim Kebutuhan Lowongan"}</span>
                          <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
