"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function VisiMisiSection() {
  const { lang, t } = useLanguage();

  const misiList = [
    t("profilSekolah.misi1", "Menyelenggarakan pendidikan menengah kejuruan yang bermutu dan secara bertahap dikembangkan untuk memenuhi standard internasional"),
    t("profilSekolah.misi2", "Mengembangkan sistem pembinaan peserta didik untuk membentuk lulusan yang berkarakter unggul"),
    t("profilSekolah.misi3", "Mengembangkan unit produksi yang relevan dengan program studi untuk meningkatkan skill dan kemampuan kreativitas peserta didik"),
  ];

  return (
    <section id="visi-misi" className="relative w-full py-16 lg:py-24 bg-[#f3f4f6] overflow-hidden scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visi & Misi Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Section Heading */}
            <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-[#101828] tracking-tight">
              {t("profilSekolah.visiTitle", "Visi & Misi Sekolah")}
            </h2>
            <div className="section-title-line !mx-0 !mt-3.5 !mb-10" />

            {/* Visi Block */}
            <div className="flex items-start gap-4 sm:gap-5 mb-10 group">
              {/* Icon Container */}
              <div className="shrink-0 size-12 sm:size-14 rounded-full bg-[#bc0c11] flex items-center justify-center shadow-md shadow-[#bc0c11]/20 group-hover:scale-105 transition-transform duration-300">
                <div className="relative size-6 sm:size-7">
                  <Image
                    src="/images/tentang-kami/profil-sekolah/icons/icon-target-dart.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 pt-1">
                <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828] mb-2">
                  {t("profilSekolah.visiHeading", "Visi Sekolah")}
                </h3>
                <p className="font-jakarta text-base sm:text-[17px] text-[#364153] leading-relaxed">
                  {t("profilSekolah.visiText", "Mewujudkan lembaga pendidikan menengah kejuruan yang bermutu dengan standar internasional sehingga mampu menghasilkan lulusan berkarakter unggul")}
                </p>
              </div>
            </div>

            {/* Misi Block */}
            <div className="flex items-start gap-4 sm:gap-5 group">
              {/* Icon Container */}
              <div className="shrink-0 size-12 sm:size-14 rounded-full bg-[#bc0c11] flex items-center justify-center shadow-md shadow-[#bc0c11]/20 group-hover:scale-105 transition-transform duration-300">
                <div className="relative size-6 sm:size-7">
                  <Image
                    src="/images/tentang-kami/profil-sekolah/icons/icon-misi.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 pt-1">
                <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828] mb-4">
                  {t("profilSekolah.misiHeading", "Misi Sekolah")}
                </h3>

                {/* Numbered List */}
                <div className="space-y-4">
                  {misiList.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="font-jakarta font-bold text-base text-[#bc0c11] shrink-0 pt-0.5">
                        {index + 1}.
                      </span>
                      <p className="font-jakarta text-base text-[#364153] leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Composition + Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-center lg:items-end"
          >
            {/* Visual Art Container with exact proportional geometry */}
            <div className="relative w-full max-w-[380px] sm:max-w-[400px] aspect-[400/430] select-none">
              
              {/* Large Red Circle */}
              <div className="absolute left-[1.25%] top-[17.9%] w-[77.75%] h-[72.3%] pointer-events-none z-0">
                <Image
                  src="/images/tentang-kami/profil-sekolah/visimisi-circle-large.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              {/* Small Red Circle */}
              <div className="absolute left-[47.75%] top-[26.28%] w-[52%] h-[48.37%] pointer-events-none z-0">
                <Image
                  src="/images/tentang-kami/profil-sekolah/visimisi-circle-small.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              {/* Dark Grey Circle */}
              <div className="absolute left-0 top-[72.09%] w-[27%] h-[25.12%] pointer-events-none z-0">
                <Image
                  src="/images/tentang-kami/profil-sekolah/visimisi-ellipse-decor.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              {/* Student Photo */}
              <div className="absolute left-[10%] top-[2.33%] w-[69%] h-[96.28%] z-10">
                <Image
                  src="/images/tentang-kami/profil-sekolah/visimisi-student.png"
                  alt="Siswi SMK Telkom Sidoarjo"
                  fill
                  className="object-contain object-bottom drop-shadow-md"
                  priority
                />
              </div>
            </div>

            {/* Quote Caption */}
            <div className="mt-4 max-w-[380px] text-center lg:text-left px-2">
              <p className="font-jakarta italic text-sm sm:text-[15px] text-[#4a5565] leading-relaxed">
                {lang === "EN"
                  ? "This vision and mission guide SMK Telkom Sidoarjo in nurturing an exceptional generation in the digital era."
                  : "Visi dan misi ini menjadi arah langkah SMK Telkom Sidoarjo dalam mencetak generasi unggul di era digital."}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
