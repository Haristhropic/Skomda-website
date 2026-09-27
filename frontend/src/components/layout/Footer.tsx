"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const LOMBA_LOGOS = [
  {
    name: "Jagoan Hosting Innovation Competition 2026",
    src: "/images/lomba/logo-jhic.png",
    width: 1600,
    height: 972,
    className: "h-10 sm:h-12 w-auto object-contain",
  },
  {
    name: "Jagoan Hosting",
    src: "/images/lomba/logo-jagoan-hosting.png",
    width: 1600,
    height: 503,
    className: "h-7 sm:h-8 w-auto object-contain",
  },
  {
    name: "Kementerian Komunikasi dan Digital (KOMDIGI)",
    src: "/images/lomba/logo-komdigi.png",
    width: 994,
    height: 720,
    className: "h-9 sm:h-10 w-auto object-contain",
  },
  {
    name: "Garuda Spark Innovation Hub",
    src: "/images/lomba/logo-garuda-spark.png",
    width: 1600,
    height: 873,
    className: "h-8 sm:h-9 w-auto object-contain",
  },
  {
    name: "Ngalup.co",
    src: "/images/lomba/logo-ngalup.png",
    width: 1600,
    height: 253,
    className: "h-5 sm:h-6 w-auto object-contain",
  },
];

export default function Footer() {
  const { t } = useLanguage();
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMapLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const menuUtama = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.schoolProfile"), href: "/tentang-kami/profil-sekolah" },
    { label: t("nav.majorProfiles"), href: "/program/profil-jurusan" },
    { label: t("nav.news"), href: "/informasi/berita" },
    { label: t("nav.trialClass"), href: "/trial-class" },
    { label: t("nav.ppdb"), href: "/ppdb" },
    { label: t("nav.tefa", "TeFa"), href: "/tefa" },
    { label: "Pengumuman Kelulusan", href: "/informasi/pengumuman-kelulusan" },
    { label: t("nav.downloadInfo", "Unduh Informasi"), href: "/unduh-informasi" },
  ];

  const aplikasiSiswa = [
    { label: "DigiYouth", href: "https://digiyouth.smktelkom-sda.sch.id" },
    { label: "MyLms", href: "https://mylms.smktelkom-sda.sch.id" },
    { label: "SiAkad", href: "https://siakad.smktelkom-sda.sch.id" },
    { label: "Invert", href: "https://invert.smktelkom-sda.sch.id" },
  ];

  const beritaSekolah = [
    { label: t("footer.schoolActivities", "Kegiatan Sekolah"), href: "/informasi/berita?kategori=Kegiatan+Sekolah" },
    { label: t("nav.achievements", "Prestasi"), href: "/informasi/berita?kategori=Prestasi" },
    { label: t("footer.announcements", "Pengumuman"), href: "/informasi/berita?kategori=Pengumuman" },
    { label: t("footer.partnerships", "Kemitraan & Kerja Sama"), href: "/informasi/berita?kategori=Kemitraan+%26+Kerja+Sama" },
    { label: t("footer.innovations", "Karya & Inovasi Siswa"), href: "/informasi/berita?kategori=Karya+%26+Inovasi+Siswa" },
    { label: t("footer.articles", "Artikel & Edukasi"), href: "/informasi/berita?kategori=Artikel+%26+Edukasi" },
    { label: t("footer.alumni", "Alumni"), href: "/informasi/berita?kategori=Alumni" },
  ];

  return (
    <footer className="w-full bg-white border-t border-[#e5e7eb] pt-16 pb-12 text-[#364153]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">

          {/* Column 1: Info & Kontak (Col span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Logo */}
            <Link href="/" className="relative block h-14 w-[216px]">
              <Image
                src="/images/common/logo-smk-telkom.png"
                alt="SMK Telkom Sidoarjo"
                fill
                sizes="216px"
                className="object-contain object-left"
                priority
              />
            </Link>

            {/* Tagline */}
            <p className="font-jakarta text-sm leading-[23px] text-[#364153] max-w-[320px]">
              {t("footer.tagline")}
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-3 pt-2">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="flex size-4 shrink-0 items-center justify-center text-[#bc0c11]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2.5 3.5H13.5C14.05 3.5 14.5 3.95 14.5 4.5V11.5C14.5 12.05 14.05 12.5 13.5 12.5H2.5C1.95 12.5 1.5 12.05 1.5 11.5V4.5C1.5 3.95 1.95 3.5 2.5 3.5Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path d="M1.5 4.5L8 9L14.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <a
                  href="mailto:informasi@smktelkom-sda.sch.id"
                  className="font-jakarta text-sm text-[#364153] hover:text-[#bc0c11] transition-colors"
                >
                  informasi@smktelkom-sda.sch.id
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="flex size-4 shrink-0 items-center justify-center text-[#bc0c11]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3.5 2.5C3.5 2.5 4.5 1.5 5.5 1.5C6.5 1.5 7 2.5 7.5 3.5L8 4.5C8.5 5.5 8 6 7.5 6.5C7 7 6.5 7.5 7 8.5C7.5 9.5 8.5 10.5 9.5 11C10.5 11.5 11 11 11.5 10.5C12 10 12.5 9.5 13.5 10L14.5 10.5C15.5 11 15.5 12 14.5 13C13.5 14 12.5 14.5 11.5 14.5C8.5 14.5 3.5 9.5 1.5 4.5C1.5 3.5 2 2.5 3.5 2.5Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
                <a
                  href="tel:08113021919"
                  className="font-jakarta text-sm text-[#364153] hover:text-[#bc0c11] transition-colors"
                >
                  0811-3021-919
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-[#bc0c11]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.51 10.49 1.5 8 1.5ZM8 7.5C7.17 7.5 6.5 6.83 6.5 6C6.5 5.17 7.17 4.5 8 4.5C8.83 4.5 9.5 5.17 9.5 6C9.5 6.83 8.83 7.5 8 7.5Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
                <p className="font-jakarta text-sm leading-[20px] text-[#364153]">
                  Jl. Raya Pecantingan Sekardangan,<br />
                  Kabupaten Sidoarjo, Jawa Timur
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  name: "Website",
                  href: "/",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  href: "https://instagram.com/smktelkomsidoarjo",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  name: "Facebook",
                  href: "https://facebook.com/smktelkomsidoarjo",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  name: "WhatsApp",
                  href: "https://wa.me/628113021919",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  ),
                },
                {
                  name: "YouTube",
                  href: "https://youtube.com/@smktelkomsidoarjo",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex size-9 items-center justify-center rounded-full border border-gray-200 text-[#4a5565] transition-colors hover:border-[#bc0c11] hover:bg-[#bc0c11] hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Menu Utama & Aplikasi Siswa (Col span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <h3 className="font-jakarta font-bold text-base sm:text-[17px] text-[#101828] mb-2">
                {t("footer.mainMenu")}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {menuUtama.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-jakarta text-sm text-[#364153] hover:text-[#bc0c11] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-jakarta font-bold text-base sm:text-[17px] text-[#101828] mb-2">
                {t("footer.studentPortals")}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {aplikasiSiswa.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-jakarta text-sm text-[#364153] hover:text-[#bc0c11] transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Berita Sekolah (Col span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div>
              <h3 className="font-jakarta font-bold text-base sm:text-[17px] text-[#101828] mb-2">
                {t("footer.schoolNews")}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {beritaSekolah.map((item, idx) => (
                  <li key={`${item.label}-${idx}`}>
                    <Link
                      href={item.href}
                      className="font-jakarta text-sm text-[#364153] hover:text-[#bc0c11] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Lokasi Sekolah (Col span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="font-jakarta font-bold text-lg text-[#101828]">
              {t("footer.location")}
            </h3>

            {/* Embedded Google Map with Lazy Loading */}
            <div
              ref={mapContainerRef}
              className="relative h-[256px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-slate-100"
            >
              {mapLoaded ? (
                <iframe
                  title="Lokasi SMK Telkom Sidoarjo"
                  src="https://maps.google.com/maps?q=SMK%20Telkom%20Sidoarjo&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-red-100 text-[#bc0c11]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span className="font-jakarta text-xs font-medium text-slate-600">SMK Telkom Sidoarjo</span>
                  <button
                    type="button"
                    onClick={() => setMapLoaded(true)}
                    className="mt-1 text-[11px] font-semibold text-[#bc0c11] hover:underline cursor-pointer"
                  >
                    Muat Peta Interaktif
                  </button>
                </div>
              )}
              <div className="absolute top-2 left-2 rounded bg-white/95 px-2.5 py-1 text-xs font-medium text-[#1557b0] shadow-sm backdrop-blur-sm z-10">
                <a
                  href="https://maps.google.com/maps?q=SMK+Telkom+Sidoarjo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>{t("footer.openMaps")}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Lomba & Mitra Kolaborasi Section */}
        <div className="mt-14 pt-8 border-t border-slate-200/80">
          {/* Logos Row - directly spanning left to right, no animation */}
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 sm:gap-8 md:gap-10 w-full">
            {LOMBA_LOGOS.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center"
                title={logo.name}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className={logo.className}
                />
              </div>
            ))}
          </div>

          {/* Bottom Bar: Copyright & School Tagline */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4a5565]">
            <p className="font-jakarta text-center sm:text-left">
              {t("footer.rights")}
            </p>
            <p className="font-jakarta text-[11px] text-slate-400 text-center sm:text-right">
              SMK Telkom Sidoarjo - The Real School of Future Digital Talents
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
