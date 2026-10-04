"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AdminSelect from "@/components/admin/AdminSelect";
import {
  NewsItem,
  NEWS_CATEGORIES,
  getAdminNewsList,
  createNews,
  updateNews,
  deleteNews,
} from "@/services/news";

export default function AdminBeritaPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Kegiatan Sekolah",
    summary: "",
    content: "",
    image: "/images/berita/news-thumb-1.png",
    author: "Humas SKOMDA",
    status: "published" as "published" | "draft",
  });

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminNewsList({ status: "semua" });
      setNewsList(data);
    } catch {
      showToast("Gagal memuat daftar berita dari backend", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      category: "Kegiatan Sekolah",
      summary: "",
      content: "",
      image: "/images/berita/news-thumb-1.png",
      author: "Humas SKOMDA",
      status: "published",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      summary: item.summary || "",
      content: item.content || "",
      image: item.image || "/images/berita/news-thumb-1.png",
      author: item.author || "Humas SKOMDA",
      status: (item.status as "published" | "draft") || "published",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Judul berita wajib diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem && editingItem.id) {
        const res = await updateNews(editingItem.id, formData);
        if (res.success) {
          showToast("Berita berhasil diperbarui di database!");
          setIsModalOpen(false);
          await loadNews();
        } else {
          showToast(res.error || "Gagal memperbarui berita", "error");
        }
      } else {
        const res = await createNews(formData);
        if (res.success) {
          showToast("Berita baru berhasil ditambahkan ke database!");
          setIsModalOpen(false);
          await loadNews();
        } else {
          showToast(res.error || "Gagal membuat berita", "error");
        }
      }
    } catch {
      showToast("Terjadi kesalahan saat menyimpan berita", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: NewsItem) => {
    if (!item.id) {
      showToast("ID berita tidak ditemukan", "error");
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus berita:\n"${item.title}"?\n\nData akan dihapus dari sistem.`
    );
    if (!confirmed) return;

    try {
      const res = await deleteNews(item.id);
      if (res.success) {
        showToast("Berita berhasil dihapus!");
        await loadNews();
      } else {
        showToast(res.error || "Gagal menghapus berita", "error");
      }
    } catch {
      showToast("Terjadi kesalahan saat menghapus berita", "error");
    }
  };

  // Filter list
  const filteredList = newsList.filter((item) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        (item.summary && item.summary.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q));
      if (!match) return false;
    }
    // Category filter
    if (selectedCategory !== "Semua") {
      if (item.category !== selectedCategory) return false;
    }
    // Status filter
    if (statusFilter === "published" && item.status === "draft") return false;
    if (statusFilter === "draft" && item.status !== "draft") return false;

    return true;
  });

  return (
    <AdminLayout
      title="Manajemen Berita & Artikel"
      subtitle="Kelola publikasi berita, pengumuman, dan artikel resmi sekolah"
      actions={
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Tulis Berita Baru</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl transition-all ${
              toastMessage.type === "success"
                ? "bg-slate-900 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="size-5 text-emerald-400" />
            ) : (
              <AlertCircle className="size-5 text-white" />
            )}
            <span className="text-xs font-bold">{toastMessage.text}</span>
          </div>
        )}

        {/* Filter & Actions Bar */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100/90 p-1 shrink-0 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua ({newsList.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === "published"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Terbit ({newsList.filter((n) => n.status !== "draft").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("draft")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                statusFilter === "draft"
                  ? "bg-white text-amber-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Draf ({newsList.filter((n) => n.status === "draft").length})
            </button>
          </div>

          {/* Search, Category, and Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 xl:justify-end">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, ringkasan, atau penulis..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
              />
            </div>

            <div className="w-full sm:w-48">
              <AdminSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={NEWS_CATEGORIES}
                icon={Filter}
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="size-4" />
              <span>Tulis Berita Baru</span>
            </button>
          </div>
        </div>

        {/* News Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="mx-auto size-12 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">
                Tidak ada berita yang ditemukan
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Coba sesuaikan kata kunci pencarian atau saringan kategori Anda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-6 pr-3">Berita</th>
                    <th className="px-3 py-3.5">Kategori</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-3 py-3.5">Tanggal & Penulis</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredList.map((item) => (
                    <tr
                      key={item.id || item.slug}
                      className="group hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Image & Title */}
                      <td className="py-4 pl-6 pr-3 min-w-[280px] max-w-[400px]">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80">
                            <Image
                              src={item.image || "/images/berita/news-thumb-1.png"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 line-clamp-2 leading-snug">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                              /{item.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-3 py-4 whitespace-nowrap text-slate-700 font-medium">
                        {item.category}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            item.status === "draft"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {item.status === "draft" ? "Draf" : "Terbit"}
                        </span>
                      </td>

                      {/* Date & Author */}
                      <td className="px-3 py-4 whitespace-nowrap text-slate-500">
                        <p className="font-semibold text-slate-700">
                          {item.dateFormatted || "Hari ini"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Oleh {item.author || "Humas SKOMDA"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View public link */}
                          <Link
                            href={`/berita/${item.slug}`}
                            target="_blank"
                            title="Lihat Halaman Publik"
                            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          >
                            <ExternalLink className="size-4" />
                          </Link>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            title="Sunting Berita"
                            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="size-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            title="Hapus Berita"
                            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form Tambah / Edit Berita */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6">
          <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Pinned Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5 shrink-0 bg-white">
              <h2 className="text-lg font-bold text-slate-900 font-poppins">
                {editingItem ? "Sunting Data Berita" : "Tulis Berita Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Form Body with Custom Scrollbar */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto admin-modal-scrollbar px-6 sm:px-8 py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Berita <span className="text-[#bc0c11]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan judul berita lengkap..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <AdminSelect
                      label="Kategori"
                      required
                      value={formData.category}
                      onChange={(cat) => setFormData({ ...formData, category: cat })}
                      options={NEWS_CATEGORIES.filter((c) => c !== "Semua")}
                    />
                  </div>

                  <div>
                    <AdminSelect
                      label="Status Publikasi"
                      value={formData.status}
                      onChange={(st) =>
                        setFormData({
                          ...formData,
                          status: st as "published" | "draft",
                        })
                      }
                      options={[
                        { value: "published", label: "Terbit (Publik)" },
                        { value: "draft", label: "Draf (Tersimpan)" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Penulis / Redaksi
                    </label>
                    <input
                      type="text"
                      placeholder="Humas SKOMDA"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <ImageUploadField
                    label="Foto Thumbnail / Cover Berita"
                    value={formData.image || ""}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    folder="skomda/news"
                    recommendedSize="Format JPG, PNG, atau WebP (Maks 5MB). Rasio foto 16:9 disarankan."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ringkasan Singkat (Lead Paragraph)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ringkasan 1-2 kalimat untuk preview card..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full custom-scrollbar resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Isi Konten Artikel Lengkap
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tuliskan isi berita lengkap di sini (pisahkan paragraf dengan enter ganda)..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full custom-scrollbar resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/70 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#bc0c11] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#990a0e] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting
                    ? "Menyimpan ke Database..."
                    : editingItem
                    ? "Simpan Perubahan"
                    : "Terbitkan Berita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
