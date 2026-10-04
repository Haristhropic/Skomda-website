"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { isAnalyticsExcludedPath } from "@/lib/analyticsRoutes";

type ConsentChoice = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "skomda.analytics-consent.v1";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() ?? "";

function getSavedChoice(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Consent still applies for this page view if storage is unavailable.
  }
}

function deleteAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => /^(?:_ga(?:_|$)|_gid$|_gat(?:_|$)|_clck$|_clsk$)/.test(name));
  const hostParts = window.location.hostname.split(".");
  const domains = new Set<string>([window.location.hostname]);
  for (let index = 1; index < hostParts.length - 1; index += 1) {
    domains.add(hostParts.slice(index).join("."));
  }

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}; SameSite=Lax`;
    }
  }
}

function stopAnalytics() {
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.clarity?.("consent", false);
  deleteAnalyticsCookies();
}

function maskFormsForClarity() {
  document.querySelectorAll("form").forEach((form) => {
    form.setAttribute("data-clarity-mask", "true");
  });
}

function sendGooglePageView(pathname: string, previousPath: string | null) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  let safeReferrer = "";
  if (previousPath) {
    safeReferrer = `${window.location.origin}${previousPath}`;
  } else if (document.referrer) {
    try {
      safeReferrer = new URL(document.referrer).origin;
    } catch {
      safeReferrer = "";
    }
  }

  // Never forward title/query/hash/form values: route names and referrer origin only.
  window.gtag("event", "page_view", {
    page_location: `${window.location.origin}${pathname}`,
    page_path: pathname,
    page_title: pathname,
    page_referrer: safeReferrer,
  });
}

function loadGoogleAnalytics(pathname: string, previousPath: string | null) {
  if (!GA_MEASUREMENT_ID || window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  script.dataset.skomdaAnalytics = "ga4";
  document.head.appendChild(script);
  sendGooglePageView(pathname, previousPath);
}

function loadClarity() {
  if (!CLARITY_PROJECT_ID || window.clarity) return;

  const clarity = Object.assign((...args: unknown[]) => {
    clarity.q = clarity.q ?? [];
    clarity.q.push(args);
  }, { q: [] as unknown[][] });
  window.clarity = clarity;
  window.clarity("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: "granted",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_PROJECT_ID)}`;
  script.dataset.skomdaAnalytics = "clarity";
  document.head.appendChild(script);
}

export default function AnalyticsConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const activeRef = useRef(false);
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    setChoice(getSavedChoice());
    setReady(true);
  }, []);

  const accept = useCallback(() => {
    saveChoice("accepted");
    setChoice("accepted");
    setSettingsOpen(false);
  }, []);

  const reject = useCallback(() => {
    const wasAccepted = choice === "accepted" || activeRef.current;
    saveChoice("rejected");
    stopAnalytics();
    setChoice("rejected");
    setSettingsOpen(false);
    activeRef.current = false;

    // Reload removes already-evaluated vendor code and starts a clean, denied page view.
    if (wasAccepted) window.location.reload();
  }, [choice]);

  useEffect(() => {
    if (!ready || choice !== "accepted" || isAnalyticsExcludedPath(pathname)) {
      if (isAnalyticsExcludedPath(pathname) && activeRef.current) {
        stopAnalytics();
        activeRef.current = false;
        previousPathRef.current = null;
        // Also cover router.push() and browser-history paths that bypass link clicks.
        window.location.replace(`${pathname}${window.location.search}${window.location.hash}`);
      }
      return;
    }

    if (GA_MEASUREMENT_ID) {
      if (!window.gtag) {
        loadGoogleAnalytics(pathname, previousPathRef.current);
      } else {
        sendGooglePageView(pathname, previousPathRef.current);
      }
    }
    previousPathRef.current = pathname;
    // Mark the existing DOM before Clarity's script can execute and observe it.
    if (CLARITY_PROJECT_ID) maskFormsForClarity();
    loadClarity();
    activeRef.current = Boolean(GA_MEASUREMENT_ID || CLARITY_PROJECT_ID);
  }, [choice, pathname, ready]);

  useEffect(() => {
    if (!ready || choice !== "accepted" || !activeRef.current) return;

    const handleSensitiveLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin || !isAnalyticsExcludedPath(nextUrl.pathname)) return;

      // Sensitive routes use a document navigation so the analytics runtime cannot
      // continue observing their React-rendered DOM after a client-side transition.
      event.preventDefault();
      stopAnalytics();
      activeRef.current = false;
      window.location.assign(nextUrl.href);
    };

    document.addEventListener("click", handleSensitiveLink, true);
    return () => document.removeEventListener("click", handleSensitiveLink, true);
  }, [choice, ready]);

  useEffect(() => {
    if (!ready || choice !== "accepted" || isAnalyticsExcludedPath(pathname)) return;

    maskFormsForClarity();
    const observer = new MutationObserver(maskFormsForClarity);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [choice, pathname, ready]);

  const hasTrackingIds = Boolean(GA_MEASUREMENT_ID || CLARITY_PROJECT_ID);
  if (!ready || isAnalyticsExcludedPath(pathname) || !hasTrackingIds) return null;

  const showPanel = choice === null || settingsOpen;

  return (
    <>
      {!showPanel && (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-4 left-4 z-[70] rounded-full border border-slate-300 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bc0c11]"
          aria-label="Buka pengaturan privasi analytics"
        >
          Pengaturan privasi
        </button>
      )}

      {showPanel && (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="analytics-consent-title"
          className="fixed bottom-4 left-4 z-[70] w-[min(34rem,calc(100vw-5.5rem))] rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-2xl sm:p-5"
        >
          <h2 id="analytics-consent-title" className="text-sm font-bold sm:text-base">
            Pengaturan privasi
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm">
            Kami ingin memakai Google Analytics dan Microsoft Clarity untuk memahami penggunaan
            website dan memperbaiki pengalaman. Keduanya hanya aktif jika kamu menyetujui. Kami
            tidak mengirim isi formulir atau data pribadi ke analytics.
          </p>
          {!hasTrackingIds && (
            <p className="mt-2 text-xs text-slate-500">
              Layanan analytics belum dikonfigurasi; pilihanmu tetap bisa diubah kapan saja.
            </p>
          )}
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={reject}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bc0c11] sm:text-sm"
            >
              Tolak
            </button>
            <button
              type="button"
              onClick={accept}
              className="rounded-lg bg-[#bc0c11] px-3 py-2 text-xs font-semibold text-white hover:bg-[#a30b10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bc0c11] sm:text-sm"
            >
              Terima analytics
            </button>
          </div>
        </section>
      )}
    </>
  );
}
