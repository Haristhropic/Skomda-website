"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TALENTA_SKOMDA_ITEMS, TalentaSkomdaItem } from "@/data/bkkData";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight, X, Send } from "lucide-react";

export default function BkkTalentaSection() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [selectedTalent, setSelectedTalent] = useState<TalentaSkomdaItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedTalent(null);
      }
    };
    if (selectedTalent) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedTalent]);

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-gray-200/60 overflow-hidden scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Red Bar Divider */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <h2 className="font-jakarta font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-[#101828] mb-2">
              {isEn ? "Meet " : "Kenali "}
              <span className="text-[#bc0c11]">
                {isEn ? "SKOMDA Talents" : "Talenta SKOMDA"}
              </span>
            </h2>

            <div className="h-1 w-12 rounded-full bg-[#bc0c11] mb-3" />

            <p className="font-jakarta text-sm sm:text-base text-[#4a5565]">
              {isEn
                ? "Students and alumni with industry-ready competencies prepared to grow with enterprise partners."
                : "Siswa dan alumni dengan kompetensi siap kerja yang dipersiapkan untuk berkembang bersama industri."}
            </p>
          </div>

          <a
            href="#kerjasama-rekrutmen"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-jakarta font-bold text-[#bc0c11] hover:text-[#990a0e] transition-colors group self-start sm:self-auto cursor-pointer"
          >
            <span>{isEn ? "View All Talents" : "Lihat Semua Talenta"}</span>
            <ChevronRight className="size-4 text-[#bc0c11] group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 3 Uniform Talent Cards Grid styled with K3 dashed border */}
        <div dir="ltr" className="flex justify-start overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none">
          {TALENTA_SKOMDA_ITEMS.map((talent) => (
            <div
              key={talent.id}
              className="w-[84vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none bg-white rounded-[24px] border-2 border-dashed border-[#d1d5dc] p-5 sm:p-6 flex flex-row items-center gap-4 sm:gap-5 hover:shadow-md hover:border-[#bc0c11] transition-all duration-300 group h-full justify-between"
            >
              {/* Left: Student Photo */}
              <div className="relative w-24 sm:w-28 h-32 sm:h-36 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                <Image
                  src={talent.avatar}
                  alt={talent.name}
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right: Info & Meta */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                <div>
                  <h3 className="font-jakarta font-bold text-base text-[#101828] truncate group-hover:text-[#bc0c11] transition-colors">
                    {talent.name}
                  </h3>
                  <p className="font-jakarta text-xs sm:text-sm font-semibold text-[#364153] truncate mt-0.5">
                    {talent.role}
                  </p>
                  <p className="font-jakarta text-xs text-gray-500 mt-0.5">
                    {talent.status}
                  </p>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {talent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-gray-50 text-[#4a5565] border border-gray-200/60 text-[11px] font-jakarta font-medium whitespace-nowrap"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-3 border-t border-dashed border-gray-100 mt-2">
                  <button
                    onClick={() => setSelectedTalent(talent)}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-jakarta font-semibold text-[#bc0c11] hover:text-[#990a0e] group/btn cursor-pointer"
                  >
                    <span>{isEn ? "View Profile" : "Lihat Profil"}</span>
                    <ChevronRight className="size-3.5 text-[#bc0c11] group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Talent Profile Modal */}
      {selectedTalent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-talent-name"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setSelectedTalent(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-[28px] border-2 border-dashed border-[#d1d5dc] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTalent(null)}
              aria-label={isEn ? "Close Talent Profile" : "Tutup Profil Talenta"}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Profile Overview */}
            <div className="flex items-center gap-4 mb-6 pr-8">
              <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                <Image
                  src={selectedTalent.avatar}
                  alt={selectedTalent.name}
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h3 id="modal-talent-name" className="font-jakarta font-bold text-xl text-[#101828]">
                  {selectedTalent.name}
                </h3>
                <p className="font-jakarta text-sm font-semibold text-[#bc0c11]">
                  {selectedTalent.role}
                </p>
                <p className="font-jakarta text-xs text-gray-500 mt-0.5">
                  {selectedTalent.status}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-5">
              <h4 className="font-jakarta font-bold text-xs uppercase tracking-wider text-[#101828] mb-1.5">
                {isEn ? "Competency Summary" : "Ringkasan Kompetensi"}
              </h4>
              <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed">
                {selectedTalent.bio}
              </p>
            </div>

            {/* Skills */}
            <div className="mb-5">
              <h4 className="font-jakarta font-bold text-xs uppercase tracking-wider text-[#101828] mb-2">
                {isEn ? "Skills & Technology" : "Keahlian & Teknologi"}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedTalent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-red-50 text-[#bc0c11] border border-red-100 text-xs font-jakarta font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-6">
              <h4 className="font-jakarta font-bold text-xs uppercase tracking-wider text-[#101828] mb-2">
                {isEn ? "Achievements & Certifications" : "Prestasi & Sertifikasi"}
              </h4>
              <ul className="space-y-1.5 list-disc list-inside font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed">
                {selectedTalent.achievements.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Modal Footer CTA */}
            <div className="pt-4 border-t border-dashed border-gray-200 flex flex-col sm:flex-row items-center justify-end gap-3">
              <a
                href={
                  isEn
                    ? "https://wa.me/628113021919?text=Hello%20BKK%20SMK%20Telkom%20Sidoarjo,%20our%20company%20is%20interested%20in%20this%20talent%20profile"
                    : "https://wa.me/628113021919?text=Halo%20BKK%20SMK%20Telkom%20Sidoarjo,%20perusahaan%20kami%20tertarik%20dengan%20profil%20talenta%20ini"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#bc0c11] text-xs sm:text-sm font-jakarta font-medium text-white hover:bg-[#990a0e] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                style={{
                  boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                }}
              >
                <span>{isEn ? "Contact Talent via BKK" : "Hubungi Talenta via BKK"}</span>
                <Send className="size-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
