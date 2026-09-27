"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface PageHeroSectionProps {
  breadcrumbs: BreadcrumbItem[];
  titlePrefix?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  titleHighlightColor?: string;
  showAccentBar?: boolean;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  studentImage: string;
  studentAlt: string;
  bgShape?: string;
  imagePosition?: "left" | "right";
  isIntegratedArtwork?: boolean;
  imageContainerClassName?: string;
  imageClassName?: string;
  imageColSpan?: string;
  textColSpan?: string;
  sectionPaddingClassName?: string;
  gridAlignmentClassName?: string;
  textJustifyClassName?: string;
  titleClassName?: string;
  titleHighlightClassName?: string;
}

export default function PageHeroSection({
  breadcrumbs,
  titlePrefix = "",
  titleHighlight = "",
  titleSuffix = "",
  titleHighlightColor = "text-[#e7000b]",
  showAccentBar = true,
  description,
  ctaText = "Jelajahi",
  ctaHref,
  onCtaClick,
  studentImage,
  studentAlt,
  bgShape,
  imagePosition = "right",
  isIntegratedArtwork = true,
  imageContainerClassName,
  imageClassName = "",
  imageColSpan,
  textColSpan,
  sectionPaddingClassName,
  gridAlignmentClassName,
  textJustifyClassName,
  titleClassName,
  titleHighlightClassName,
}: PageHeroSectionProps) {
  const isImageRight = imagePosition === "right";
  const resolvedImageColSpan =
    imageColSpan || (isIntegratedArtwork ? "lg:col-span-6" : "lg:col-span-5");
  const resolvedTextColSpan =
    textColSpan || (isIntegratedArtwork ? "lg:col-span-6" : "lg:col-span-7");

  const handleScrollToHash = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (hash.startsWith("#")) {
      e.preventDefault();
      const targetId = hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const ctaButtonClasses =
    "group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] px-7 py-3.5 min-h-[48px] text-white transition-all duration-300 hover:bg-[#990a0e] active:scale-[0.98] cursor-pointer select-none";

  const ctaButtonStyle = {
    boxShadow:
      "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
  };

  const ctaButtonInner = (
    <>
      <span className="font-jakarta font-medium text-[15px] leading-none whitespace-nowrap">
        {ctaText}
      </span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-transform duration-300 group-hover:translate-x-1 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );

  return (
    <section
      className={`relative w-full ${
        sectionPaddingClassName || "pt-32 sm:pt-36 lg:pt-40 pb-16 lg:pb-24"
      } bg-[#f8f9fb] overflow-hidden`}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 ${
            gridAlignmentClassName || "items-center"
          }`}
        >
          
          {/* Visual Artwork Column */}
          <motion.div
            initial={{ opacity: 0, x: isImageRight ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`${resolvedImageColSpan} flex items-center justify-center ${
              isImageRight ? "order-2" : "order-2 lg:order-1"
            }`}
          >
            {isIntegratedArtwork || !bgShape ? (
              <div
                className={`relative select-none flex items-center justify-center ${
                  imageContainerClassName ||
                  "w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[540px] aspect-[1.12/1]"
                }`}
              >
                <Image
                  src={studentImage}
                  alt={studentAlt}
                  fill
                  className={`object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.08)] ${imageClassName}`}
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 580px"
                />
              </div>
            ) : (
              <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-[500/470] select-none">
                {/* Background Geometric Shape */}
                <div className="absolute left-0 top-[17.23%] w-[99.6%] h-[83%] pointer-events-none z-0">
                  <Image
                    src={bgShape}
                    alt=""
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Student Photo Cutout */}
                <div className="absolute left-[20%] sm:left-[24%] top-0 w-[70%] sm:w-[66%] h-[99.57%] z-10">
                  <Image
                    src={studentImage}
                    alt={studentAlt}
                    fill
                    className="object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                    priority
                    sizes="(max-width: 768px) 300px, 460px"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Text Content Column */}
          <motion.div
            initial={{ opacity: 0, x: isImageRight ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className={`${resolvedTextColSpan} flex flex-col items-start ${
              textJustifyClassName || "justify-center"
            } ${isImageRight ? "order-1" : "order-1 lg:order-2"}`}
          >
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 mb-4 sm:mb-5 text-xs sm:text-sm font-jakarta text-[#64748b] flex-wrap"
            >
              <Link href="/" className="hover:text-[#bc0c11] transition-colors">
                Beranda
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.href + idx} className="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-[#94a3b8] shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-[#101828]" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-[#bc0c11] transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            {/* Title */}
            <div className="relative mb-5 sm:mb-6">
              <h1
                className={`font-jakarta font-bold leading-tight sm:leading-[1.2] lg:leading-[1.18] tracking-tight text-[#101828] ${
                  titleClassName || "text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px]"
                }`}
              >
                {titlePrefix && <span className="text-[#101828]">{titlePrefix} </span>}
                {titleHighlight && (
                  <span className={`${titleHighlightColor} ${titleHighlightClassName || ""}`}>
                    {titleHighlight}
                  </span>
                )}
                {titleSuffix && <span className="text-[#101828]"> {titleSuffix}</span>}
              </h1>
              {showAccentBar && (
                <div className="mt-3.5 h-[3px] w-14 bg-[#bc0c11] rounded-full" />
              )}
            </div>

            {/* Description */}
            <p className="font-jakarta text-base sm:text-lg text-[#364153] leading-relaxed max-w-xl lg:max-w-2xl mb-7 sm:mb-8 font-normal">
              {description}
            </p>

            {/* CTA Button */}
            {ctaHref ? (
              ctaHref.startsWith("#") ? (
                <a
                  href={ctaHref}
                  onClick={(e) => handleScrollToHash(e, ctaHref)}
                  className={ctaButtonClasses}
                  style={ctaButtonStyle}
                >
                  {ctaButtonInner}
                </a>
              ) : (
                <Link href={ctaHref} className={ctaButtonClasses} style={ctaButtonStyle}>
                  {ctaButtonInner}
                </Link>
              )
            ) : onCtaClick ? (
              <button
                type="button"
                onClick={onCtaClick}
                className={ctaButtonClasses}
                style={ctaButtonStyle}
              >
                {ctaButtonInner}
              </button>
            ) : null}

          </motion.div>

        </div>
      </div>
    </section>
  );
}
