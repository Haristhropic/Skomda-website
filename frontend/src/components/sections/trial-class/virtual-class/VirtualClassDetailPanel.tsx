"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, CheckCircle2, XCircle, RotateCcw, ExternalLink, Sparkles, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { VirtualClassDtpItem } from "@/data/virtualClassData";

interface VirtualClassDetailPanelProps {
  item: VirtualClassDtpItem;
  onBack: () => void;
  onNextClass?: () => void;
  ticketCode?: string;
  userName?: string;
}

export default function VirtualClassDetailPanel({
  item,
  onBack,
  onNextClass,
  ticketCode,
  userName,
}: VirtualClassDetailPanelProps) {
  const { isEn } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Reset quiz state whenever active class item changes
  useEffect(() => {
    setSelectedOption(null);
    setHasCheckedAnswer(false);
    setIsPlaying(true);
  }, [item.id]);

  const isCorrect = selectedOption !== null && selectedOption === item.quiz.correctIndex;

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setHasCheckedAnswer(true);
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setHasCheckedAnswer(false);
  };

  return (
    <div className="w-full bg-white border border-[#dfdfe0] rounded-[16px] p-5 sm:p-7 lg:p-8 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.25)] flex flex-col gap-6 transition-all duration-300">
      {/* ─── Top Header: Back Button (Kotak Kecil), Title, and Duration Badge ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label={isEn ? "Back to all programs" : "Kembali ke semua program"}
            className="size-9 sm:size-10 rounded-[10px] border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-[#364153] hover:text-[#101828] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="size-4.5" />
          </button>

          <h2 className="font-jakarta font-bold text-xl sm:text-2xl lg:text-[28px] text-[#101828] leading-normal pb-0.5 truncate">
            {item.title}
          </h2>
        </div>

        {/* Duration Badge */}
        <div className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3f4f6] text-[#364153] border border-gray-200/90 shrink-0 font-jakarta text-xs sm:text-sm font-semibold">
          <Clock className="size-3.5 text-[#4a5565]" />
          <span>{item.duration}</span>
        </div>
      </div>

      {/* ─── Video Player Container (Google Drive Embed) ─── */}
      <div className="relative w-full rounded-[16px] overflow-hidden bg-black aspect-video border border-gray-200/80 shadow-inner group">
        {isPlaying ? (
          <iframe
            src={`https://drive.google.com/file/d/${item.driveVideoId}/preview`}
            title={`Video Pembelajaran: ${item.title}`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 bg-neutral-900/95 flex flex-col items-center justify-center cursor-pointer text-white p-6"
          >
            <div className="size-16 sm:size-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#bc0c11] transition-all duration-300 shadow-xl">
              <svg
                className="size-8 sm:size-10 ml-1 text-white fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="mt-4 font-jakarta font-medium text-sm sm:text-base text-gray-200 text-center">
              {isEn ? `Click to play ${item.title}` : `Klik untuk memutar materi ${item.title}`}
            </p>
          </div>
        )}

        {/* External Link Pill */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 opacity-90 hover:opacity-100 transition-opacity">
          <a
            href={`https://drive.google.com/file/d/${item.driveVideoId}/view?usp=sharing`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 hover:bg-black text-white text-[11px] font-medium backdrop-blur-sm border border-white/15 transition-colors"
          >
            <span>{isEn ? "Open in Google Drive" : "Buka di Google Drive"}</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* ─── Lesson Title & Overview ─── */}
      <div className="flex flex-col gap-2">
        <h3 className="font-jakarta font-bold text-lg sm:text-xl lg:text-[22px] text-[#101828] leading-snug">
          {item.lessonTitle}
        </h3>
        <p className="font-jakarta text-sm sm:text-base text-[#364153] leading-relaxed">
          {item.lessonDesc}
        </p>
      </div>

      {/* ─── Interactive Quiz Box: "Yuk, Cek Pemahamanmu!" ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-sm flex flex-col gap-4">
        {/* Quiz Header */}
        <div className="flex items-center gap-3.5">
          <div className="size-10 sm:size-12 flex items-center justify-center shrink-0">
            <Image
              src="/images/trial-class/quiz-badge-icon.png"
              alt="Quiz Badge"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h4 className="font-jakarta font-bold text-lg sm:text-xl text-[#101828] leading-tight">
              {isEn ? "Check Your Understanding!" : "Yuk, Cek Pemahamanmu!"}
            </h4>
            <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] mt-0.5 leading-relaxed">
              {isEn
                ? "Answer this question to make sure you have understood the topic thoroughly!"
                : "Jawab pertanyaan ini untuk memastikan kamu sudah memahami materi dengan baik, yaa!"}
            </p>
          </div>
        </div>

        {/* Question Text */}
        <div className="mt-1 pt-3 border-t border-gray-100">
          <p className="font-jakarta font-bold text-sm sm:text-base text-[#101828] leading-snug">
            {item.quiz.question}
          </p>
        </div>

        {/* Multiple Choice Options - Minimalist & Professional */}
        <div className="flex flex-col gap-2.5">
          {item.quiz.options.map((optionText, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isOptionCorrect = optIdx === item.quiz.correctIndex;
            const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

            // Clean minimalist & professional styling without any neon
            let containerStyles = "bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 text-[#364153]";
            let badgeStyles = "bg-gray-100 text-[#4a5565]";
            let radioBorder = "border-gray-300";
            let textStyles = "text-[#364153]";

            if (isSelected && !hasCheckedAnswer) {
              containerStyles = "bg-red-50/20 border border-[#bc0c11]/60 text-[#101828]";
              badgeStyles = "bg-[#bc0c11] text-white";
              radioBorder = "border-[#bc0c11]";
              textStyles = "text-[#101828] font-medium";
            }

            if (hasCheckedAnswer) {
              if (isOptionCorrect) {
                containerStyles = "bg-emerald-50/60 border border-emerald-500 text-emerald-950";
                badgeStyles = "bg-emerald-600 text-white";
                radioBorder = "border-emerald-500";
                textStyles = "text-emerald-950 font-medium";
              } else if (isSelected && !isOptionCorrect) {
                containerStyles = "bg-rose-50/60 border border-rose-400 text-rose-950";
                badgeStyles = "bg-rose-600 text-white";
                radioBorder = "border-rose-400";
                textStyles = "text-rose-950 font-medium";
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                disabled={hasCheckedAnswer && isCorrect}
                onClick={() => {
                  setSelectedOption(optIdx);
                  if (hasCheckedAnswer && !isCorrect) {
                    setHasCheckedAnswer(false);
                  }
                }}
                className={`w-full text-left rounded-xl px-4 py-3 flex items-center justify-between gap-3.5 transition-colors duration-150 cursor-pointer ${containerStyles}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Option Badge (A, B, C, D) */}
                  <div className={`w-8 h-8 rounded-lg font-jakarta font-bold text-xs flex items-center justify-center shrink-0 ${badgeStyles}`}>
                    {optionLetter}
                  </div>

                  {/* Option Text */}
                  <span className={`font-jakarta text-xs sm:text-sm leading-relaxed ${textStyles}`}>
                    {optionText}
                  </span>
                </div>

                {/* State Indicator */}
                <div className="shrink-0 flex items-center justify-center">
                  {hasCheckedAnswer && isOptionCorrect ? (
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  ) : hasCheckedAnswer && isSelected && !isOptionCorrect ? (
                    <XCircle className="size-5 text-rose-500" />
                  ) : (
                    <div className={`size-4.5 w-[18px] h-[18px] rounded-full border flex items-center justify-center bg-white ${radioBorder}`}>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#bc0c11]" />
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ─── Quiz Feedback & Action Button ─── */}
        <div className="mt-2 flex flex-col gap-3">
          {!hasCheckedAnswer && (
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleCheckAnswer}
              className="btn-primary w-full sm:w-auto self-start !h-[44px] !text-sm cursor-pointer"
            >
              {isEn ? "Check Answer" : "Periksa Jawaban"}
            </button>
          )}

          {hasCheckedAnswer && (
            <div
              className={`p-4 rounded-xl border flex flex-col gap-2 ${
                isCorrect
                  ? "bg-emerald-50/90 border-emerald-300 text-emerald-900"
                  : "bg-rose-50/90 border-rose-300 text-rose-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                    <span className="font-jakarta font-bold text-sm sm:text-base text-emerald-800">
                      {isEn ? "Correct Answer! Great job!" : "Jawaban Benar! Hebat sekali!"}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-5 text-rose-600 shrink-0" />
                    <span className="font-jakarta font-bold text-sm sm:text-base text-rose-800">
                      {isEn ? "Incorrect Answer" : "Jawaban Belum Tepat"}
                    </span>
                  </>
                )}
              </div>

              <p className="font-jakarta text-xs sm:text-sm leading-relaxed">
                {isCorrect
                  ? item.quiz.explanation
                  : (isEn
                      ? "Please review the video lesson and try this question again!"
                      : "Silakan telaah kembali penjelasan di materi video, lalu coba lagi pertanyaan di atas yaa!")}
              </p>

              {/* Action Buttons after result */}
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                {!isCorrect ? (
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-jakarta font-medium text-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>{isEn ? "Try Again" : "Coba Lagi"}</span>
                  </button>
                ) : (
                  <>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 font-jakarta font-semibold text-xs">
                      <Sparkles className="size-3.5 text-emerald-600" />
                      <span>{isEn ? `Module ${item.title} Completed` : `Modul ${item.title} Selesai`}</span>
                    </div>

                    {onNextClass && (
                      <button
                        type="button"
                        onClick={onNextClass}
                        className="btn-primary !h-[40px] !min-h-[40px] !px-5 !text-xs cursor-pointer"
                      >
                        <span>{isEn ? "Next Lesson" : "Materi Berikutnya"}</span>
                        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
