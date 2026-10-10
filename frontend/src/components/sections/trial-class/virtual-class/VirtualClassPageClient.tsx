"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Lock, Ticket, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
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
  const [registerModalTab, setRegisterModalTab] = useState<"register" | "verify">("register");

  // Ticket code manual input for returning registered students
  const [inputTicket, setInputTicket] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Old links may still contain a ticket query. Verify it with the API and ignore
    // legacy name/major query values; new links keep the ticket in session storage.
    const urlTicket = searchParams.get("ticket")?.trim().toUpperCase();
    if (searchParams.size > 0) {
      // Remove legacy ticket and personal-data query values from history/referrers
      // before the verification request starts.
      window.history.replaceState(null, "", window.location.pathname);
    }
    const storedTicket = sessionStorage.getItem("trial_pass_code");
    const candidate = urlTicket || storedTicket;
    if (!candidate) return;

    let active = true;
    setIsVerifying(true);
    setVerifyError("");
    checkTrialClassTicket(candidate)
      .then((res) => {
        if (!active) return;
        if (res.success && res.data) {
          const studentName = res.data.fullName || "Peserta Terdaftar";
          setTicketCode(res.data.ticketCode);
          setUserName(studentName);
          sessionStorage.setItem("trial_pass_code", res.data.ticketCode);
          sessionStorage.setItem("trial_pass_name", studentName);
          sessionStorage.setItem("trial_pass_major", res.data.major);
        } else {
          if (res.error?.includes("Tiket tidak ditemukan")) {
            sessionStorage.removeItem("trial_pass_code");
            sessionStorage.removeItem("trial_pass_name");
            sessionStorage.removeItem("trial_pass_major");
          }
          setVerifyError(res.error || "Gagal memverifikasi tiket. Silakan coba lagi.");
        }
      })
      .finally(() => {
        if (active) setIsVerifying(false);
      });

    return () => {
      active = false;
    };
  }, [searchParams]);

  // Listen to external or modal pass code updates
  useEffect(() => {
    const handlePassUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.ticketCode) {
        setTicketCode(customEvent.detail.ticketCode);
        setUserName(customEvent.detail.fullName || "Peserta Terdaftar");
      } else {
        const storedTicket = sessionStorage.getItem("trial_pass_code");
        const storedName = sessionStorage.getItem("trial_pass_name");
        if (storedTicket) {
          setTicketCode(storedTicket);
          setUserName(storedName || "Peserta Terdaftar");
        }
      }
    };
    window.addEventListener("trial_pass_updated", handlePassUpdate);
    return () => window.removeEventListener("trial_pass_updated", handlePassUpdate);
  }, []);

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
        const studentName = res.data.fullName || "Peserta Terdaftar";
        setTicketCode(res.data.ticketCode);
        setUserName(studentName);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("trial_pass_code", res.data.ticketCode);
          sessionStorage.setItem("trial_pass_name", studentName);
          sessionStorage.setItem("trial_pass_major", res.data.major);
        }
        setInputTicket("");
        setTimeout(() => {
          const target = document.getElementById("pilih-dtp");
          if (target) {
            const topOffset = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: topOffset, behavior: "smooth" });
          }
        }, 100);
      } else {
        setVerifyError(res.error || (isEn
          ? "Ticket code not found. Please register first."
          : "Kode tiket tidak ditemukan. Silakan lakukan pendaftaran terlebih dahulu."));
      }
    } catch {
      setVerifyError("Gagal memverifikasi tiket. Silakan coba lagi.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegistrationSuccess = (newTicket: string, newName: string) => {
    setTicketCode(newTicket);
    setUserName(newName || "Peserta Terdaftar");
    setTimeout(() => {
      const target = document.getElementById("pilih-dtp");
      if (target) {
        const topOffset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: topOffset, behavior: "smooth" });
      }
    }, 150);
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
                  onClick={() => {
                    setRegisterModalTab("register");
                    setIsRegisterModalOpen(true);
                  }}
                  className="btn-primary !h-[48px] !px-6 text-sm font-semibold cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? "Register Trial Class" : "Daftar Baru"}</span>
                  <ArrowRight className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegisterModalTab("verify");
                    setIsRegisterModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 !h-[48px] px-5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-[#101828] text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  <KeyRound className="size-4 text-[#bc0c11]" />
                  <span>{isEn ? "I Have a Pass Code" : "Sudah Punya Kode"}</span>
                </button>

                {/* Inline Ticket Code Input for Returning Students */}
                <form
                  onSubmit={handleVerifyTicket}
                  className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5"
                >
                  <input
                    type="text"
                    value={inputTicket}
                    onChange={(e) => setInputTicket(e.target.value)}
                    placeholder="TC-XXXX-XXXX"
                    className="bg-transparent text-xs font-mono font-bold text-[#101828] placeholder:text-gray-400 placeholder:font-sans focus:outline-none w-36 uppercase"
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

      {/* Registration Modal triggered when student registers or enters pass code */}
      <TrialClassRegistrationModal
        isOpen={isRegisterModalOpen}
        initialTab={registerModalTab}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}
