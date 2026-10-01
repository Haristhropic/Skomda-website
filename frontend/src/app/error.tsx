"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Catat error untuk pemantauan klien
    console.error("[Skomda Application Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-center">
        <div className="size-16 rounded-2xl bg-red-50 text-[#bc0c11] mx-auto flex items-center justify-center mb-5">
          <AlertCircle className="size-8" />
        </div>

        <h2 className="font-jakarta text-xl sm:text-2xl font-bold text-[#101828]">
          Terjadi Gangguan Sementara
        </h2>

        <p className="font-jakarta text-sm text-[#4a5565] mt-2.5 leading-relaxed">
          Mohon maaf, halaman yang Anda akses mengalami kendala pemuatan data. Silakan coba muat ulang halaman ini atau kembali ke beranda.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 h-[48px] rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white font-jakarta font-semibold text-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="size-4" />
            <span>Muat Ulang</span>
          </button>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 h-[48px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-jakarta font-semibold text-sm transition-colors cursor-pointer"
          >
            <Home className="size-4" />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
