"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TefaHeroSection from "./TefaHeroSection";
import TefaNeedSection from "./TefaNeedSection";
import TefaCatalogSection, { TefaProductItem } from "./TefaCatalogSection";
import TefaCtaBanner from "./TefaCtaBanner";

const TefaProductDetailModal = dynamic(
  () => import("./TefaProductDetailModal"),
  { ssr: false }
);

export default function TefaPageClient() {
  const [selectedProductForDetail, setSelectedProductForDetail] =
    useState<TefaProductItem | null>(null);
  const [catalogCategory, setCatalogCategory] = useState<string>("Semua");

  const handleExploreServices = () => {
    const el = document.getElementById("layanan");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategoryFromNeed = (category: string) => {
    setCatalogCategory(category);
    const el = document.getElementById("katalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewAllServices = () => {
    setCatalogCategory("Semua");
    const el = document.getElementById("katalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 1. Hero Section (Dari Kebutuhan Menjadi Solusi Nyata) */}
      <TefaHeroSection onExploreServices={handleExploreServices} />

      {/* 2. Mulai Dari Kebutuhan Anda (Apa yang bisa kami bantu? - 01-04 list + TeFa Building photo) */}
      <TefaNeedSection
        onSelectCategory={handleSelectCategoryFromNeed}
        onViewAllServices={handleViewAllServices}
      />

      {/* 3. Produk & Layanan (4 Product Cards Grid) */}
      <TefaCatalogSection
        selectedCategory={catalogCategory}
        onSelectProduct={(product) => setSelectedProductForDetail(product)}
      />

      {/* 4. Ceritakan Project Anda (Crimson Gradient CTA Banner) */}
      <TefaCtaBanner />

      {/* 5. Product Detail Modal */}
      <TefaProductDetailModal
        isOpen={Boolean(selectedProductForDetail)}
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
      />
    </>
  );
}
