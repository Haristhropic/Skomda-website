"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface StepItem {
  number: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    titleId: "Pendaftaran",
    titleEn: "Registration",
    descId: "Lengkapi data diri dan pilih jalur pendaftaran yang sesuai",
    descEn: "Complete personal information and select the appropriate admission track",
  },
  {
    number: "02",
    titleId: "Seleksi",
    titleEn: "Selection",
    descId: "Ikuti tahapan seleksi sesuai jadwal yang ditentukan",
    descEn: "Participate in selection stages according to the determined schedule",
  },
  {
    number: "03",
    titleId: "Pengumuman",
    titleEn: "Announcement",
    descId: "Hasil seleksi dapat dilihat secara online melalui whatsapp",
    descEn: "Selection results can be viewed online via WhatsApp & applicant portal",
  },
  {
    number: "04",
    titleId: "Daftar Ulang",
    titleEn: "Re-Registration",
    descId: "Lakukan konfirmasi dan selesaikan proses daftar ulang untuk menjadi bagian dari SKOMDA",
    descEn: "Confirm and complete the re-registration process to officially become part of SKOMDA",
  },
];

export default function PpdbAlurSection() {
  const { isEn } = useLanguage();

  return (
    <section className="relative w-full pt-16 sm:pt-20 lg:pt-24 pb-0 bg-white border-t border-gray-200/60 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">

          {/* Left Column: Title, Subtitle, and Student Illustration (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-between self-stretch"
          >
            <div>
              {/* Heading */}
              <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] leading-[1.2] tracking-tight text-[#101828] mb-4">
                {isEn ? (
                  <>
                    New Student <br />
                    <span className="text-[#bc0c11]">Admission Flow</span>
                  </>
                ) : (
                  <>
                    Alur Pendaftaran <br />
                    <span className="text-[#bc0c11]">Siswa Baru</span>
                  </>
                )}
              </h2>
              <div className="section-title-line !mx-0 !mt-2 !mb-5" />

              {/* Subtitle */}
              <p className="font-jakarta text-base sm:text-[17px] text-[#364153] leading-relaxed max-w-md mb-8 lg:mb-10">
                {isEn
                  ? "Every step is the beginning of a greater future. Make sure you don't miss each essential phase in SMK Telkom Sidoarjo admission."
                  : "Setiap langkah adalah awal dari masa depan yang lebih besar. Pastikan kamu tidak melewatkan setiap tahap penting dalam SPMB SMK Telkom Sidoarjo"}
              </p>
            </div>

            {/* Student Illustration from (touching the bottom edge) */}
            <div className="relative w-full max-w-[380px] sm:max-w-[430px] aspect-[441/499] mx-auto lg:mx-0 mt-auto -mb-px">
              <Image
                src="/images/ppdb/alur-student.png"
                alt="Alur Pendaftaran Siswa Baru SMK Telkom Sidoarjo"
                fill
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 430px"
                className="object-contain object-bottom drop-shadow-md"
              />
            </div>
          </motion.div>

          {/* Right Column: Timeline & 4 Steps (7 Cols) */}
          <div className="lg:col-span-7 relative pb-16 sm:pb-20 lg:pb-24 flex flex-col justify-center">
            <div className="relative">
              {/* Continuous vertical timeline track connecting all nodes with balanced extension below Step 04 */}
              <div
                className="absolute top-3.5 bottom-3 left-0 w-6 sm:w-7 flex justify-center pointer-events-none"
                aria-hidden="true"
              >
                <div className="w-0.5 bg-gray-200 h-full" />
              </div>

              <div className="flex flex-col gap-8 sm:gap-10">
                {STEPS.map((step, idx) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                    className="relative flex items-start gap-5 sm:gap-7"
                  >
                    {/* Step Indicator Node (Concentric Red Circle) */}
                    <div className="relative z-10 shrink-0 w-6 sm:w-7 flex items-center justify-center mt-1.5">
                      <div className="size-6 sm:size-7 rounded-full border-2 border-[#bc0c11] bg-white flex items-center justify-center shadow-xs shrink-0">
                        <div className="size-2 sm:size-2.5 rounded-full bg-[#bc0c11]" />
                      </div>
                    </div>

                    {/* Step Number + Content */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 pb-2">
                      {/* Big Red Step Number */}
                      <span className="font-jakarta font-bold text-4xl sm:text-[44px] text-[#bc0c11] leading-none shrink-0 sm:w-16">
                        {step.number}
                      </span>

                      {/* Step Title & Description */}
                      <div className="flex-1">
                        <h3 className="font-jakarta font-bold text-2xl sm:text-[28px] text-[#101828] leading-tight mb-2">
                          {isEn ? step.titleEn : step.titleId}
                        </h3>
                        <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed max-w-lg">
                          {isEn ? step.descEn : step.descId}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
