"use client";

import Image from "next/image";
import Link from "next/link";
import ShareArticleWidget from "@/components/news/ShareArticleWidget";
import { NewsItem } from "@/services/news";
import { getLocalizedNewsItem } from "@/services/newsLocalization";
import { useLanguage } from "@/context/LanguageContext";

interface NewsDetailClientProps {
  news: NewsItem;
  relatedNews: NewsItem[];
}

export default function NewsDetailClient({ news, relatedNews }: NewsDetailClientProps) {
  const { lang, language, t } = useLanguage();
  const isEn = lang === "EN" || language === "en";

  const currentNews = getLocalizedNewsItem(news, isEn);
  const localizedRelated = relatedNews.map((item) => getLocalizedNewsItem(item, isEn));

  return (
    <main className="pt-24 sm:pt-28 pb-16 sm:pb-24">
      {/* Container Utama */}
      <div className="mx-auto max-w-[1040px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 sm:mb-8">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#515151] hover:text-[#bc0c11] transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{t("informasi.backToAll", "Kembali ke Semua Berita")}</span>
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-8 sm:mb-10">
          {/* Date Badge / Meta */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6a7282] mb-4">
            <svg
              width="14"
              height="14"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-[#6a7282]"
            >
              <circle
                cx="6.375"
                cy="6.375"
                r="5.125"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.75 3.875V7H8.875"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              {currentNews.dateFormatted || (isEn ? "Latest" : "Terbaru")}{" "}
              {currentNews.time ? `• ${currentNews.time} WIB` : ""}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-jakarta font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-[#101828] mb-6">
            {currentNews.title}
          </h1>

          {/* Author bar */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-200/80">
            <div className="size-10 rounded-full bg-[#bc0c11]/10 flex items-center justify-center text-[#bc0c11] font-bold text-sm">
              SK
            </div>
            <div>
              <p className="font-jakarta font-semibold text-sm text-[#101828]">
                {currentNews.author || (isEn ? "SKOMDA Public Relations" : "Humas SKOMDA")}
              </p>
              <p className="text-xs text-[#6a7282]">
                SMK Telkom Sidoarjo Official Media
              </p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full h-[280px] sm:h-[420px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md mb-10 bg-gray-200">
          <Image
            src={currentNews.image || "/images/berita/news-thumb-1.png"}
            alt={currentNews.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1040px) 100vw, 1040px"
          />
        </div>

        {/* Article Body */}
        <article className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-100 mb-14">
          {currentNews.summary && (
            <div className="p-4 sm:p-6 mb-8 bg-red-50/60 border-l-4 border-[#bc0c11] rounded-r-xl">
              <p className="font-jakarta font-medium text-base sm:text-lg leading-relaxed text-[#364153] italic">
                &ldquo;{currentNews.summary}&rdquo;
              </p>
            </div>
          )}

          <div className="font-jakarta text-[#364153] text-base sm:text-lg leading-relaxed sm:leading-8 space-y-6">
            {currentNews.content ? (
              currentNews.content.split("\n\n").map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <p>{currentNews.summary || currentNews.title}</p>
            )}
          </div>

          {/* Share Widget */}
          <ShareArticleWidget slug={currentNews.slug} />
        </article>

        {/* Berita Terkait / Rekomendasi */}
        {localizedRelated.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828]">
                {t("informasi.relatedNews", "Berita Terkait Lainnya")}
              </h3>
              <Link
                href="/berita"
                className="text-sm font-semibold text-[#bc0c11] hover:underline"
              >
                {isEn ? "View All" : "Lihat Semua"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {localizedRelated.map((item) => (
                <article
                  key={item.id || item.slug}
                  className="neu-card-interactive rounded-[18px] p-3 pb-4 flex flex-col group"
                >
                  <Link
                    href={`/berita/${item.slug}`}
                    className="block relative h-[160px] w-full rounded-[12px] overflow-hidden bg-gray-100 mb-3 cursor-pointer"
                  >
                    <Image
                      src={item.image || "/images/berita/news-thumb-1.png"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </Link>
                  <Link href={`/berita/${item.slug}`}>
                    <h4 className="font-jakarta font-bold text-sm text-[#101828] line-clamp-2 group-hover:text-[#bc0c11] transition-colors mb-2">
                      {item.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-[#6a7282] mt-auto">
                    {item.dateFormatted} • {item.time}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
