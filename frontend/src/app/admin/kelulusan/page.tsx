"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  GraduationCap,
  Building,
  Briefcase,
  Rocket,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSelect from "@/components/admin/AdminSelect";
import {
  AlumniItem,
  ALUMNI_CATEGORIES,
  getAdminAlumniList,
  createAlumni,
  updateAlumni,
  deleteAlumni,
} from "@/services/alumni";

const ITEMS_PER_PAGE = 15;

const KATEGORI_OPTIONS = [
  { value: "Melanjutkan Studi", label: "Melanjutkan Studi (Kuliah)" },
  { value: "Bekerja", label: "Bekerja (Industri / Perusahaan)" },
  { value: "Wirausaha", label: "Wirausaha (Bisnis Mandiri)" },
  { value: "Mencari Kerja", label: "Persiapan Karir / Mencari Kerja" },
  { value: "Alumni", label: "Alumni Terdaftar" },
];

export default function AdminKelulusanPage() {
  const [alumniList, setAlumniList] = useState<AlumniItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AlumniItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<AlumniItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState<AlumniItem>({
    name: "",
    nisn: "",
    angkatan: "6",
    tahunLulus: "2024",
    tahunAjaran: "2023/2024",
    statusKelulusan: "LULUS",
    kategori: "Melanjutkan Studi",
    statusAktivitas: "Kuliah",
    keterangan: "",
    institusi: "",
    jurusan: "",
  });

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminAlumniList({
        category: selectedCategory,
        q: searchQuery,
      });
      setAlumniList(res.data);
      setTotalCount(res.total);
    } catch {
      showToast("Gagal memuat data kelulusan", "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Summary counts across all data
  const summaryCounts = useMemo(() => {
    return {
      kuliah: alumniList.filter((a) => a.kategori === "Melanjutkan Studi").length,
      bekerja: alumniList.filter((a) => a.kategori === "Bekerja").length,
      wirausaha: alumniList.filter((a) => a.kategori === "Wirausaha").length,
      persiapan: alumniList.filter((a) => a.kategori === "Mencari Kerja").length,
    };
  }, [alumniList]);

  // Paginated View
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return alumniList.slice(start, start + ITEMS_PER_PAGE);
  }, [alumniList, currentPage]);

  const totalPages = Math.ceil(alumniList.length / ITEMS_PER_PAGE) || 1;

  // Modal Handlers
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      nisn: "",
      angkatan: "6",
      tahunLulus: "2024",
      tahunAjaran: "2023/2024",
      statusKelulusan: "LULUS",
      kategori: "Melanjutkan Studi",
      statusAktivitas: "Kuliah",
      keterangan: "",
      institusi: "",
      jurusan: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AlumniItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama siswa wajib diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      // Auto-fill keterangan if left empty
      let ket = formData.keterangan;
      if (!ket.trim()) {
        if (formData.kategori === "Melanjutkan Studi" && formData.institusi) {
          ket = `Melanjutkan Pendidikan di ${formData.institusi}${formData.jurusan ? " - " + formData.jurusan : ""}`;
        } else if (formData.kategori === "Bekerja" && formData.institusi) {
          ket = `Bekerja di ${formData.institusi}${formData.jurusan ? " (" + formData.jurusan + ")" : ""}`;
        } else if (formData.kategori === "Wirausaha") {
          ket = formData.institusi ? `Wirausaha: ${formData.institusi}` : "Membuka Wirausaha Mandiri";
        } else {
          ket = `Lulusan Tahun Ajaran ${formData.tahunAjaran}`;
        }
      }

      let act = formData.statusAktivitas;
      if (formData.kategori === "Alumni" || act?.toLowerCase() === "lulus resmi") {
        act = "";
      }

      const payload = {
        ...formData,
        statusAktivitas: act,
        keterangan: ket,
      };

      if (editingItem && editingItem.id) {
        const res = await updateAlumni(editingItem.id, payload);
        if (res.success) {
          showToast("Data siswa berhasil diperbarui", "success");
          setIsModalOpen(false);
          loadData();
        } else {
          showToast(res.error || "Gagal memperbarui data siswa", "error");
        }
      } else {
        const res = await createAlumni(payload);
        if (res.success) {
          showToast("Data siswa berhasil ditambahkan", "success");
          setIsModalOpen(false);
          loadData();
        } else {
          showToast(res.error || "Gagal menambahkan data siswa", "error");
        }
      }
    } catch {
      showToast("Terjadi kesalahan sistem saat menyimpan data", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem || !deletingItem.id) return;
    setIsSubmitting(true);
    try {
      const res = await deleteAlumni(deletingItem.id);
      if (res.success) {
        showToast("Data kelulusan siswa berhasil dihapus", "success");
        setDeletingItem(null);
        loadData();
      } else {
        showToast(res.error || "Gagal menghapus data siswa", "error");
      }
    } catch {
      showToast("Terjadi kesalahan sistem saat menghapus data", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Kelulusan & Alumni">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-red-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ── Summary Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-9 rounded-xl bg-red-50 text-[#bc0c11] flex items-center justify-center">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Total Siswa</span>
          </div>
          <p className="text-2xl font-bold font-jakarta text-slate-900">{totalCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building className="size-5" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Melanjutkan Kuliah</span>
          </div>
          <p className="text-2xl font-bold font-jakarta text-slate-900">{summaryCounts.kuliah}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="size-5" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Bekerja di Industri</span>
          </div>
          <p className="text-2xl font-bold font-jakarta text-slate-900">{summaryCounts.bekerja}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Rocket className="size-5" />
            </div>
            <span className="text-xs font-semibold text-slate-500">Wirausaha Mandiri</span>
          </div>
          <p className="text-2xl font-bold font-jakarta text-slate-900">{summaryCounts.wirausaha}</p>
        </div>
      </div>

      {/* ── Control Header Bar ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, NISN, atau perguruan tinggi..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-8 text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-56 shrink-0">
            <AdminSelect
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              options={ALUMNI_CATEGORIES}
              placeholder="Filter Kategori"
              icon={Filter}
            />
          </div>
        </div>

        {/* Add Student Button */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#bc0c11] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#990a0e] transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Tambah Siswa</span>
        </button>
      </div>

      {/* ── Main Data Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 font-jakarta text-sm">
            Memuat data kelulusan siswa...
          </div>
        ) : paginatedList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-jakarta border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-14 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Siswa & NISN</th>
                  <th className="py-3.5 px-4 w-28">Status</th>
                  <th className="py-3.5 px-4">Kategori & Aktivitas</th>
                  <th className="py-3.5 px-4">Institusi / Penempatan</th>
                  <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {paginatedList.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center font-medium text-slate-400 text-xs">
                        {globalIdx}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <p className="line-clamp-1">{item.name}</p>
                        <p className="text-xs font-normal text-slate-400 mt-0.5">
                          NISN: {item.nisn || "-"} • T.A. {item.tahunAjaran}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.statusKelulusan && item.statusKelulusan.toLowerCase() !== "lulus resmi" ? (
                          <span className="text-xs font-bold text-emerald-600">
                            {item.statusKelulusan}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/70">
                          {item.kategori}
                        </span>
                        {item.statusAktivitas &&
                          item.statusAktivitas.toLowerCase() !== "lulus resmi" && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                              {item.statusAktivitas}
                            </p>
                          )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <p className="font-semibold text-slate-900 line-clamp-1">
                          {item.institusi || item.keterangan || "-"}
                        </p>
                        {item.jurusan && (
                          <p className="text-slate-400 line-clamp-1 mt-0.5">
                            {item.jurusan}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="size-8 rounded-lg border border-slate-200 text-slate-600 hover:text-[#bc0c11] hover:border-[#bc0c11] hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit data"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingItem(item)}
                            className="size-8 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                            title="Hapus data"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500 font-jakarta text-sm">
            Tidak ada data kelulusan yang sesuai dengan filter atau kata kunci.
          </div>
        )}

        {/* ── Pagination Footer ── */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-jakarta text-slate-500">
            <span>
              Menampilkan {paginatedList.length} dari {alumniList.length} siswa (Halaman {currentPage} dari {totalPages})
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-[#bc0c11] hover:text-[#bc0c11] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="size-3.5" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-[#bc0c11] hover:text-[#bc0c11] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Berikutnya</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Tambah / Edit Siswa ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-red-50 text-[#bc0c11] flex items-center justify-center">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <h3 className="font-jakarta font-bold text-base text-slate-900">
                    {editingItem ? "Edit Data Siswa Kelulusan" : "Tambah Data Siswa Baru"}
                  </h3>
                  <p className="text-xs text-slate-400">Pangkalan data resmi alumni SKOMDA</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Lengkap Siswa <span className="text-[#bc0c11]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                  placeholder="Contoh: AHMAD FADHIL FATHI"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    NISN Siswa
                  </label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Contoh: 0060001"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={formData.tahunAjaran}
                    onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                    placeholder="2023/2024"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kategori Kelulusan
                </label>
                <AdminSelect
                  value={formData.kategori}
                  onChange={(val) => setFormData({ ...formData, kategori: val })}
                  options={KATEGORI_OPTIONS}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nama Institusi / Perusahaan
                  </label>
                  <input
                    type="text"
                    value={formData.institusi || ""}
                    onChange={(e) => setFormData({ ...formData, institusi: e.target.value })}
                    placeholder="Contoh: ITS Surabaya / Telkom"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Jurusan / Posisi Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={formData.jurusan || ""}
                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                    placeholder="Contoh: S1 Teknik Informatika"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Keterangan / Aktivitas Ringkas
                </label>
                <input
                  type="text"
                  value={formData.keterangan || ""}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Kosongkan jika ingin dibuat otomatis dari institusi & jurusan"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
              </div>

              {/* Form Action Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#990a0e] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Konfirmasi Hapus ── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="size-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="size-6" />
            </div>

            <h3 className="font-bold text-base text-slate-900 mb-1">
              Hapus Data Siswa Kelulusan?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus data kelulusan untuk siswa{" "}
              <strong className="text-slate-900">{deletingItem.name}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isSubmitting}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus Siswa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
