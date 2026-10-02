"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  Clock,
  MessageCircle,
  Download,
  Ticket,
  GraduationCap,
  Sparkles,
  School,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  TrialClassParticipant,
  getTrialClassParticipants,
  updateTrialClassParticipant,
  deleteTrialClassParticipant,
} from "@/services/trialClass";

export default function AdminTrialClassPage() {
  const [participants, setParticipants] = useState<TrialClassParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getTrialClassParticipants({
        q: searchQuery,
        major: selectedMajor,
        status: selectedStatus,
      });
      setParticipants(res.data);
    } catch {
      showToast("Gagal memuat data pendaftar", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMajor, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await updateTrialClassParticipant(id, { status: newStatus });
    if (res.success) {
      setParticipants((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      showToast("Status pendaftar berhasil diperbarui");
    } else {
      showToast(res.error || "Gagal memperbarui status", "error");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus pendaftaran ${name}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    const res = await deleteTrialClassParticipant(id);
    if (res.success) {
      setParticipants((prev) => prev.filter((item) => item.id !== id));
      showToast(`Pendaftar ${name} berhasil dihapus`);
    } else {
      showToast(res.error || "Gagal menghapus pendaftar", "error");
    }
  };

  // Quick stats
  const stats = useMemo(() => {
    const total = participants.length;
    const sija = participants.filter((p) => p.major.toUpperCase().includes("SIJA")).length;
    const tjat = participants.filter((p) => p.major.toUpperCase().includes("TJAT")).length;
    const verified = participants.filter((p) => p.status === "verified" || p.status === "attended").length;
    return { total, sija, tjat, verified };
  }, [participants]);

  const exportCSV = () => {
    if (participants.length === 0) {
      showToast("Tidak ada data untuk diekspor", "error");
      return;
    }

    const headers = ["ID", "Kode Tiket", "Nama Lengkap", "Asal Sekolah", "WhatsApp", "Email", "Pilihan Jurusan", "Status", "Waktu Daftar"];
    const rows = participants.map((p) => [
      p.id,
      p.ticketCode,
      `"${p.fullName.replace(/"/g, '""')}"`,
      `"${p.schoolOrigin.replace(/"/g, '""')}"`,
      `'${p.whatsapp}`,
      `"${p.email || ""}"`,
      `"${p.major}"`,
      p.status,
      `"${new Date(p.createdAt).toLocaleString("id-ID")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pendaftar-trial-class-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Data pendaftar berhasil diunduh (CSV)");
  };

  return (
    <AdminLayout
      title="Pendaftar Trial Class & Virtual Class"
      subtitle="Kelola dan pantau seluruh siswa yang telah mendaftar ke sesi Trial Class dan Virtual Class SKOMDA."
      actions={
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer whitespace-nowrap"
        >
          <Download className="size-4" />
          <span>Ekspor CSV</span>
        </button>
      }
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
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

      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Pendaftar
              </span>
              <div className="size-9 rounded-xl bg-red-50 text-[#bc0c11] flex items-center justify-center">
                <Ticket className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
              <span className="text-xs text-slate-500 ml-2">peserta</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Peminatan SIJA
              </span>
              <div className="size-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900">{stats.sija}</span>
              <span className="text-xs text-slate-500 ml-2">peserta</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Peminatan TJAT
              </span>
              <div className="size-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <GraduationCap className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900">{stats.tjat}</span>
              <span className="text-xs text-slate-500 ml-2">peserta</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Terverifikasi / Hadir
              </span>
              <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900">{stats.verified}</span>
              <span className="text-xs text-slate-500 ml-2">peserta</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, tiket, asal SMP, atau nomor WhatsApp..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] transition-all"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Jurusan */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="size-3.5 text-slate-400" />
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 cursor-pointer"
              >
                <option value="Semua">Semua Jurusan</option>
                <option value="SIJA">SIJA (4 Tahun)</option>
                <option value="TJAT">TJAT (3 Tahun)</option>
              </select>
            </div>

            {/* Filter Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="registered">Registered</option>
              <option value="verified">Verified</option>
              <option value="attended">Attended</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">No. Tiket</th>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">Asal SMP / MTs</th>
                  <th className="py-3.5 px-4">Peminatan</th>
                  <th className="py-3.5 px-4">WhatsApp & Email</th>
                  <th className="py-3.5 px-4">Tanggal Daftar</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="size-6 rounded-full border-2 border-[#bc0c11] border-t-transparent animate-spin" />
                        <span className="text-xs">Memuat data pendaftar...</span>
                      </div>
                    </td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Users className="size-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs sm:text-sm font-medium">Belum ada pendaftar Trial Class</p>
                      <p className="text-[11px] text-slate-400 mt-1">Data pendaftar akan muncul otomatis ketika pengunjung mengisi formulir di halaman Trial Class.</p>
                    </td>
                  </tr>
                ) : (
                  participants.map((item) => {
                    const waClean = item.whatsapp.replace(/\D/g, "");
                    const waUrl = waClean.startsWith("0")
                      ? `https://wa.me/62${waClean.slice(1)}`
                      : `https://wa.me/${waClean}`;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Tiket */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#bc0c11] whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-100 text-xs">
                            {item.ticketCode}
                          </span>
                        </td>

                        {/* Nama */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{item.fullName}</div>
                          {item.notes && (
                            <span className="text-[11px] text-slate-400 line-clamp-1">{item.notes}</span>
                          )}
                        </td>

                        {/* Asal SMP */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <School className="size-3.5 text-slate-400 shrink-0" />
                            <span>{item.schoolOrigin}</span>
                          </div>
                        </td>

                        {/* Jurusan */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              item.major.toUpperCase().includes("SIJA")
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}
                          >
                            {item.major}
                          </span>
                        </td>

                        {/* Kontak */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium hover:underline text-xs"
                              title="Chat WhatsApp"
                            >
                              <MessageCircle className="size-3.5" />
                              <span>{item.whatsapp}</span>
                            </a>
                          </div>
                          {item.email && (
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.email}</div>
                          )}
                        </td>

                        {/* Waktu Daftar */}
                        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                              item.status === "verified"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.status === "attended"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            <option value="registered">Registered</option>
                            <option value="verified">Verified</option>
                            <option value="attended">Attended</option>
                          </select>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.fullName)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hapus Peserta"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
