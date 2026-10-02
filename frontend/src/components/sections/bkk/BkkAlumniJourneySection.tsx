"use client";

import { useState } from "react";
import Image from "next/image";
import { ALUMNI_STORIES_ITEMS, getLocalizedAlumniStory } from "@/data/bkkData";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function BkkAlumniJourneySection() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalStories = ALUMNI_STORIES_ITEMS.length;
  const safeIndex = totalStories > 0 ? ((currentIndex % totalStories) + totalStories) % totalStories : 0;
  const rawStory = ALUMNI_STORIES_ITEMS[safeIndex];
  const currentStory = rawStory ? getLocalizedAlumniStory(rawStory, isEn) : null;

  const handlePrev = () => {
    if (totalStories === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? totalStories - 1 : prev - 1));
  };

  const handleNext = () => {
    if (totalStories === 0) return;
    setCurrentIndex((prev) => (prev >= totalStories - 1 ? 0 : prev + 1));
  };

  if (!currentStory || totalStories === 0) return null;

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#f9fafb] border-t border-gray-200/60 overflow-hidden scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading & Subtitle */}
          <div className="lg:col-span-5">
            <h2 className="font-jakarta font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-[#101828] mb-3">
              {isEn ? "Beyond SKOMDA, " : "Setelah SKOMDA, "}
              <span className="text-[#bc0c11]">
                {isEn ? "Stepping Further Ahead." : "Melangkah Lebih Jauh."}
              </span>
            </h2>

            <div className="section-title-line !mx-0" />

            <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed mb-6">
              {isEn
                ? "Real verified stories from alumni now thriving in leading technology and telecommunications industries."
                : "Cerita nyata dari alumni yang kini berkarya di berbagai industri teknologi dan telekomunikasi terkemuka."}
            </p>

            <div className="flex items-center gap-2 text-xs font-jakarta text-gray-400">
              <span className="font-bold text-[#bc0c11]">
                {String(safeIndex + 1).padStart(2, "0")}
              </span>
              <span>/</span>
              <span>{String(totalStories).padStart(2, "0")}</span>
              <span className="ml-2">{isEn ? "Alumni Stories" : "Kisah Inspirasi"}</span>
            </div>
          </div>

          {/* Right Column: Interactive Testimonial Card */}
          <div className="lg:col-span-7">
            <div className="neu-card-interactive rounded-[28px] p-6 sm:p-8 group">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                
                {/* Alumnus Photo */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                  <Image
                    src={currentStory.avatar}
                    alt={currentStory.name}
                    fill
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Quote Content */}
                <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
                  <div className="mb-5">
                    <Quote className="size-6 text-[#bc0c11] fill-[#bc0c11] mb-2 mx-auto sm:mx-0" aria-hidden="true" />
                    <p className="font-jakarta text-sm sm:text-base text-[#101828] font-medium leading-relaxed italic mb-3">
                      {currentStory.quote}
                    </p>
                    <p className="font-jakarta text-xs text-[#4a5565] leading-relaxed hidden sm:block">
                      {currentStory.story}
                    </p>
                  </div>

                  {/* Name & Alumnus Details with Navigation Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <h3 className="font-jakarta font-bold text-base text-[#101828]">
                        {currentStory.name}
                      </h3>
                      <p className="font-jakarta text-xs text-gray-500">
                        {currentStory.role}, {currentStory.company}
                      </p>
                      <span className="inline-block mt-0.5 font-jakarta text-[11px] font-semibold text-[#bc0c11]">
                        {currentStory.alumniInfo}
                      </span>
                    </div>

                    {/* Navigation Prev & Next Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handlePrev}
                        aria-label={isEn ? "Previous Alumni Story" : "Cerita Alumni Sebelumnya"}
                        className="w-10 h-10 rounded-full neu-card-interactive text-[#101828] hover:text-[#bc0c11] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                      >
                        <ChevronLeft className="size-4" />
                      </button>

                      <button
                        onClick={handleNext}
                        aria-label={isEn ? "Next Alumni Story" : "Cerita Alumni Berikutnya"}
                        className="w-10 h-10 rounded-full bg-[#bc0c11] text-white hover:bg-[#990a0e] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
