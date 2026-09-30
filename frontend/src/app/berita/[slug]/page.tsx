import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NewsDetailClient from "@/components/sections/berita/NewsDetailClient";
import { getNewsBySlug, getNewsList } from "@/services/news";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generasi metadata SEO per halaman berita
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: "Berita Tidak Ditemukan",
      description: "Halaman berita yang Anda cari tidak ditemukan di SMK Telkom Sidoarjo.",
    };
  }

  return {
    title: news.title,
    description: news.summary || news.title,
    openGraph: {
      title: news.title,
      description: news.summary,
      images: [news.image || "/images/berita/news-thumb-1.png"],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  // Ambil list berita lain untuk rekomendasi "Berita Terkait"
  const allNews = await getNewsList();
  const relatedNews = allNews
    .filter((item) => item.slug !== news.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#101828] flex flex-col justify-between">
      <Navbar />
      <NewsDetailClient news={news} relatedNews={relatedNews} />
      <Footer />
    </div>
  );
}
