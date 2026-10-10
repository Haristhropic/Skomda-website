"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Play,
  Lock,
  ChevronRight,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { VirtualClassDtpItem, QuizItem, getLocalizedVirtualClassItem } from "@/data/virtualClassData";

interface VirtualClassDetailPanelProps {
  item: VirtualClassDtpItem;
  onBack: () => void;
  onNextClass?: () => void;
  ticketCode?: string;
  userName?: string;
}

function formatSeconds(sec?: number): string {
  if (typeof sec !== "number" || isNaN(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function VirtualClassDetailPanel({
  item: rawItem,
  onBack,
  onNextClass,
  ticketCode,
  userName,
}: VirtualClassDetailPanelProps) {
  const { isEn } = useLanguage();
  const item = getLocalizedVirtualClassItem(rawItem, isEn);

  // Extract quizzes list safely and sort by triggerSeconds ascending
  const quizzes: QuizItem[] = useMemo(() => {
    const list =
      item.quizzes && item.quizzes.length > 0
        ? [...item.quizzes]
        : (item.quiz ? [item.quiz] : []);
    return list
      .filter((q): q is QuizItem => Boolean(q && q.question))
      .sort((a, b) => (a.triggerSeconds || 0) - (b.triggerSeconds || 0));
  }, [item.quizzes, item.quiz]);

  // Video source: direct videoUrl (clean HTML5 video) takes top priority, fallback to drive ID
  const videoSrc = useMemo(() => {
    if (item.videoUrl && item.videoUrl.trim()) {
      return item.videoUrl.trim();
    }
    if (item.driveVideoId && item.driveVideoId.trim()) {
      return `/api/virtual-class/video?id=${encodeURIComponent(item.driveVideoId.trim())}`;
    }
    return "";
  }, [item.videoUrl, item.driveVideoId]);

  // Video and playback states
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isVideoPausedForQuiz, setIsVideoPausedForQuiz] = useState<boolean>(false);
  const [isVideoCompleted, setIsVideoCompleted] = useState<boolean>(false);
  const [seekAlertMessage, setSeekAlertMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const quizBoxRef = useRef<HTMLDivElement | null>(null);
  const maxAllowedTimeRef = useRef<number>(0);

  // Quiz states
  const [unlockedQuizIndices, setUnlockedQuizIndices] = useState<number[]>([]);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [quizResults, setQuizResults] = useState<
    Record<
      number,
      {
        selectedOption: number | null;
        hasChecked: boolean;
        isCorrect: boolean;
      }
    >
  >({});

  // Reset all states whenever the active class item changes
  useEffect(() => {
    setVideoError(false);
    setIsBuffering(false);
    setCurrentTime(0);
    setDuration(0);
    setIsVideoPausedForQuiz(false);
    setIsVideoCompleted(false);
    setSeekAlertMessage(null);
    setUnlockedQuizIndices([]);
    setActiveQuizIndex(0);
    setQuizResults({});
    maxAllowedTimeRef.current = 0;
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
    }
  }, [item.id]);

  // Smart seeking guard: ensure student cannot fast-forward past an uncompleted quiz
  const handleSeeking = () => {
    if (!videoRef.current || quizzes.length === 0) return;
    const seekTarget = videoRef.current.currentTime;

    for (let idx = 0; idx < quizzes.length; idx++) {
      const q = quizzes[idx];
      const triggerSec = q.triggerSeconds ?? 60;
      const isSolved = quizResults[idx]?.isCorrect;

      // If user seeks past an uncompleted quiz checkpoint:
      if (!isSolved && seekTarget > triggerSec + 0.5) {
        // Enforce checkpoint: rewind and immediately unlock this quiz
        videoRef.current.currentTime = triggerSec;
        videoRef.current.pause();
        setIsVideoPausedForQuiz(true);
        setActiveQuizIndex(idx);
        setUnlockedQuizIndices((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
        setSeekAlertMessage(
          isEn
            ? "Interactive quiz checkpoint unlocked! Please answer before moving forward."
            : "Kuis interaktif terbuka! Jawab kuis pemahaman materi ini terlebih dahulu sebelum melanjutkan yaa!"
        );
        setTimeout(() => {
          quizBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 150);
        return;
      }
    }
    setSeekAlertMessage(null);
  };

  // Handle native video time update
  const handleTimeUpdate = () => {
    if (!videoRef.current || quizzes.length === 0) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Track max progress
    if (time > maxAllowedTimeRef.current) {
      maxAllowedTimeRef.current = time;
    }

    // Check quiz trigger in timeline order
    for (let idx = 0; idx < quizzes.length; idx++) {
      const q = quizzes[idx];
      const triggerSec = q.triggerSeconds ?? 60;
      const isSolved = quizResults[idx]?.isCorrect;

      // When playback reaches or passes the trigger point of an unsolved quiz:
      if (time >= triggerSec && !isSolved) {
        // Unlock this quiz immediately
        setUnlockedQuizIndices((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
        setActiveQuizIndex(idx);

        // Pause video immediately for student focus
        if (!videoRef.current.paused) {
          videoRef.current.pause();
        }
        setIsVideoPausedForQuiz(true);
        setSeekAlertMessage(null);

        // Snap currentTime cleanly if drifted past the checkpoint
        if (time > triggerSec + 1.5) {
          videoRef.current.currentTime = triggerSec;
        }

        // Smooth scroll to the quiz box
        setTimeout(() => {
          quizBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 150);

        return;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleVideoEnded = () => {
    setIsVideoCompleted(true);
  };

  // Current active quiz details
  const activeQuiz = quizzes[activeQuizIndex] || quizzes[0];
  const activeQuizState = quizResults[activeQuizIndex] || {
    selectedOption: null,
    hasChecked: false,
    isCorrect: false,
  };

  const isCurrentQuizCorrect =
    activeQuizState.selectedOption !== null &&
    activeQuizState.selectedOption === activeQuiz.correctIndex;

  const handleSelectOption = (optIdx: number) => {
    if (activeQuizState.hasChecked && activeQuizState.isCorrect) return;
    setQuizResults((prev) => ({
      ...prev,
      [activeQuizIndex]: {
        selectedOption: optIdx,
        hasChecked: false,
        isCorrect: false,
      },
    }));
  };

  const handleCheckAnswer = () => {
    if (activeQuizState.selectedOption === null) return;
    const isCorrect = activeQuizState.selectedOption === activeQuiz.correctIndex;
    setQuizResults((prev) => ({
      ...prev,
      [activeQuizIndex]: {
        selectedOption: activeQuizState.selectedOption,
        hasChecked: true,
        isCorrect,
      },
    }));

    if (isCorrect) {
      setSeekAlertMessage(null);
    }
  };

  const handleResetCurrentQuiz = () => {
    setQuizResults((prev) => ({
      ...prev,
      [activeQuizIndex]: {
        selectedOption: null,
        hasChecked: false,
        isCorrect: false,
      },
    }));
  };

  // Smart feature: rewind 20 seconds before quiz to review instructor explanation
  const handleRewindForReview = () => {
    if (!videoRef.current) return;
    const currentTrigger = activeQuiz.triggerSeconds ?? 60;
    const targetTime = Math.max(0, currentTrigger - 20);
    videoRef.current.currentTime = targetTime;
    setIsVideoPausedForQuiz(false);
    setSeekAlertMessage(
      isEn
        ? "Rewinding 20 seconds to review the explanation..."
        : "Memutar ulang 20 detik untuk mengulang penjelasan instruktur..."
    );
    videoRef.current.play().catch(() => {});
    setTimeout(() => {
      videoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleContinuePlayback = () => {
    setIsVideoPausedForQuiz(false);
    setSeekAlertMessage(null);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const allQuizzesFinished =
    quizzes.length > 0 &&
    quizzes.every((_, idx) => quizResults[idx]?.hasChecked && quizResults[idx]?.isCorrect);

  const hasAnyUnlocked = unlockedQuizIndices.length > 0;

  return (
    <div className="w-full bg-white border border-[#dfdfe0] rounded-[16px] sm:rounded-[18px] p-3.5 sm:p-7 lg:p-8 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.25)] flex flex-col gap-4 sm:gap-6 transition-all duration-300">
      {/* ─── Top Header: Back Button, Title, Duration Badge ─── */}
      <div className="flex items-center justify-between gap-2.5 sm:gap-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={onBack}
            aria-label={isEn ? "Back to all programs" : "Kembali ke semua program"}
            className="size-9 sm:size-10 rounded-[10px] border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-[#364153] hover:text-[#101828] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="size-4.5" />
          </button>

          <h2 className="font-jakarta font-bold text-base sm:text-2xl lg:text-[28px] text-[#101828] leading-snug truncate">
            {item.title}
          </h2>
        </div>

        {/* Duration Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#f3f4f6] text-[#364153] border border-gray-200/90 shrink-0 font-jakarta text-xs sm:text-sm font-semibold">
          <Clock className="size-3.5 text-[#4a5565]" />
          <span>{item.duration}</span>
        </div>
      </div>

      {/* ─── Native Video Player (Clean, Responsive, with Quiz Pause Notification & Seeking Guard) ─── */}
      <div className="flex flex-col gap-2 w-full">
        {/* Anti-skip seeking warning banner */}
        {seekAlertMessage && (
          <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-medium flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-600 shrink-0" />
              <span>{seekAlertMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSeekAlertMessage(null)}
              className="text-amber-800 hover:text-amber-950 font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        )}

        <div className="relative w-full rounded-[14px] sm:rounded-[18px] overflow-hidden bg-black aspect-video border border-gray-200/80 shadow-md flex items-center justify-center">
          <video
            ref={videoRef}
            key={`${item.id}-${videoSrc}`}
            controls
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
            onSeeked={handleSeeking}
            onEnded={handleVideoEnded}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
            onCanPlay={() => setIsBuffering(false)}
            onError={() => {
              setIsBuffering(false);
              setVideoError(true);
            }}
            className="w-full h-full object-contain bg-black"
            src={videoSrc}
          >
            {isEn ? "Your browser does not support HTML5 video." : "Browser Anda tidak mendukung pemutar video HTML5."}
          </video>

          {/* Buffering / Loading Spinner */}
          {isBuffering && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-2xs z-20 pointer-events-none transition-all">
              <div className="size-10 sm:size-12 rounded-full border-3 border-white/20 border-t-white animate-spin" />
              <span className="font-jakarta text-xs text-white/90 font-medium mt-3 drop-shadow">
                {isEn ? "Buffering video stream..." : "Memuat aliran video..."}
              </span>
            </div>
          )}

          {/* Pause Overlay Notification when video pauses for Quiz */}
          {isVideoPausedForQuiz && !activeQuizState.isCorrect && (
            <div className="absolute inset-x-0 bottom-12 sm:bottom-16 mx-auto w-[90%] sm:w-auto max-w-md bg-slate-900/90 backdrop-blur-md text-white border border-white/20 rounded-xl px-4 py-2.5 shadow-xl flex items-center justify-between gap-3 animate-fade-in z-20">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#bc0c11]"></span>
                </span>
                <p className="font-jakarta text-xs sm:text-sm font-medium truncate">
                  {isEn ? "Video paused for quiz" : "Video dijeda: Kuis pemahaman terbuka!"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  quizBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#bc0c11] hover:bg-[#a00a0e] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                <span>{isEn ? "Answer Quiz" : "Jawab Kuis Sekarang"}</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          )}
        </div>

        {/* Video Checkpoint Timeline Indicator */}
        {quizzes.length > 0 && (
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-600 font-jakarta">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#bc0c11]" />
                <span>{isEn ? "Quiz Checkpoints:" : "Jadwal Kuis Video:"}</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {quizzes.map((q, idx) => {
                  const isSolved = quizResults[idx]?.isCorrect;
                  const isUnlocked = unlockedQuizIndices.includes(idx);
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        isSolved
                          ? "bg-emerald-100 text-emerald-800"
                          : isUnlocked
                          ? "bg-red-100 text-[#bc0c11]"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="size-3 text-emerald-600" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-[#bc0c11]" />
                      )}
                      <span>
                        {isEn ? `Quiz ${idx + 1}` : `Kuis ${idx + 1}`}: {formatSeconds(q.triggerSeconds)}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline shrink-0">
              {isEn ? "Video pauses automatically when quiz appears" : "Video otomatis dijeda saat kuis tiba"}
            </span>
          </div>
        )}
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
      <div
        ref={quizBoxRef}
        className={`bg-white border rounded-2xl p-5 sm:p-6 lg:p-7 shadow-sm flex flex-col gap-4 transition-all duration-300 ${
          isVideoPausedForQuiz && !activeQuizState.isCorrect
            ? "border-[#bc0c11]/60 ring-2 ring-red-100"
            : "border-gray-200"
        }`}
      >
        {/* Quiz Header */}
        <div className="flex items-center justify-between gap-3">
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
              <div className="flex items-center gap-2">
                <h4 className="font-jakarta font-bold text-lg sm:text-xl text-[#101828] leading-tight">
                  {isEn ? "Check Your Understanding!" : "Yuk, Cek Pemahamanmu!"}
                </h4>
                {hasAnyUnlocked && (
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#bc0c11] border border-red-200 text-xs font-bold font-jakarta">
                    {activeQuizIndex + 1}/{quizzes.length}
                  </span>
                )}
              </div>
              <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] mt-0.5 leading-relaxed">
                {hasAnyUnlocked
                  ? (isEn
                      ? `Checkpoint at ${formatSeconds(activeQuiz.triggerSeconds)}. Answer correctly to continue your lesson!`
                      : `Muncul di menit ${formatSeconds(activeQuiz.triggerSeconds)}. Jawab dengan tepat untuk memastikan pemahaman materimu yaa!`)
                  : (isEn
                      ? `The quiz will automatically open during video playback at minute ${formatSeconds(quizzes[0]?.triggerSeconds)}.`
                      : `Kuis interaktif akan otomatis terbuka saat video diputar mencapai menit ${formatSeconds(quizzes[0]?.triggerSeconds)}.`)}
              </p>
            </div>
          </div>

          {/* Checkpoint schedule badge when quiz is locked */}
          {!hasAnyUnlocked && quizzes.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold font-jakarta shrink-0">
              <Clock className="size-3.5 text-[#bc0c11]" />
              <span>
                {isEn
                  ? `Checkpoint: ${formatSeconds(quizzes[0]?.triggerSeconds)}`
                  : `Muncul di ${formatSeconds(quizzes[0]?.triggerSeconds)}`}
              </span>
            </div>
          )}
        </div>

        {/* ─── State 1: Locked State (Before playback reaches any quiz) ─── */}
        {!hasAnyUnlocked ? (
          <div className="p-6 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 flex flex-col items-center justify-center text-center gap-3">
            <div className="size-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#bc0c11] shadow-xs">
              <Lock className="size-5" />
            </div>
            <div className="max-w-md">
              <h5 className="font-jakarta font-bold text-sm sm:text-base text-[#101828]">
                {isEn ? "Quiz is Locked During Introduction" : "Kuis Pemahaman Sedang Terkunci"}
              </h5>
              <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] mt-1 leading-relaxed">
                {isEn
                  ? `Watch the lesson video above. The video will automatically pause and present the interactive quiz when it reaches checkpoint ${formatSeconds(quizzes[0]?.triggerSeconds)}.`
                  : `Tonton video pembelajaran di atas. Video akan otomatis dijeda dan kuis interaktif akan langsung terbuka ketika video mencapai menit ${formatSeconds(quizzes[0]?.triggerSeconds)}.`}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="btn-primary !h-[40px] !px-5 !text-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Play className="size-3.5 fill-current" />
                <span>{isEn ? "Play Video" : "Putar Video Sekarang"}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ─── State 2: Active / Unlocked Quiz ─── */
          <>
            {/* Multiple Quizzes Tab Switcher (if more than 1 quiz exists) */}
            {quizzes.length > 1 && (
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 overflow-x-auto">
                {quizzes.map((q, idx) => {
                  const isUnlocked = unlockedQuizIndices.includes(idx);
                  const isCurrentActive = idx === activeQuizIndex;
                  const isSolved = quizResults[idx]?.isCorrect;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => setActiveQuizIndex(idx)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-jakarta transition-all shrink-0 cursor-pointer ${
                        isCurrentActive
                          ? "bg-[#bc0c11] text-white font-bold shadow-xs"
                          : isSolved
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100/70"
                          : isUnlocked
                          ? "bg-gray-100 text-[#364153] hover:bg-gray-200"
                          : "bg-gray-50 text-gray-400 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                      ) : isUnlocked ? (
                        <HelpCircle className="size-3.5" />
                      ) : (
                        <Lock className="size-3" />
                      )}
                      <span>
                        {isEn ? `Quiz ${idx + 1}` : `Kuis ${idx + 1}`} ({formatSeconds(q.triggerSeconds)})
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Question Text */}
            <div className="mt-1 pt-2 border-t border-gray-100">
              <p className="font-jakarta font-bold text-sm sm:text-base text-[#101828] leading-snug">
                {activeQuiz.question}
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="flex flex-col gap-2.5">
              {activeQuiz.options.map((optionText, optIdx) => {
                const isSelected = activeQuizState.selectedOption === optIdx;
                const isOptionCorrect = optIdx === activeQuiz.correctIndex;
                const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                let containerStyles =
                  "bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 text-[#364153]";
                let badgeStyles = "bg-gray-100 text-[#4a5565]";
                let radioBorder = "border-gray-300";
                let textStyles = "text-[#364153]";

                if (isSelected && !activeQuizState.hasChecked) {
                  containerStyles = "bg-red-50/20 border border-[#bc0c11]/60 text-[#101828]";
                  badgeStyles = "bg-[#bc0c11] text-white";
                  radioBorder = "border-[#bc0c11]";
                  textStyles = "text-[#101828] font-medium";
                }

                if (activeQuizState.hasChecked) {
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
                    disabled={activeQuizState.hasChecked && isCurrentQuizCorrect}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left rounded-xl px-4 py-3 flex items-center justify-between gap-3.5 transition-colors duration-150 cursor-pointer ${containerStyles}`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Option Badge (A, B, C, D) */}
                      <div
                        className={`w-8 h-8 rounded-lg font-jakarta font-bold text-xs flex items-center justify-center shrink-0 ${badgeStyles}`}
                      >
                        {optionLetter}
                      </div>

                      {/* Option Text */}
                      <span className={`font-jakarta text-xs sm:text-sm leading-relaxed ${textStyles}`}>
                        {optionText}
                      </span>
                    </div>

                    {/* State Indicator */}
                    <div className="shrink-0 flex items-center justify-center">
                      {activeQuizState.hasChecked && isOptionCorrect ? (
                        <CheckCircle2 className="size-5 text-emerald-600" />
                      ) : activeQuizState.hasChecked && isSelected && !isOptionCorrect ? (
                        <XCircle className="size-5 text-rose-500" />
                      ) : (
                        <div
                          className={`size-4.5 w-[18px] h-[18px] rounded-full border flex items-center justify-center bg-white ${radioBorder}`}
                        >
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
              {!activeQuizState.hasChecked && (
                <button
                  type="button"
                  disabled={activeQuizState.selectedOption === null}
                  onClick={handleCheckAnswer}
                  className="btn-primary w-full sm:w-auto self-start !h-[44px] !text-sm cursor-pointer"
                >
                  {isEn ? "Check Answer" : "Periksa Jawaban"}
                </button>
              )}

              {activeQuizState.hasChecked && (
                <div
                  className={`p-4 rounded-xl border flex flex-col gap-2 ${
                    isCurrentQuizCorrect
                      ? "bg-emerald-50/90 border-emerald-300 text-emerald-900"
                      : "bg-rose-50/90 border-rose-300 text-rose-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCurrentQuizCorrect ? (
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
                    {isCurrentQuizCorrect
                      ? activeQuiz.explanation
                      : (isEn
                          ? "Please review the video lesson and try this question again!"
                          : "Silakan telaah kembali penjelasan di materi video, lalu coba lagi pertanyaan di atas yaa!")}
                  </p>

                  {/* Action Buttons after result */}
                  <div className="mt-2 flex flex-wrap items-center gap-2.5">
                    {!isCurrentQuizCorrect ? (
                      <>
                        <button
                          type="button"
                          onClick={handleResetCurrentQuiz}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-jakarta font-semibold text-xs transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-xs"
                        >
                          <RotateCcw className="size-3.5" />
                          <span>{isEn ? "Try Again" : "Coba Jawab Lagi"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRewindForReview}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-jakarta font-semibold text-xs transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-xs"
                          title="Putar ulang 20 detik sebelum kuis untuk menyimak penjelasan materi"
                        >
                          <Play className="size-3.5 fill-current" />
                          <span>{isEn ? "Rewind & Review Lesson (-20s)" : "Putar Ulang Penjelasan (-20s)"}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {/* If paused, show Resume Video button */}
                        {isVideoPausedForQuiz && (
                          <button
                            type="button"
                            onClick={handleContinuePlayback}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-jakarta font-semibold text-xs cursor-pointer shadow-xs transition-colors"
                          >
                            <Play className="size-3.5 fill-current" />
                            <span>{isEn ? "Continue Watching Video" : "Lanjut Tonton Video"}</span>
                          </button>
                        )}

                        {/* If there is a next quiz already unlocked, offer switch */}
                        {activeQuizIndex < quizzes.length - 1 &&
                          unlockedQuizIndices.includes(activeQuizIndex + 1) && (
                            <button
                              type="button"
                              onClick={() => setActiveQuizIndex(activeQuizIndex + 1)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-jakarta font-semibold text-xs cursor-pointer transition-colors"
                            >
                              <span>{isEn ? "Next Quiz" : "Kuis Berikutnya"}</span>
                              <ChevronRight className="size-3.5" />
                            </button>
                          )}

                        {/* All quizzes completed badge */}
                        {allQuizzesFinished && (
                          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 font-jakarta font-semibold text-xs">
                            <Sparkles className="size-3.5 text-emerald-600" />
                            <span>
                              {isEn
                                ? `All Quizzes for Module ${item.title} Completed`
                                : `Seluruh Kuis Modul ${item.title} Selesai`}
                            </span>
                          </div>
                        )}

                        {allQuizzesFinished && onNextClass && (
                          <button
                            type="button"
                            onClick={onNextClass}
                            className="btn-primary !h-[40px] !min-h-[40px] !px-5 !text-xs cursor-pointer"
                          >
                            <span>{isEn ? "Next Module" : "Materi Berikutnya"}</span>
                            <svg
                              className="size-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
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
          </>
        )}
      </div>
    </div>
  );
}
