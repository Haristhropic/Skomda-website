"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

interface ShareArticleWidgetProps {
  title?: string;
  slug?: string;
}

export default function ShareArticleWidget({ title, slug }: ShareArticleWidgetProps) {
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

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title || "Berita SMK Telkom Sidoarjo",
          url: url,
        });
        return;
      } catch {
        // User dismissed share dialog
      }
    }
    // Fallback to copy link
    handleCopy();
  };

  const handleWhatsApp = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(`${title || "Berita SMK Telkom Sidoarjo"}\n\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-4">
      {/* Label with Share Icon */}
      <div className="flex items-center gap-2 text-[#4a5565] font-jakarta text-sm font-semibold">
        <Share2 className="size-4 text-[#bc0c11]" />
        <span>{isEn ? "Bagikan artikel ini:" : "Bagikan artikel ini:"}</span>
      </div>

      {/* Action Buttons grouped closely beside label */}
      <div className="flex items-center gap-2">
        {/* Native / Main Share Button */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200/90 bg-white hover:bg-gray-50 px-3.5 text-xs font-semibold text-[#364153] hover:text-[#101828] transition-all shadow-xs cursor-pointer active:scale-95"
          aria-label={isEn ? "Share" : "Bagikan"}
        >
          <Share2 className="size-3.5 text-[#bc0c11]" />
          <span>{isEn ? "Bagikan" : "Bagikan"}</span>
        </button>

        {/* WhatsApp Share */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/60 hover:bg-emerald-100/80 px-3 text-xs font-semibold text-emerald-800 transition-all shadow-xs cursor-pointer active:scale-95"
          aria-label="Bagikan ke WhatsApp"
        >
          <svg className="size-3.5 fill-emerald-600" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.997.568 1.954.887 3.203.888 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.769-5.769-5.769zm3.376 8.219c-.147.414-.725.772-1.008.823-.277.051-.634.076-2.025-.502-1.637-.681-2.695-2.339-2.776-2.449-.081-.109-.658-.876-.658-1.671 0-.796.417-1.188.566-1.348.147-.16.323-.201.431-.201.109 0 .217.001.312.006.101.005.236-.039.369.283.136.328.468 1.144.509 1.229.041.084.068.183.014.292-.054.108-.082.176-.163.272-.082.096-.172.215-.246.289-.082.082-.167.171-.072.335.096.164.425.702.912 1.135.626.558 1.155.731 1.319.813.164.082.261.072.357-.041.096-.113.411-.479.521-.643.109-.164.218-.137.368-.082.149.055.952.449 1.115.531.163.082.272.122.312.191.04.068.04.397-.107.811z" />
          </svg>
          <span className="hidden sm:inline">WhatsApp</span>
        </button>

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
    </div>
  );
}
