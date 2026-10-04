"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  X,
  Send,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Bot,
  User,
  School,
  AlertCircle,
  Copy,
  Check,
  ArrowDown,
  Trash2,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import {
  getFollowUpSuggestions,
  type ChatSource,
} from "./dtpChatbotKnowledge";
import { buildApiUrl } from "@/lib/api";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  sources?: ChatSource[];
  suggestedQuestions?: string[];
  timestamp: string;
  isStreaming?: boolean;
}

function safeChatHref(value?: string): string | null {
  if (!value || /[\u0000-\u001f]/.test(value)) return null;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password && ["smktelkom-sda.sch.id", "www.smktelkom-sda.sch.id", "smktelkom-sidoarjo.my.id", "linear.smktelkom-sidoarjo.my.id"].includes(url.hostname)) return url.toString();
  } catch { /* Display untrusted links as text. */ }
  return null;
}

const QUICK_PROMPTS_ID = [
  "Apa saja pilar Program BMW di SMK Telkom Sidoarjo?",
  "Apa itu Digital Talent Program (DTP) dan 9 spesialisasinya?",
  "Apa perbedaan jurusan SIJA (4 tahun) dan TJAT (3 tahun)?",
  "Berapa estimasi biaya hidup dan sewa kos di sekitar sekolah?",
];

const QUICK_PROMPTS_EN = [
  "What are the pillars of the BMW Program at SMK Telkom Sidoarjo?",
  "What is the Digital Talent Program (DTP) and its 9 specializations?",
  "What is the difference between SIJA (4-year) and TJAT (3-year)?",
  "What is the estimated cost of living and student boarding near school?",
];

const INITIAL_WELCOME_ID: Message = {
  id: "welcome-1",
  role: "assistant",
  content:
    "Halo! Saya **Skomda AI Assistant**, asisten virtual resmi SMK Telkom Sidoarjo.\n\nAda yang bisa saya bantu seputar program BMW (Bekerja, Melanjutkan, Wirausaha), Digital Talent Program (DTP), jurusan SIJA & TJAT, alur PPDB 2026/2027, atau rekomendasi kos?",
  timestamp: "Baru saja",
};

const INITIAL_WELCOME_EN: Message = {
  id: "welcome-1",
  role: "assistant",
  content:
    "Hello! I am **Skomda AI Assistant**, the official virtual assistant of SMK Telkom Sidoarjo.\n\nHow can I help you regarding our BMW Program (Work, Continue study, Entrepreneurship), Digital Talent Program (DTP), SIJA & TJAT majors, PPDB 2026/2027 admissions, or boarding accommodation?",
  timestamp: "Just now",
};

// Minimalist Typing Indicator Dots
function ThinkingState() {
  return (
    <div
      role="status"
      aria-label="Sedang memproses respons"
      className="flex items-center gap-1.5 py-1.5 px-0.5"
    >
      <span className="size-2 rounded-full bg-slate-400 animate-typing-dot-1" />
      <span className="size-2 rounded-full bg-slate-400 animate-typing-dot-2" />
      <span className="size-2 rounded-full bg-slate-400 animate-typing-dot-3" />
      <span className="sr-only">Sedang memproses jawaban...</span>
    </div>
  );
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const { isEn } = useLanguage();
  const initialWelcome = isEn ? INITIAL_WELCOME_EN : INITIAL_WELCOME_ID;
  const quickPrompts = isEn ? QUICK_PROMPTS_EN : QUICK_PROMPTS_ID;

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialWelcome]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeStreamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (activeStreamIntervalRef.current) {
        clearInterval(activeStreamIntervalRef.current);
      }
    };
  }, []);

  // Restore chat messages from sessionStorage on mount (hydration safe)
  useEffect(() => {
    setIsMounted(true);
    try {
      // Remove the previous persistent transcript on shared school devices.
      localStorage.removeItem("skomda_chat_messages");
      const saved = sessionStorage.getItem("skomda_chat_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.slice(-40).filter((m: Message) => m && typeof m.content === "string" && m.content.length <= 16_000 && ["user", "assistant"].includes(m.role)).map((m: Message) => {
            if (m.id === "welcome-1") {
              return initialWelcome;
            }
            return { ...m, isStreaming: false };
          });
          setMessages(cleaned);
        }
      }
    } catch (err) {
      console.warn("[SkomdaChat] Failed to restore chat from sessionStorage:", err);
    }
  }, [initialWelcome]);

  // Persist chat messages to sessionStorage whenever they change
  useEffect(() => {
    if (!isMounted) return;
    try {
      const toSave = messages.filter((m) => m.content.trim().length > 0 && !m.isStreaming).slice(-40);
      if (toSave.length > 0) {
        sessionStorage.setItem("skomda_chat_messages", JSON.stringify(toSave));
      }
    } catch (err) {
      console.warn("[SkomdaChat] Failed to save chat to sessionStorage:", err);
    }
  }, [messages, isMounted]);

  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const isAutoScrollActiveRef = useRef(true);

  // Auto scroll down smoothly or instantly
  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollContainerRef.current) {
      if (smooth) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      } else {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
      isAutoScrollActiveRef.current = true;
      setShowScrollToBottom(false);
    }
  }, []);

  // Track scroll position: if user scrolls up away from bottom, pause auto-scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight <= 60;
    isAutoScrollActiveRef.current = isNearBottom;
    setShowScrollToBottom(!isNearBottom);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(true);
      if (typeof window !== "undefined" && window.innerWidth >= 640) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [isOpen, scrollToBottom]);

  // Keyboard shortcut: ESC to close dialog or cancel reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showResetConfirm) {
          setShowResetConfirm(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showResetConfirm, onClose]);

  const handleCopyText = (id: string, text: string) => {
    const cleanText = text.replace(/<think>[\s\S]*?(<\/think>|$)/gi, "").trim();
    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;
    if (query.length > 2000 || new TextEncoder().encode(query).length > 4000) { setErrorStatus(isEn ? "Your question is too long. Please shorten it." : "Pertanyaan terlalu panjang. Ringkas pertanyaan lalu coba lagi."); return; }

    setInputMessage("");
    setErrorStatus(null);

    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const botMsgId = `bot-${Date.now()}`;
    const botPlaceholder: Message = {
      id: botMsgId,
      role: "assistant",
      content: "",
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev.slice(-38), userMsg, botPlaceholder]);
    setIsLoading(true);

    setTimeout(() => scrollToBottom(true), 50);

    if (activeStreamIntervalRef.current) {
      clearInterval(activeStreamIntervalRef.current);
      activeStreamIntervalRef.current = null;
    }

    const promptPayload = query.trim();

    try {
      const historyPayload = messages
        .filter((m) => m.id !== "welcome-1")
        .slice(-4)
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, 1000),
        }));

      const response = await fetch(buildApiUrl("chatbot/message"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream, application/json",
        },
        body: JSON.stringify({
          message: promptPayload,
          history: historyPayload,
          stream: true,
        }),
        signal: AbortSignal.timeout(25_000),
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        let collectedSources: ChatSource[] = [];
        let streamBuffer = "";
        let rafId: number | null = null;
        let pendingFrame = false;

        const scheduleRender = () => {
          if (pendingFrame) return;
          pendingFrame = true;
          rafId = requestAnimationFrame(() => {
            pendingFrame = false;
            const displayContent = accumulatedText.replace(/<think>[\s\S]*?(<\/think>|$)/gi, "").trimStart();
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMsgId
                  ? {
                    ...msg,
                    content: displayContent,
                    sources: collectedSources,
                    isStreaming: true,
                  }
                  : msg
              )
            );
            if (scrollContainerRef.current && isAutoScrollActiveRef.current) {
              scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            }
          });
        };

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            streamBuffer += decoder.decode(value, { stream: true });
            if (streamBuffer.length > 64_000 || accumulatedText.length > 32_000) {
              await reader.cancel();
              throw new Error("Respons asisten terlalu besar");
            }
            const lines = streamBuffer.split("\n");
            streamBuffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith(":")) continue;

              if (trimmed.startsWith("data:")) {
                const dataStr = trimmed.replace(/^data:\s*/, "");
                if (dataStr === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.sources && Array.isArray(parsed.sources)) {
                    collectedSources = parsed.sources;
                    scheduleRender();
                  }

                  const textChunk =
                    typeof parsed.delta === "string"
                      ? parsed.delta
                      : typeof parsed.delta?.content === "string"
                        ? parsed.delta.content
                        : typeof parsed.choices?.[0]?.delta?.content === "string"
                          ? parsed.choices[0].delta.content
                          : typeof parsed.chunk === "string"
                            ? parsed.chunk
                            : typeof parsed.content === "string"
                              ? parsed.content
                              : typeof parsed.text === "string"
                                ? parsed.text
                                : typeof parsed.response === "string"
                                  ? parsed.response
                                  : typeof parsed.message === "string"
                                    ? parsed.message
                                    : null;

                  if (textChunk) {
                    accumulatedText += textChunk;
                    scheduleRender();
                  }
                } catch {
                  accumulatedText += dataStr;
                  scheduleRender();
                }
              }
            }
          }
        } finally {
          if (rafId) cancelAnimationFrame(rafId);
        }

        const cleanFinal = accumulatedText.replace(/<think>[\s\S]*?(<\/think>|$)/gi, "").trim();
        const finalBotText = cleanFinal || accumulatedText || "Halo! Ada yang bisa saya bantu seputar informasi SMK Telkom Sidoarjo?";
        const followUps = getFollowUpSuggestions(
          query,
          finalBotText,
          isEn,
          messages.map((m) => m.content)
        );

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                ...msg,
                content: finalBotText,
                sources: collectedSources,
                suggestedQuestions: followUps,
                isStreaming: false,
              }
              : msg
          )
        );
      } else {
        const data = await response.json();
        const rawContent =
          typeof data.response === "string"
            ? data.response
            : typeof data.message === "string"
              ? data.message
              : typeof data.delta === "string"
                ? data.delta
                : typeof data.content === "string"
                  ? data.content
                  : "Maaf, tidak ada respon dari sistem.";
        const cleanContent = rawContent.replace(/<think>[\s\S]*?(<\/think>|$)/gi, "").trim();
        const finalBotText = cleanContent || rawContent;
        const followUps = getFollowUpSuggestions(
          query,
          finalBotText,
          isEn,
          messages.map((m) => m.content)
        );

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                ...msg,
                content: finalBotText,
                sources: data.sources || [],
                suggestedQuestions: followUps,
                isStreaming: false,
              }
              : msg
          )
        );
      }
    } catch {
      const unavailable = isEn
        ? "I cannot verify an answer right now. Please try again shortly or check the school pages below for confirmed information."
        : "Saya belum dapat memverifikasi jawaban saat ini. Coba lagi sebentar atau periksa halaman sekolah berikut untuk informasi terkonfirmasi.";
      setMessages((prev) => prev.map((msg) => msg.id === botMsgId ? {
        ...msg, content: unavailable, isStreaming: false, suggestedQuestions: [],
        sources: [{ title: "PPDB", url: "/ppdb" }, { title: isEn ? "School programs" : "Program sekolah", url: "/program/profil-jurusan" }],
      } : msg));
      setErrorStatus(isEn ? "The assistant is temporarily unavailable." : "Asisten belum tersedia. Coba lagi sebentar.");
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  const handleTriggerReset = () => {
    if (messages.length <= 1) {
      return;
    }
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    if (activeStreamIntervalRef.current) {
      clearInterval(activeStreamIntervalRef.current);
      activeStreamIntervalRef.current = null;
    }
    setMessages([initialWelcome]);
    setErrorStatus(null);
    setInputMessage("");
    setShowResetConfirm(false);
    try {
      sessionStorage.removeItem("skomda_chat_messages");
    } catch { }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-heading"
      className="relative flex flex-col w-full h-[100dvh] sm:w-[440px] sm:h-[600px] sm:max-h-[88vh] rounded-none sm:rounded-2xl bg-white border-0 sm:border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header Panel */}
      <header className="relative flex items-center justify-between px-4 py-3 bg-[#bc0c11] text-white select-none shrink-0 pt-[max(0.875rem,env(safe-area-inset-top))] rounded-t-none sm:rounded-t-2xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <Bot className="size-5 text-white shrink-0" aria-hidden="true" />
          <h2 id="chatbot-heading" className="font-jakarta font-semibold text-sm tracking-tight text-white leading-none">
            Skomda Assistant
          </h2>
        </div>

        {/* Header Control Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleTriggerReset}
            title={isEn ? "Clear conversation" : "Bersihkan percakapan"}
            aria-label={isEn ? "Clear conversation history" : "Bersihkan riwayat percakapan"}
            className="flex size-11 sm:size-8 items-center justify-center rounded-lg text-red-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            onClick={onClose}
            title={isEn ? "Close (Esc)" : "Tutup (Esc)"}
            aria-label={isEn ? "Close chatbot window" : "Tutup jendela chatbot"}
            className="flex size-11 sm:size-8 items-center justify-center rounded-lg text-red-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="size-5" />
          </button>
        </div>
      </header>

      {/* Confirmation Warning Modal before Resetting Chat */}
      {showResetConfirm && (
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 flex items-center justify-center p-4 animate-in fade-in duration-150 rounded-none sm:rounded-2xl"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 shadow-2xl border border-slate-200/90 max-w-[310px] w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-[#bc0c11] mb-3 border border-red-100/80 shadow-2xs">
              <Trash2 className="size-5" />
            </div>
            <h3 className="font-jakarta font-bold text-sm text-slate-900 mb-1">
              {isEn ? "Clear Conversation?" : "Bersihkan Percakapan?"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {isEn
                ? "This chat history will be deleted from your browser and cannot be recovered."
                : "Riwayat obrolan ini akan dihapus dari peramban Anda dan tidak dapat dikembalikan."}
            </p>
            <div className="flex items-center gap-2 w-full">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {isEn ? "Cancel" : "Batal"}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#bc0c11] hover:bg-[#990a0e] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isEn ? "Clear" : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 custom-scrollbar overscroll-contain relative"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
          >
            {msg.role === "assistant" && (
              <div className="shrink-0 text-[#bc0c11] mt-1" aria-hidden="true">
                <Bot className="size-5" />
              </div>
            )}

            <div
              className={`flex flex-col max-w-[88%] ${msg.role === "user" ? "items-end" : "items-start"
                }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 leading-relaxed break-words text-[13.5px] ${msg.role === "user"
                    ? "bg-[#bc0c11] text-white rounded-br-xs shadow-xs"
                    : "bg-white text-[#101828] rounded-bl-xs border border-slate-200/80 shadow-xs"
                  }`}
              >
                {msg.role === "user" ? (
                  <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                ) : (() => {
                  const clean = msg.content
                    .replace(/<think>[\s\S]*?(<\/think>|$)/gi, "")
                    .replace(/—/g, " - ")
                    .trim();
                  if (!clean && msg.isStreaming) {
                    return <ThinkingState />;
                  }
                  if (clean) {
                    return <MarkdownRenderer content={clean} isStreaming={msg.isStreaming} onClose={onClose} />;
                  }
                  return null;
                })()}

                {msg.sources && msg.sources.length > 0 && !msg.isStreaming && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      <School className="size-3 text-[#bc0c11]" />
                      <span>{isEn ? "Related Pages:" : "Halaman Terkait:"}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.filter((source) => safeChatHref(source.url)).slice(0, 3).map((src, idx) => (
                        <Link
                          key={idx}
                          href={src.url}
                          target={src.url.startsWith("http") ? "_blank" : undefined}
                          rel={src.url.startsWith("http") ? "noopener noreferrer" : undefined}
                          onClick={() => {
                            if (!src.url.startsWith("http")) {
                              onClose();
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100/90 text-slate-800 hover:bg-red-50 hover:text-[#bc0c11] border border-slate-200/70 hover:border-red-200 transition-all font-medium text-xs shadow-2xs min-h-[36px]"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="size-2.5 shrink-0 text-[#bc0c11] opacity-75" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between w-full text-[11px] text-slate-400 mt-1 px-1">
                <div className="flex items-center gap-1.5">
                  <span>{msg.timestamp}</span>
                </div>

                {msg.role === "assistant" && msg.content && !msg.isStreaming && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.content)}
                    title="Salin isi pesan"
                    aria-label="Salin teks jawaban"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#bc0c11] py-1 px-2 rounded-md hover:bg-slate-200/70 active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#bc0c11] min-h-[32px]"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="size-3 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3 text-slate-400" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="shrink-0 text-slate-400 mt-1" aria-hidden="true">
                <User className="size-5" />
              </div>
            )}
          </div>
        ))}

        {messages.length === 1 && (
          <div className="pt-2">
            <p className="font-jakarta text-xs font-semibold text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-[#bc0c11]" />
              {isEn ? "Popular Questions:" : "Pertanyaan Populer:"}
            </p>
            <div className="flex flex-col gap-2">
              {quickPrompts.map((prompt: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left font-jakarta text-xs text-slate-700 bg-white hover:bg-red-50/70 hover:text-[#bc0c11] hover:border-[#bc0c11]/30 p-3 min-h-[44px] flex items-center rounded-xl border border-slate-200/80 transition-all duration-150 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#bc0c11] cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 1 &&
          !isLoading &&
          (() => {
            const lastMsg = messages[messages.length - 1];
            if (!lastMsg || lastMsg.role !== "assistant" || lastMsg.isStreaming) {
              return null;
            }
            const suggestions =
              lastMsg.suggestedQuestions && lastMsg.suggestedQuestions.length > 0
                ? lastMsg.suggestedQuestions
                : getFollowUpSuggestions(
                    "",
                    lastMsg.content,
                    isEn,
                    messages.map((m) => m.content)
                  );
            if (!suggestions || suggestions.length === 0) return null;

            return (
              <div className="pt-2">
                <p className="font-jakarta text-xs font-semibold text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-[#bc0c11]" />
                  {isEn ? "Popular Questions:" : "Pertanyaan Populer:"}
                </p>
                <div className="flex flex-col gap-2">
                  {suggestions.map((prompt: string, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left font-jakarta text-xs text-slate-700 bg-white hover:bg-red-50/70 hover:text-[#bc0c11] hover:border-[#bc0c11]/30 p-3 min-h-[44px] flex items-center rounded-xl border border-slate-200/80 transition-all duration-150 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#bc0c11] cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

        <div ref={messagesEndRef} />

        {showScrollToBottom && (
          <div className="sticky bottom-2 flex justify-center z-10 pointer-events-none">
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-slate-700 text-xs font-semibold shadow-md border border-slate-200/90 hover:bg-red-50 hover:text-[#bc0c11] hover:border-red-200 transition-all active:scale-95 cursor-pointer min-h-[40px]"
            >
              <ArrowDown className="size-3.5 text-[#bc0c11]" />
              <span>Ke pesan terbaru</span>
            </button>
          </div>
        )}
      </div>

      {errorStatus && (
        <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5 shrink-0">
          <AlertCircle className="size-3.5 shrink-0 text-amber-600" />
          <span className="truncate">{errorStatus}</span>
        </div>
      )}

      {/* Input Form Section */}
      <footer className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white border-t border-slate-200 shrink-0 rounded-b-none sm:rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isEn ? "Type your question about school..." : "Ketik pertanyaan seputar sekolah..."}
            disabled={isLoading}
            className="flex-1 min-h-[44px] px-3.5 py-2 text-base sm:text-sm text-[#101828] bg-slate-50 rounded-xl border border-slate-200 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/30 focus:border-[#bc0c11] transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            aria-label={isEn ? "Send question" : "Kirim pertanyaan"}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#bc0c11] text-white hover:bg-[#990a0e] transition-colors disabled:opacity-40 disabled:hover:bg-[#bc0c11] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bc0c11] cursor-pointer active:scale-95"
          >
            <Send className="size-4.5" />
          </button>
        </form>
      </footer>
    </div>
  );
}

// High-Fidelity Markdown Renderer Component
interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  onClose?: () => void;
}

function MarkdownRenderer({ content, isStreaming, onClose }: MarkdownRendererProps) {
  const cleanContent = content
    .replace(/<think>[\s\S]*?(<\/think>|$)/gi, "")
    .replace(/—/g, " - ")
    .trim();

  return (
    <div className="chat-markdown prose-sm max-w-none text-[13.5px] leading-relaxed text-slate-800 space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed text-slate-800 text-[13.5px]">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900 tracking-tight">
              {children}
            </strong>
          ),
          h1: ({ children }) => (
            <h4 className="font-jakarta font-bold text-[15px] text-slate-900 mt-3 mb-1.5 pb-1 border-b border-slate-100 tracking-tight">
              {children}
            </h4>
          ),
          h2: ({ children }) => (
            <h4 className="font-jakarta font-bold text-[14.5px] text-slate-900 mt-3 mb-1.5 pb-1 border-b border-slate-100 tracking-tight">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="font-jakarta font-bold text-[14px] text-slate-900 mt-2.5 mb-1 tracking-tight">
              {children}
            </h5>
          ),
          ul: ({ children }) => (
            <ul className="my-2 space-y-1 pl-1 list-none">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 space-y-1 pl-4 list-decimal marker:text-slate-500 marker:font-semibold text-slate-800 text-[13.5px]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2.5 text-slate-800 leading-relaxed text-[13.5px]">
              <span className="size-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
              <div className="flex-1 min-w-0">{children}</div>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2.5 rounded-r-xl border-l-2 border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-700 leading-relaxed italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-3 w-full overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-xs custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100/90 text-slate-900 font-semibold border-b border-slate-200">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-xs font-semibold text-slate-900 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-xs text-slate-700 border-b border-slate-100 last:border-0 align-top leading-relaxed">
              {children}
            </td>
          ),
          a: ({ href, children }) => {
            const safeHref = safeChatHref(href);
            if (!safeHref) return <span>{children}</span>;
            const isExternal = href?.startsWith("http");
            return (
              <Link
                href={safeHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                onClick={() => {
                  if (!isExternal && onClose) {
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-0.5 font-semibold text-[#bc0c11] underline underline-offset-2 hover:text-[#990a0e] transition-colors"
              >
                <span>{children}</span>
                {isExternal && <ExternalLink className="size-2.5 inline-block ml-0.5 opacity-75" />}
              </Link>
            );
          },
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded-md bg-slate-100/90 text-slate-800 font-mono text-xs border border-slate-200/80 font-medium">
              {children}
            </code>
          ),
          hr: () => <hr className="my-3 border-slate-200/80" />,
        }}
      >
        {cleanContent}
      </ReactMarkdown>

      {isStreaming && (
        <span className="inline-block w-0.5 h-4 ml-1 bg-[#bc0c11] rounded-full animate-typing-cursor align-text-bottom shadow-xs" />
      )}
    </div>
  );
}
