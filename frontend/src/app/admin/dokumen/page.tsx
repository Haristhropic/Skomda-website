"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSelect from "@/components/admin/AdminSelect";
import DocumentUploadField from "@/components/admin/DocumentUploadField";
import {
  DocumentItem,
  getAdminDocumentList,
  createDocument,
  updateDocument,
  deleteDocument,
  getActiveBrochure,
  setActiveBrochure,
} from "@/services/documents";

const DOCUMENT_CATEGORIES = [
  "Semua",
  "Brosur PPDB",
  "Unduh Informasi",
  "Dokumen K3",
  "Kurikulum",
];

const FILE_FORMATS = [
  "PDF",
  "DOCX",
  "XLSX",
  "ZIP",
  "RAR",
];

export default function AdminDokumenPage() {
  const [list, setList] = useState<DocumentItem[]>([]);
  const [activeBrochure, setActiveBrochureState] = useState<DocumentItem | null>(null);
  const [isSettingActive, setIsSettingActive] = useState(false);
  const [setAsActiveBrochure, setSetAsActiveBrochure] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DocumentItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [form, setForm] = useState<DocumentItem>({
    title: "",
    category: "Unduh Informasi",
    fileUrl: "",
    fileSize: "",
    fileType: "PDF",
    description: "",
    isPublic: true,
    orderIndex: 0,
  });

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [data, brochure] = await Promise.all([
        getAdminDocumentList(),
        getActiveBrochure(),
      ]);
      setList(data);
      setActiveBrochureState(brochure);
    } catch {
      showToast("Gagal memuat dokumen", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = (categoryDefault = "Unduh Informasi", makeActive = false) => {
    setEditingItem(null);
    setForm({
      title: categoryDefault === "Brosur PPDB" ? "Brosur Resmi PPDB SMK Telkom Sidoarjo" : "",
      category: categoryDefault,
      fileUrl: "",
      fileSize: "",
      fileType: "PDF",
      description: categoryDefault === "Brosur PPDB" ? "Informasi lengkap alur pendaftaran, program keahlian, beasiswa, dan rincian biaya PPDB." : "",
      isPublic: true,
      orderIndex: list.length + 1,
    });
    setSetAsActiveBrochure(makeActive);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DocumentItem) => {
    setEditingItem(item);
    setForm({ ...item });
    const isCurrentActive =
      activeBrochure &&
      ((item.id && activeBrochure.id && String(item.id) === String(activeBrochure.id)) ||
        item.fileUrl === activeBrochure.fileUrl);
    setSetAsActiveBrochure(!!isCurrentActive);
    setIsModalOpen(true);
  };

  const handleMakeActiveBrochure = async (item: DocumentItem) => {
    if (!item.id) return;
    setIsSettingActive(true);
    try {
      const res = await setActiveBrochure(item.id);
      if (res.success) {
        showToast(`"${item.title}" berhasil dijadikan Brosur Utama PPDB!`);
        await loadData();
      } else {
        showToast(res.error || "Gagal menetapkan brosur utama", "error");
      }
    } catch {
      showToast("Terjadi gangguan server", "error");
    } finally {
      setIsSettingActive(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.fileUrl.trim()) {
      showToast("Judul dan tautan berkas wajib diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let savedDocId: number | string | undefined;
      if (editingItem && editingItem.id) {
        const res = await updateDocument(editingItem.id, form);
        if (res.success) {
          savedDocId = editingItem.id;
          showToast("Dokumen berhasil diperbarui");
        } else {
          showToast(res.error || "Gagal memperbarui", "error");
          return;
        }
      } else {
        const res = await createDocument(form);
        if (res.success) {
          savedDocId = res.data?.id;
          showToast("Dokumen baru berhasil disimpan");
        } else {
          showToast(res.error || "Gagal menambahkan", "error");
          return;
        }
      }

      // Jika dicentang untuk dijadikan brosur utama PPDB
      if (setAsActiveBrochure && savedDocId) {
        await setActiveBrochure(savedDocId);
      }

      setIsModalOpen(false);
      await loadData();
    } catch {
      showToast("Terjadi gangguan server", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: DocumentItem) => {
    if (!item.id) return;
    if (!window.confirm(`Hapus berkas "${item.title}"?`)) return;

    try {
      const res = await deleteDocument(item.id);
      if (res.success) {
        showToast("Dokumen berhasil dihapus");
        await loadData();
      }
    } catch {
      showToast("Gagal menghapus", "error");
    }
  };

  const filtered = list.filter((d) => {
    if (selectedCategory !== "Semua" && d.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        d.fileUrl.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AdminLayout
      title="Dokumen & Regulasi K3"
      subtitle="Kelola berkas unduhan publik, brosur PPDB, SOP keselamatan kerja, dan kurikulum"
      actions={
        <button
          type="button"
          onClick={() => handleOpenAdd()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Unggah Dokumen</span>
        </button>
      }
    >
      <div className="space-y-6">
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl transition-all ${
              toastMessage.type === "success" ? "bg-slate-900 text-white" : "bg-red-600 text-white"
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
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul dokumen, berkas, atau keterangan..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="w-full sm:w-60">
              <AdminSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={DOCUMENT_CATEGORIES}
                icon={Filter}
              />
            </div>

            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="size-4" />
              <span>Unggah Dokumen Baru</span>
            </button>
          </div>
        </div>

        {/* Document Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">
              <FileCheck className="mx-auto size-12 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">
                Belum ada dokumen tersimpan atau sesuai pencarian
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Silakan tambahkan berkas dokumen publik baru atau sesuaikan filter pencarian.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-6 pr-3">Judul Berkas</th>
                    <th className="px-3 py-3.5">Kategori</th>
                    <th className="px-3 py-3.5">Format & Ukuran</th>
                    <th className="px-3 py-3.5">Visibilitas</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => {
                    const isCurrentActive =
                      activeBrochure &&
                      ((item.id && activeBrochure.id && String(item.id) === String(activeBrochure.id)) ||
                        item.fileUrl === activeBrochure.fileUrl);
                    const isBrochureLike =
                      item.category === "Brosur PPDB" ||
                      item.title.toLowerCase().includes("brosur") ||
                      item.category === "Unduh Informasi";

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 pl-6 pr-3 min-w-[240px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-slate-900">{item.title}</p>
                            {isCurrentActive && (
                              <span className="inline-flex items-center rounded-full bg-red-100 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold text-[#bc0c11]">
                                Brosur Utama PPDB
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-sm">
                            {item.fileUrl}
                          </p>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-slate-700 font-medium">
                          {item.category}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-slate-600 font-semibold">
                          {item.fileType || "PDF"} • {item.fileSize || "1.5 MB"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                            Publik
                          </span>
                        </td>
                        <td className="py-4 pl-3 pr-6 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isBrochureLike && !isCurrentActive && (
                              <button
                                type="button"
                                onClick={() => handleMakeActiveBrochure(item)}
                                disabled={isSettingActive}
                                title="Jadikan Brosur Utama PPDB"
                                className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-red-50 hover:text-[#bc0c11] transition-colors cursor-pointer"
                              >
                                <span>Jadikan Brosur Utama</span>
                              </button>
                            )}
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form with Custom Scrollbar and Pinned Header/Footer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6">
          <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Pinned Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5 shrink-0 bg-white">
              <h2 className="text-lg font-bold text-slate-900 font-poppins">
                {editingItem ? "Sunting Dokumen" : "Unggah Dokumen Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Form Body with Custom Scrollbar */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto admin-modal-scrollbar px-6 sm:px-8 py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Dokumen <span className="text-[#bc0c11]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Brosur Resmi PPDB SKOMDA 2026/2027"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <AdminSelect
                      label="Kategori Berkas"
                      value={form.category}
                      onChange={(cat) => setForm({ ...form, category: cat })}
                      options={DOCUMENT_CATEGORIES.filter((c) => c !== "Semua")}
                    />
                  </div>

                  <div>
                    <AdminSelect
                      label="Format Berkas"
                      value={form.fileType || "PDF"}
                      onChange={(val) => setForm({ ...form, fileType: val })}
                      options={FILE_FORMATS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ukuran Berkas
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 2.4 MB"
                      value={form.fileSize || ""}
                      onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Urutan Tampil
                    </label>
                    <input
                      type="number"
                      value={form.orderIndex ?? 0}
                      onChange={(e) => setForm({ ...form, orderIndex: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <DocumentUploadField
                    label="Berkas Dokumen"
                    fileUrl={form.fileUrl}
                    fileSize={form.fileSize}
                    fileType={form.fileType}
                    required
                    folder="skomda/documents"
                    onChange={({ fileUrl, fileSize, fileType, originalName }) => {
                      setForm((prev) => {
                        let newTitle = prev.title;
                        // Auto-fill title jika masih kosong dari nama berkas
                        if (!newTitle.trim() && originalName) {
                          const cleanName = originalName
                            .replace(/\.[^/.]+$/, "")
                            .replace(/[-_]+/g, " ")
                            .trim();
                          newTitle =
                            cleanName.charAt(0).toUpperCase() +
                            cleanName.slice(1);
                        }
                        return {
                          ...prev,
                          fileUrl,
                          fileSize: fileSize || prev.fileSize,
                          fileType: fileType || prev.fileType,
                          title: newTitle,
                        };
                      });
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Keterangan Singkat
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Uraikan isi ringkas dokumen, target pengguna, atau catatan penting..."
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full custom-scrollbar resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                {/* Opsi Tetapkan Sebagai Brosur Utama PPDB */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50/60 border border-red-200">
                  <input
                    type="checkbox"
                    id="set-as-active-brochure"
                    checked={setAsActiveBrochure}
                    onChange={(e) => setSetAsActiveBrochure(e.target.checked)}
                    className="mt-0.5 size-4 rounded text-[#bc0c11] focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="set-as-active-brochure" className="text-xs text-slate-700 cursor-pointer select-none">
                    <span className="font-bold block text-slate-900">Tetapkan sebagai Brosur Utama PPDB</span>
                    Berkas ini akan otomatis tampil saat pengunjung mengklik tombol &quot;Lihat Brosur&quot; di halaman PPDB.
                  </label>
                </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 sm:px-8 py-4 bg-slate-50/70 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#990a0e] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Dokumen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
