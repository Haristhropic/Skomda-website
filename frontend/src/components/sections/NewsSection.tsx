"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  NewsItem,
  MOCK_NEWS,
  NEWS_CATEGORIES,
  NewsCategory,
  getNewsList,
} from "@/services/news";
import { getLocalizedNewsItem } from "@/services/newsLocalization";
import { useLanguage } from "@/context/LanguageContext";
import { getNewsImageUrl } from "@/lib/cloudinary";

interface NewsSectionProps {
  showTitle?: boolean;
}

export default function NewsSection({ showTitle = true }: NewsSectionProps) {
  const { t, isEn } = useLanguage();
  const [newsData, setNewsData] = useState<NewsItem[]>(MOCK_NEWS);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("Semua");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const itemsPerPage = 6;

  const getCategoryLabel = (cat: NewsCategory) => {
    if (!isEn) return cat;
    switch (cat) {
      case "Semua":
        return "All";
      case "Prestasi":
        return "Achievements";
      case "Kegiatan Sekolah":
        return "School Activities";
      case "Pengumuman":
        return "Announcements";
      case "Artikel & Edukasi":
        return "Articles & Education";
      default:
        return cat;
    }
  };

  // Fetch live news from API when activeCategory changes
  useEffect(() => {
    let isMounted = true;
    const fetchLiveNews = async () => {
      setIsLoading(true);
      try {
        const liveItems = await getNewsList({
          category: activeCategory === "Semua" ? undefined : activeCategory,
        });
        if (isMounted) {
          setNewsData(liveItems);
        }
      } catch (err) {
        console.warn("Failed to fetch live news:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLiveNews();
    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  // Filter news based on active category locally (if data contains all)
  const filteredNews = useMemo(() => {
    if (activeCategory === "Semua") {
      return newsData;
    }
    return newsData.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory, newsData]);

  const totalPages = Math.max(
    1,
    Math.ceil((filteredNews.length > 0 ? filteredNews.length : 1) / itemsPerPage)
  );

  // Current page items
  const currentNews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    if (filteredNews.length === 0) return [];
    if (filteredNews.length <= itemsPerPage) {
      return filteredNews;
    }
    return filteredNews.slice(start, start + itemsPerPage);
  }, [filteredNews, currentPage, itemsPerPage]);

  const handleCategoryChange = (category: NewsCategory) => {
    if (category === activeCategory) return;
    setIsTransitioning(true);
    setActiveCategory(category);
    setCurrentPage(1);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <section
      id="informasi"
      className="w-full bg-[#f3f4f6] pt-8 sm:pt-12 lg:pt-8 pb-12 sm:pb-20 lg:pb-28 scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* 1. Header */}
        {showTitle && (
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8 lg:mb-10">
            <div className="flex flex-col items-center gap-1 sm:gap-2 w-full">
              <h2 className="font-jakarta font-bold text-2xl sm:text-[32px] leading-tight sm:leading-[40px] text-[#101828]">
                {t("news.title1")}
              </h2>
              <h3 className="font-jakarta font-bold text-3xl sm:text-[46px] leading-tight sm:leading-[40px] text-[#bc0c11]">
                {t("news.title2")}
              </h3>
            </div>
            {/* Red Accent Line */}
            <div className="section-title-line" />
            <p className="font-jakarta font-medium text-sm sm:text-[14px] leading-relaxed sm:leading-[28px] text-[#515151] max-w-[434px]">
              {t("news.subtitle")}
            </p>
          </div>
        )}

        {/* Two-Column Layout: Sidebar + News Grid & Pagination */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* 2. Category Filter */}
          <aside className="w-full lg:w-[280px] shrink-0">
            {/* Desktop Vertical Sidebar */}
            <div className="hidden lg:flex flex-col gap-1 w-full">
              <div className="px-2.5 py-2 mb-1" data-node-id="125:456">
                <h3
                  className="font-jakarta font-bold text-[20px] leading-[28px] text-[#101828]"
                  data-node-id="123:11"
                >
                  {t("news.categoryTitle")}
                </h3>
              </div>

              <div
                className="flex flex-col gap-[3px] w-full"
                data-node-id="125:300"
              >
                {NEWS_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`group relative w-full h-[38px] px-3.5 rounded-[10px] flex items-center justify-between font-jakarta text-[15px] font-medium transition-colors duration-150 select-none text-left cursor-pointer ${
                        isActive
                          ? "bg-[rgba(188,12,17,0.98)] text-white shadow-sm font-semibold"
                          : "text-[#364153] hover:text-[#bc0c11] hover:bg-white/80 active:bg-gray-100"
                      }`}
                    >
                      <span className="truncate pr-2">{getCategoryLabel(cat)}</span>
                      <span
                        className={`shrink-0 transition-opacity duration-150 ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-40"
                        }`}
                      >
                        <svg
                          width="7"
                          height="12"
                          viewBox="0 0 8 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={
                            isActive ? "stroke-white" : "stroke-current"
                          }
                        >
                          <path
                            d="M1 1L6.657 6.657L1 12.314"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile & Tablet Horizontal Scrollable Pills */}
            <div className="lg:hidden w-full">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-jakarta font-bold text-lg text-[#101828]">
                  {isEn ? "News Categories" : "Kategori Berita"}
                </h3>
                <span className="text-xs text-[#4b5563] font-medium">
                  {filteredNews.length} {isEn ? "Articles" : "Berita"}
                </span>
              </div>
              <div className="neu-filter-container">
                {NEWS_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={isActive ? "neu-pill-active" : "neu-pill"}
                    >
                      <span>{getCategoryLabel(cat)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* 3. News Grid & Pagination */}
          <div className="flex-1 w-full flex flex-col gap-10">
            {/* 3x2 News Cards Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 lg:gap-x-5 gap-y-6 lg:gap-y-7 transition-opacity duration-150 ${
                isTransitioning || isLoading ? "opacity-40" : "opacity-100"
              }`}
              data-node-id="125:467"
            >
              {currentNews.length > 0 ? (
                currentNews.map((rawItem) => {
                  const item = getLocalizedNewsItem(rawItem, isEn);
                  return (
                    <article
                      key={item.id || item.slug}
                      className="neu-card-interactive rounded-[18px] p-3 flex flex-col gap-1 group"
                      data-node-id="125:321"
                    >
                    {/* Thumbnail with Date Badge (Clickable Link) */}
                    <Link
                      href={`/berita/${item.slug}`}
                      className="block relative h-[192px] w-full rounded-[12px] overflow-hidden bg-gray-100 cursor-pointer"
                      data-node-id="123:82"
                    >
                      <Image
                        src={getNewsImageUrl(item.image || "/images/berita/news-thumb-1.png")}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Top-Right Red Date Badge */}
                      <div
                        className="absolute top-0 right-0 bg-[rgba(188,12,17,0.98)] w-[53px] h-[60px] rounded-bl-[15px] rounded-tr-[10px] flex flex-col items-center justify-center text-white text-center shadow-sm pointer-events-none"
                        data-node-id="125:318"
                      >
                        <span className="font-poppins font-medium text-[16px] leading-[16px]">
                          {item.day || "24"}
                        </span>
                        <span className="font-poppins font-medium text-[16px] leading-[16px] uppercase tracking-wide">
                          {item.month || "MEI"}
                        </span>
                      </div>
                    </Link>

                    {/* Card Body */}
                    <div className="flex flex-col gap-1 pt-1">
                      {/* Title */}
                      <div className="p-[10px] pb-0">
                        <Link href={`/berita/${item.slug}`}>
                          <h4
                            className="font-jakarta font-bold text-[14px] leading-[17.5px] text-[#101828] line-clamp-3 min-h-[52px] group-hover:text-[#bc0c11] transition-colors"
                            data-node-id="123:85"
                          >
                            {item.title}
                          </h4>
                        </Link>
                      </div>

                      {/* Date & Time */}
                      <div
                        className="p-[10px] pt-1 flex items-center gap-[6px] text-[#4b5563]"
                        data-node-id="125:312"
                      >
                        <div className="shrink-0 size-[12px] flex items-center justify-center">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 13 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-[#4b5563]"
                          >
                            <circle
                              cx="6.375"
                              cy="6.375"
                              r="5.625"
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
                        </div>
                        <span
                          className="font-poppins font-normal text-[12px] leading-[16px]"
                          data-node-id="123:90"
                        >
                          {item.dateFormatted} • {item.time}
                        </span>
                      </div>
                    </div>
                  </article>
                  );
                })
              ) : (
                <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100">
                  <p className="font-jakarta font-semibold text-[#364153] text-base mb-1">
                    {isEn ? "No news found in this category." : "Belum ada berita untuk kategori ini."}
                  </p>
                  <p className="text-sm text-[#6a7282]">
                    {isEn
                      ? "Please select another category or return to All."
                      : "Silakan pilih kategori lain atau kembali ke kategori Semua."}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center sm:justify-between gap-2 w-full pt-4">
                {/* Previous Page Button */}
                <div className="p-[10px]" data-node-id="125:461">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`size-[48px] rounded-full flex items-center justify-center transition-all ${
                      currentPage === 1
                        ? "opacity-40 cursor-not-allowed bg-[#f0f2f5]"
                        : "neu-btn-icon cursor-pointer !size-[48px]"
                    }`}
                    aria-label="Previous page"
                    data-node-id="123:92"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 19L5 12L12 5"
                        stroke="#BC0C11"
                        strokeOpacity="0.98"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 12H5"
                        stroke="#BC0C11"
                        strokeOpacity="0.98"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Page Indicator Dots */}
                <div
                  className="flex items-center gap-[4px] sm:gap-[8px] overflow-x-auto py-2"
                  data-node-id="125:459"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => {
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className="size-[32px] sm:size-[40px] flex items-center justify-center rounded-full hover:bg-gray-200/50 transition-colors cursor-pointer"
                          aria-label={`Go to page ${pageNum}`}
                          data-node-id={`123:${97 + (pageNum - 1) * 2}`}
                        >
                          <span
                            className={`rounded-full transition-all duration-200 ${
                              isActive
                                ? "size-[12px] bg-[#bc0c11] scale-110 shadow-neu-red"
                                : "size-[8px] bg-[#99a1af] hover:bg-[#6a7282]"
                            }`}
                          />
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Next Page Button */}
                <div className="p-[10px]" data-node-id="125:460">
                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`size-[48px] rounded-full flex items-center justify-center transition-all ${
                      currentPage === totalPages
                        ? "opacity-40 cursor-not-allowed bg-[#a80a0e] text-white"
                        : "btn-primary !p-0 !min-h-[48px] !h-[48px] !w-[48px] !rounded-full cursor-pointer"
                    }`}
                    aria-label="Next page"
                    data-node-id="123:117"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 5L19 12L12 19"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
