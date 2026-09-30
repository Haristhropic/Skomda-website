"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Dynamically import the heavy ChatWindow (includes react-markdown & streaming LLM logic)
// Only downloaded when user opens the chatbot or hovers the launcher button
const ChatWindow = dynamic(() => import("./ChatWindow"), {
  ssr: false,
  loading: () => null,
});

export default function SkomdaChatWidget() {
  const { isEn } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  // Restore previous chat session open state from sessionStorage
  useEffect(() => {
    try {
      if (sessionStorage.getItem("skomda_chat_open") === "true") {
        setIsOpen(true);
        setHasOpened(true);
      }
    } catch {}
  }, []);

  // Save open/close state to sessionStorage
  const handleOpen = () => {
    setIsOpen(true);
    setHasOpened(true);
    try {
      sessionStorage.setItem("skomda_chat_open", "true");
    } catch {}
  };

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem("skomda_chat_open", "false");
    } catch {}
  };

  // Preload ChatWindow bundle on mouse hover or focus of the launcher button
  const handlePreload = () => {
    import("./ChatWindow");
  };

  // Hide on admin and gate routes
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/gate-internal-skomda")) {
    return null;
  }

  return (
    <aside
      aria-label={isEn ? "SMK Telkom Sidoarjo Virtual Assistant" : "Asisten Virtual SMK Telkom Sidoarjo"}
      className={`fixed z-50 ${
        isOpen
          ? "inset-0 sm:inset-auto sm:bottom-5 sm:right-5 flex items-end sm:items-auto justify-center sm:justify-end"
          : "bottom-5 right-5"
      }`}
    >
      {/* Floating Toggle Launcher Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          onMouseEnter={handlePreload}
          onFocus={handlePreload}
          aria-label={isEn ? "Open SMK Telkom Sidoarjo Virtual Assistant" : "Buka Chatbot Asisten Virtual SMK Telkom Sidoarjo"}
          className="group relative flex size-14 items-center justify-center rounded-full bg-[#bc0c11] text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#990a0e] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#bc0c11] active:scale-95 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="size-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-300 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-white" />
            </span>
          </div>
          {/* Hover Tooltip Label */}
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-[#101828] px-3 py-1.5 font-jakarta text-xs font-medium text-white shadow-md transition-opacity duration-200 sm:block opacity-0 group-hover:opacity-100">
            {isEn ? "Ask School Info" : "Tanya Info Sekolah"}
          </span>
        </button>
      )}

      {/* Chat Window Panel - Only loaded into DOM after user interaction */}
      {hasOpened && (
        <div className={isOpen ? "block" : "hidden"}>
          <ChatWindow isOpen={isOpen} onClose={handleClose} />
        </div>
      )}
    </aside>
  );
}
