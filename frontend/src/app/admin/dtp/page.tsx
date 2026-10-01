"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Sparkles,
  Pencil,
  Trash2,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Code2,
  Layers,
  Wrench,
  Briefcase,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  DtpItem,
  getDtpList,
  createDtp,
  updateDtp,
  deleteDtp,
} from "@/services/dtp";
import { INITIAL_DTP_ITEMS } from "@/data/initialDtp";

export default function AdminDtpPage() {
  const [list, setList] = useState<DtpItem[]>(INITIAL_DTP_ITEMS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DtpItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [form, setForm] = useState<DtpItem>({
    title: "",
    slug: "",
    number: "01",
    category: "Software & AI",
    image: "",
    badgeText: "",
    shortDesc: "",
    fullDesc: "",
    coreSkills: "",
    supportingSkills: "",
    careerProspects: "",
    tools: "",
    orderIndex: 1,
    isActive: true,
  });

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      const data = await getDtpList();
      if (data && data.length > 0) {
        setList(data);
      }
    } catch {
      // Keep existing list
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    const nextNum = String(list.length + 1).padStart(2, "0");
    setForm({
      title: "",
      slug: "",
      number: nextNum,
      category: "Software & AI",
      image: "",
      badgeText: "",
      shortDesc: "",
      fullDesc: "",
      coreSkills: "",
      supportingSkills: "",
      careerProspects: "",
      tools: "",
      orderIndex: list.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DtpItem) => {
    setEditingItem(item);
    setForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Nama spesialisasi DTP wajib diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem && editingItem.id) {
        const res = await updateDtp(editingItem.id, form);
        if (res.success) {
          showToast("Spesialisasi DTP berhasil diperbarui");
          setIsModalOpen(false);
          await loadData();
        } else {
          showToast(res.error || "Gagal memperbarui program DTP", "error");
        }
      } else {
        const res = await createDtp(form);
        if (res.success) {
          showToast("Spesialisasi DTP baru berhasil ditambahkan");
          setIsModalOpen(false);
          await loadData();
        } else {
          showToast(res.error || "Gagal menambahkan program DTP", "error");
        }
      }
    } catch {
      showToast("Terjadi gangguan server", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: DtpItem) => {
    if (!item.id) return;
    if (!window.confirm(`Hapus spesialisasi DTP "${item.title}"?`)) return;

    try {
      const res = await deleteDtp(item.id);
      if (res.success) {
        showToast("Spesialisasi DTP berhasil dihapus");
        await loadData();
      } else {
        showToast(res.error || "Gagal menghapus program DTP", "error");
      }
    } catch {
      showToast("Gagal menghapus spesialisasi DTP", "error");
    }
  };

  const filteredList = list.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.shortDesc && item.shortDesc.toLowerCase().includes(q)) ||
        (item.coreSkills && item.coreSkills.toLowerCase().includes(q)) ||
        (item.tools && item.tools.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <AdminLayout
      title="Digital Talent Program (DTP)"
      subtitle="Kelola 9 spesialisasi keahlian teknologi, kurikulum, peralatan, serta dokumentasi visual laboratorium siswa"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : (
            <AlertCircle className="size-5 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">
            {toastMessage.text}
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Action & Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari spesialisasi DTP, skill, tools, atau kurikulum..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="size-4" />
            <span>Tambah Spesialisasi DTP</span>
          </button>
        </div>

        {/* DTP Grid Catalog */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-white border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <Sparkles className="mx-auto size-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-800">
              Belum ada data Digital Talent Program ditemukan
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Coba ubah kata kunci pencarian atau klik tombol tambah spesialisasi baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredList.map((item) => (
              <div
                key={item.id || item.slug}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all"
              >
                {/* Image Banner / Thumbnail Preview (Aspect 16/10) */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 text-slate-400 gap-1.5">
                      <Code2 className="size-8 text-slate-300" />
                      <span className="text-[11px] font-medium text-slate-400">
                        Belum ada gambar kegiatan
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#bc0c11] transition-colors">
                      {item.title}
                    </h3>
                    {item.shortDesc && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {item.shortDesc}
                      </p>
                    )}

                    {/* Skill Snippet */}
                    {item.coreSkills && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1">
                          <Layers className="size-3 text-[#bc0c11]" />
                          <span>Kurikulum Inti:</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {item.coreSkills}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Sunting"
                        className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        title="Hapus"
                        className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form Tambah / Edit DTP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6">
          <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5 shrink-0 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-[#bc0c11]">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-poppins">
                    {editingItem ? "Sunting Spesialisasi DTP" : "Tambah Spesialisasi DTP Baru"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Konfigurasi kurikulum, gambar foto, dan detail kompetensi industri
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto admin-modal-scrollbar px-6 sm:px-8 py-6 space-y-4">
                {/* Judul Spesialisasi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Spesialisasi DTP <span className="text-[#bc0c11]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Software Developer"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                {/* Image Upload Field */}
                <div>
                  <ImageUploadField
                    label="Foto Laboratorium / Kegiatan Spesialisasi"
                    value={form.image}
                    onChange={(url) => setForm({ ...form, image: url })}
                    folder="skomda/dtp-uploads"
                    recommendedSize="Disarankan rasio 16:10 atau minimal 800x500 px (Maks 10MB)"
                  />
                </div>

                {/* Deskripsi Singkat */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi Singkat (Tampil di Kartu)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ringkasan 1-2 kalimat mengenai fokus spesialisasi ini..."
                    value={form.shortDesc}
                    onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                {/* Deskripsi Lengkap */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi Lengkap (Tampil di Modal Kurikulum)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Penjelasan mendalam tentang materi dan metode pembelajaran siswa..."
                    value={form.fullDesc}
                    onChange={(e) => setForm({ ...form, fullDesc: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                {/* Core Skills & Supporting Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Kompetensi Inti (Pisah Koma)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Contoh: Algoritma, REST API, Database MySQL, Docker, Linux..."
                      value={form.coreSkills}
                      onChange={(e) => setForm({ ...form, coreSkills: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Kompetensi Pendukung (Pisah Koma)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Contoh: UI/UX Wireframing, Git Workflow, Agile Scrum..."
                      value={form.supportingSkills || ""}
                      onChange={(e) => setForm({ ...form, supportingSkills: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tools & Career Prospects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tools & Software (Pisah Koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: VS Code, GitHub, Postman, Figma, Docker"
                      value={form.tools || ""}
                      onChange={(e) => setForm({ ...form, tools: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Prospek Karier (Pisah Koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Full Stack Developer, Backend Engineer"
                      value={form.careerProspects || ""}
                      onChange={(e) => setForm({ ...form, careerProspects: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Slug URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    placeholder="Otomatis dari nama (misal: software-developer)"
                    value={form.slug || ""}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 sm:px-8 py-4 shrink-0 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  <span>{editingItem ? "Simpan Perubahan" : "Publikasikan Spesialisasi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
