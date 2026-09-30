"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function TrialClassStepsSection() {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      title: t("trialClassPage.step1Title", "Daftar"),
      desc: t(
        "trialClassPage.step1Desc",
        "Isi data peserta dengan benar pada formulir pendaftaran"
      ),
    },
    {
      num: "02",
      title: t("trialClassPage.step2Title", "Dapatkan Trial Pass"),
      desc: t(
        "trialClassPage.step2Desc",
        "Informasi jadwal dan akses event dikirimkan setelah pendaftaran"
      ),
    },
    {
      num: "03",
      title: t("trialClassPage.step3Title", "Masuk Saat Event Dibuka"),
      desc: t(
        "trialClassPage.step3Desc",
        "Gunakan trial pass untuk bergabung di sesi kelas virtual dan mulai pengalaman belajarmu"
      ),
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-white/50">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: 3D Isometric School Building Model */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[540px] aspect-[1.3/1] select-none">
              <Image
                src="/images/trial-class/school-3d.png"
                alt="Gedung SMK Telkom Sidoarjo 3D Model"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-contain drop-shadow-xl"
              />
            </div>
          </motion.div>

          {/* Right: Steps Container Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6"
          >
            <div className="bg-[#f3f4f6]/80 backdrop-blur-sm rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 lg:p-10 border border-gray-200/80 shadow-sm">
              <h2 className="font-jakarta text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101828] mb-2">
                {t("trialClassPage.stepsTitle", "Cara Mengikuti")}
              </h2>
              <div className="section-title-line !mx-0 !mt-2 !mb-8 sm:!mb-10" />

              <div className="flex flex-col gap-8 sm:gap-10">
                {steps.map((step, idx) => (
                  <div key={step.num} className="flex items-start gap-5 sm:gap-6">
                    {/* Red Number Accent */}
                    <div className="shrink-0 w-12 pt-0.5">
                      <span className="font-jakarta text-3xl sm:text-4xl font-bold text-[#bc0c11]">
                        {step.num}
                      </span>
                    </div>

                    {/* Step Details */}
                    <div className="flex flex-col">
                      <h3 className="font-jakarta text-xl sm:text-2xl font-bold text-black mb-1">
                        {step.title}
                      </h3>
                      <p className="font-jakarta text-sm sm:text-base text-[#6a7282] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
