"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  X,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import PageHeroSection from "@/components/sections/common/PageHeroSection";
import {
  DTP_SPECIALIZATIONS,
  DTP_COLLABORATION_PROJECTS,
  DTP_WEEKLY_SCHEDULE,
  DtpSpecialization,
} from "@/data/dtpData";
import DtpSpecializationCard from "./DtpSpecializationCard";
import DtpDetailModal from "./DtpDetailModal";

export default function DigitalTalentClient() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSpec, setSelectedSpec] = useState<DtpSpecialization | null>(null);

  // Search filter across 9 specializations
  const filteredSpecs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return DTP_SPECIALIZATIONS;
    return DTP_SPECIALIZATIONS.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.coreSkills.some((s) => s.toLowerCase().includes(q)) ||
        item.tools.some((tool) => tool.toLowerCase().includes(q)) ||
        item.careerProspects.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  return (
    <>
      {/* ─── 1. Hero Section ─── */}
      <PageHeroSection
        breadcrumbs={[
          { label: t("nav.programs", "Program"), href: "/program/profil-jurusan" },
          { label: "Digital Talent Program", href: "/program/digital-talent" },
        ]}
        titlePrefix="Digital"
        titleHighlight="Talent"
        titleSuffix="Program"
        titleHighlightColor="text-[#e7000b]"
        showAccentBar={true}
        description="Digital Talent Program merupakan inisiatif unggulan SMK Telkom Sidoarjo untuk membekali siswa dengan keahlian teknologi masa depan melalui model pembelajaran khusus setiap pekan. Siswa mendalami salah satu dari sembilan bidang spesialisasi digital, mengerjakan studi kasus nyata, dan membangun portofolio profesional yang siap bersaing di industri global."
        studentImage="/images/program/digital-talent/hero-student-digital-talent.png"
        studentAlt="Digital Talent Program SMK Telkom Sidoarjo"
        ctaText="Jelajahi"
        ctaHref="#spesialisasi-dtp"
        imagePosition="right"
        isIntegratedArtwork={true}
        imageContainerClassName="w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[520px] aspect-[1326/1186]"
        imageClassName="drop-shadow-xl"
      />

      {/* ─── 2. Background & Weekly Learning Model ─── */}
      <section className="py-16 sm:py-24 bg-[#f8f9fb]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <h2 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-4xl text-[#101828] mb-4">
              Dunia Kerja 100% Berubah
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-[#bc0c11] mb-4" />
            <p className="font-jakarta text-base text-[#4a5565] leading-relaxed">
              Dahulu lulusan hanya berfokus mencari kerja. Sekarang, industri membutuhkan kombinasi nyata:{" "}
              <strong className="text-[#101828]">Skill, Portfolio, Experience, dan Attitude</strong>.
            </p>
          </div>

          {/* Model Pembelajaran 2 Hari (Rabu & Kamis) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {DTP_WEEKLY_SCHEDULE.map((sched, idx) => (
              <motion.div
                key={sched.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="rounded-[24px] bg-white p-6 sm:p-8 border-2 border-dashed border-[#d1d5dc] hover:border-[#bc0c11] transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Hari & Sesi Header */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-dashed border-[#e5e7eb]">
                    <Calendar className="size-5 text-[#bc0c11]" />
                    <h3 className="font-jakarta font-extrabold text-xl text-[#101828]">
                      Setiap Hari {sched.day}
                    </h3>
                  </div>

                  <h4 className="font-jakarta font-bold text-lg sm:text-xl text-[#101828] mb-2">
                    {sched.sessionTitle}
                  </h4>
                  <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed mb-6">
                    {sched.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-jakarta">
                      Fokus Pembelajaran:
                    </p>
                    {sched.points.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-[#bc0c11] shrink-0 mt-0.5" />
                        <span className="font-jakarta text-xs sm:text-sm text-[#364153]">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Main 9 Specializations Section (Search-Only) ─── */}
      <section id="spesialisasi-dtp" className="py-16 sm:py-24 bg-white border-t border-gray-200/60 scroll-mt-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-4xl text-[#101828] mb-4">
              Pilihan Bidang Spesialisasi DTP
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-[#bc0c11] mb-4" />
            <p className="font-jakarta text-base text-[#4a5565] leading-relaxed">
              Dibentuk berdasarkan analisis judul PKL, evaluasi kebutuhan mitra industri, dan target kejuaraan kompetisi nasional.
            </p>
          </div>

          {/* Controls: Search Only */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative w-full">
              <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search className="size-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari spesialisasi, keahlian, atau tools..."
                className="w-full rounded-full bg-white pl-14 sm:pl-16 pr-12 sm:pr-14 py-3.5 sm:py-4 text-sm sm:text-base font-jakarta text-[#101828] placeholder-gray-400 border border-gray-200/90 focus:border-[#bc0c11] focus:outline-none shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 size-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Hapus pencarian"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Specializations Grid */}
          {filteredSpecs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[24px] border-2 border-dashed border-[#d1d5dc] p-8 max-w-xl mx-auto">
              <p className="font-jakarta text-sm sm:text-base text-[#4a5565] mb-4">
                Tidak ada bidang spesialisasi yang sesuai dengan pencarian &ldquo;<strong className="text-[#101828]">{searchQuery}</strong>&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 rounded-full bg-[#bc0c11] hover:bg-[#990a0e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold font-jakarta transition-all duration-200 cursor-pointer shadow-xs"
              >
                <span>Atur Ulang Pencarian</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredSpecs.map((item) => (
                <DtpSpecializationCard
                  key={item.id}
                  item={item}
                  onSelect={setSelectedSpec}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. 10 Proyek Kolaborasi Lintas Bidang ─── */}
      <section className="py-16 sm:py-24 bg-[#f8f9fb]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <h2 className="font-jakarta font-bold text-2xl sm:text-3xl lg:text-4xl text-[#101828] mb-4">
              Contoh Proyek Kolaborasi Industri
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-[#bc0c11] mb-4" />
            <p className="font-jakarta text-base text-[#4a5565] leading-relaxed">
              Peserta DTP tidak belajar dalam sekat yang terpisah. Berbagai spesialisasi berpadu dalam satu proyek terpadu skala kota dan perusahaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DTP_COLLABORATION_PROJECTS.slice(0, 6).map((proj) => (
              <div
                key={proj.id}
                className="group rounded-[24px] bg-white p-6 sm:p-7 border-2 border-dashed border-[#d1d5dc] hover:border-[#bc0c11] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-jakarta font-bold text-lg text-[#101828] mb-2 group-hover:text-[#bc0c11] transition-colors">
                    {proj.title}
                  </h3>

                  <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed mb-5">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[#e5e7eb]">
                  <p className="text-xs font-bold text-[#101828] mb-1 font-jakarta">
                    Bidang Terlibat:
                  </p>
                  <p className="text-xs font-semibold text-[#bc0c11] font-jakarta">
                    {proj.involvedDtp.join(" • ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Modal Detail Spesialisasi ─── */}
      <DtpDetailModal
        item={selectedSpec}
        isOpen={Boolean(selectedSpec)}
        onClose={() => setSelectedSpec(null)}
      />
    </>
  );
}
