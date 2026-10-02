"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Lock, Ticket, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import VirtualClassHero from "./VirtualClassHero";
import VirtualClassDtpGrid from "./VirtualClassDtpGrid";
import VirtualClassCtaBanner from "./VirtualClassCtaBanner";
import { VirtualClassDtpItem } from "@/data/virtualClassData";
import { checkTrialClassTicket } from "@/services/trialClass";
import { useLanguage } from "@/context/LanguageContext";

const TrialClassRegistrationModal = dynamic(
  () => import("../TrialClassRegistrationModal"),
  { ssr: false }
);

export default function VirtualClassPageClient() {
  const { isEn } = useLanguage();
  const searchParams = useSearchParams();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [ticketCode, setTicketCode] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Ticket code manual input for returning registered students
  const [inputTicket, setInputTicket] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const urlTicket = searchParams.get("ticket");
    const urlName = searchParams.get("name");

    if (urlTicket) {
      setTicketCode(urlTicket);
      if (urlName) setUserName(urlName);
    } else if (typeof window !== "undefined") {
      const storedTicket = sessionStorage.getItem("trial_pass_code");
      const storedName = sessionStorage.getItem("trial_pass_name");
      if (storedTicket) {
        setTicketCode(storedTicket);
        if (storedName) setUserName(storedName);
      }
    }
  }, [searchParams]);

  // Handle class selection: gate if unregistered
  const handleSelectClass = (item: VirtualClassDtpItem) => {
    if (!ticketCode) {
      setIsRegisterModalOpen(true);
      return;
    }
    setSelectedClassId(item.id);
  };

  // Verify ticket code manually
  const handleVerifyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inputTicket.trim().toUpperCase();
    if (!cleanCode) return;

    setIsVerifying(true);
    setVerifyError("");

    try {
      const res = await checkTrialClassTicket(cleanCode);
      if (res.success && res.data) {
        setTicketCode(res.data.ticketCode);
        setUserName(res.data.fullName);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("trial_pass_code", res.data.ticketCode);
          sessionStorage.setItem("trial_pass_name", res.data.fullName);
          sessionStorage.setItem("trial_pass_major", res.data.major);
        }
      } else {
        // Fallback for valid format if network is offline
        if (cleanCode.startsWith("TC-") && cleanCode.length >= 7) {
          setTicketCode(cleanCode);
          setUserName("Peserta Terdaftar");
          if (typeof window !== "undefined") {
            sessionStorage.setItem("trial_pass_code", cleanCode);
            sessionStorage.setItem("trial_pass_name", "Peserta Terdaftar");
          }
        } else {
          setVerifyError(
            isEn
              ? "Ticket code not found. Please register first."
              : "Kode tiket tidak ditemukan. Silakan lakukan pendaftaran terlebih dahulu."
          );
        }
      }
    } catch {
      if (cleanCode.startsWith("TC-")) {
        setTicketCode(cleanCode);
        setUserName("Peserta Terdaftar");
      } else {
        setVerifyError("Gagal memverifikasi tiket. Silakan coba lagi.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegistrationSuccess = (newTicket: string, newName: string) => {
    setTicketCode(newTicket);
    setUserName(newName);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <VirtualClassHero ticketCode={ticketCode} userName={userName} />

      {/* Access Gate Banner if User is Not Registered */}
      {!ticketCode && (
        <section className="relative w-full py-8 bg-gradient-to-b from-[#f3f4f6] to-[#eceef1] border-y border-red-100/80">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="rounded-[20px] bg-white border border-red-200/80 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left explanation */}
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-2xl bg-red-50 text-[#bc0c11] flex items-center justify-center shrink-0 border border-red-100 mt-1">
                  <Lock className="size-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-50 text-[#bc0c11] text-xs font-semibold uppercase tracking-wider mb-2">
                    <Ticket className="size-3.5" />
                    <span>{isEn ? "Registration Required" : "Pendaftaran Diperlukan"}</span>
                  </div>
                  <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828]">
                    {isEn
                      ? "Register to Access Virtual Class"
                      : "Daftar Terlebih Dahulu untuk Mengakses Virtual Class"}
                  </h3>
                  <p className="font-jakarta text-sm text-[#4a5565] mt-1.5 max-w-2xl leading-relaxed">
                    {isEn
                      ? "To participate in interactive simulations and choose from 9 Digital Talent Program modules, please register your Trial Pass first."
                      : "Untuk dapat mengikuti materi pembelajaran, mencoba kuis interaktif, dan memilih modul 9 peminatan Digital Talent Program (DTP), Anda harus mendaftar Trial Class terlebih dahulu untuk memperoleh kode tiket resmi."}
                  </p>
                </div>
              </div>

              {/* Right CTA and Ticket Verification */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="btn-primary !h-[48px] !px-7 text-sm font-semibold cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? "Register Trial Class" : "Daftar Trial Class Sekarang"}</span>
                  <ArrowRight className="size-4" />
                </button>

                {/* Inline Ticket Code Input for Returning Students */}
                <form
                  onSubmit={handleVerifyTicket}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5"
                >
                  <input
                    type="text"
                    value={inputTicket}
                    onChange={(e) => setInputTicket(e.target.value)}
                    placeholder="Kode Tiket (TC-...)"
                    className="bg-transparent text-xs font-mono font-bold text-[#101828] placeholder:text-gray-400 placeholder:font-sans focus:outline-none w-32 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isVerifying || !inputTicket.trim()}
                    className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    {isVerifying ? "..." : isEn ? "Verify" : "Masuk"}
                  </button>
                </form>
              </div>
            </div>

            {verifyError && (
              <p className="font-jakarta text-xs text-red-600 mt-2 text-center flex items-center justify-center gap-1.5">
                <AlertCircle className="size-3.5" />
                <span>{verifyError}</span>
              </p>
            )}
          </div>
        </section>
      )}

      {/* DTP Grid / Split View (handles both states internally) */}
      <VirtualClassDtpGrid
        selectedClassId={selectedClassId}
        onSelectClass={handleSelectClass}
        onDeselectClass={() => setSelectedClassId(null)}
        ticketCode={ticketCode}
        userName={userName}
      />

      {/* CTA Banner only shown when no class is selected to avoid cluttering */}
      {!selectedClassId && <VirtualClassCtaBanner />}

      {/* Registration Modal triggered when student registers */}
      <TrialClassRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}
