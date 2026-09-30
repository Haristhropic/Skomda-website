"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Link as LinkIcon, Check } from "lucide-react";

interface ShareArticleWidgetProps {
  title?: string;
  slug?: string;
}

export default function ShareArticleWidget({ slug }: ShareArticleWidgetProps) {
  const { lang, language } = useLanguage();
  const isEn = lang === "EN" || language === "en";
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return typeof window !== "undefined"
      ? window.location.href
      : `https://smktelkom-sda.sch.id/berita/${slug || ""}`;
  };

  const handleCopy = async () => {
    const urlToCopy = getShareUrl();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = urlToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin link:", err);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-4">
      {/* Label */}
      <span className="text-[#4a5565] font-jakarta text-sm font-semibold">
        {isEn ? "Bagikan artikel ini:" : "Bagikan artikel ini:"}
      </span>

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold font-jakarta transition-all shadow-xs active:scale-95 cursor-pointer ${
          copied
            ? "bg-[#bc0c11] text-white border-[#bc0c11]"
            : "border-gray-200/90 bg-white text-[#bc0c11] hover:bg-[#bc0c11] hover:text-white hover:border-[#bc0c11]"
        }`}
        aria-label={copied ? "Tersalin" : "Salin Link"}
      >
        {copied ? (
          <>
            <Check className="size-3.5" />
            <span>{isEn ? "Copied!" : "Tersalin!"}</span>
          </>
        ) : (
          <>
            <LinkIcon className="size-3.5" />
            <span>{isEn ? "Copy Link" : "Salin Link"}</span>
          </>
        )}
      </button>
    </div>
  );
}
