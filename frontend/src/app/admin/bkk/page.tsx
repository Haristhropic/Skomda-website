"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Briefcase,
  Building,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Search,
  Check,
  Eye,
  Clock,
  User,
  Mail,
  FileText,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  Layers,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AdminSelect from "@/components/admin/AdminSelect";
import {
  BKKJobItem,
  BKKPartnerItem,
  getAdminBKKJobs,
  createBKKJob,
  updateBKKJob,
  deleteBKKJob,
  updateBKKJobStatus,
  getBKKPartners,
  createBKKPartner,
  updateBKKPartner,
  deleteBKKPartner,
} from "@/services/bkk";

const JOB_TYPES = [
  "Full-time",
  "Magang / PKL",
  "Kontrak",
  "Part-time",
  "Freelance",
];

const JOB_STATUS_OPTIONS = [
  { value: "active", label: "Aktif (Disetujui / Tayang Publik)" },
  { value: "pending", label: "Menunggu Persetujuan (Pending Review)" },
  { value: "rejected", label: "Ditolak (Tidak Ditayangkan)" },
  { value: "closed", label: "Ditutup (Penuh / Selesai)" },
];

const PARTNER_CATEGORIES = [
  "Software House & IT",
  "Telekomunikasi & Jaringan",
  "BUMN & Kedinasan",
  "Startup Teknologi",
  "Multimedia & Desain Kreatif",
  "Elektronika & Manufaktur",
  "Perguruan Tinggi & Vokasi",
];

const JURUSAN_OPTIONS = [
  "SIJA & TJAT",
  "SIJA",
  "TJAT",
  "Semua Jurusan",
];

const SALARY_PRESETS = [
  "Standar Industri",
  "Standar UMR",
  "Uang Saku Magang",
  "Kompetitif",
];

const LOCATION_PRESETS = [
  "Sidoarjo",
  "Surabaya",
  "Gresik",
  "Malang",
  "Jabodetabek",
  "Remote / WFH",
  "Hybrid",
];

function formatDeadlineDisplay(deadline?: string): string {
  if (!deadline) return "Terbuka";
  if (deadline.toLowerCase() === "segera") return "Segera";
  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    const [year, month, day] = deadline.split("-").map(Number);
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    if (month >= 1 && month <= 12) {
      return `${day} ${months[month - 1]} ${year}`;
    }
  }
  return deadline;
}

function toDateInputValue(deadline?: string): string {
  if (!deadline) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return deadline;
  const parts = deadline.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    const monthMap: Record<string, string> = {
      januari: "01", februari: "02", maret: "03", april: "04",
      mei: "05", juni: "06", juli: "07", agustus: "08",
      september: "09", oktober: "10", november: "11", desember: "12"
    };
    if (monthMap[monthName] && !isNaN(day) && !isNaN(year)) {
      return `${year}-${monthMap[monthName]}-${String(day).padStart(2, "0")}`;
    }
  }
  return "";
}

export default function AdminBKKPage() {
  const [activeTab, setActiveTab] = useState<"jobs" | "partners">("jobs");
  const [jobStatusFilter, setJobStatusFilter] = useState<"all" | "pending" | "active" | "rejected" | "closed">("all");
  const [inspectingJob, setInspectingJob] = useState<BKKJobItem | null>(null);
  const [jobs, setJobs] = useState<BKKJobItem[]>([]);
  const [partners, setPartners] = useState<BKKPartnerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Job
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<BKKJobItem | null>(null);
  const [jobForm, setJobForm] = useState<BKKJobItem>({
    title: "",
    company: "",
    location: "Sidoarjo",
    jobType: "Full-time",
    deadline: "",
    salary: "",
    requirements: "",
    description: "",
    companyLogo: "/images/partners/logo-telkom-indonesia.jpg",
    applyUrl: "mailto:karir@perusahaan.com",
    status: "active",
    contactPerson: "",
    emailOrWa: "",
    jurusan: "SIJA & TJAT",
    source: "admin",
  });

  // Modal Partner
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<BKKPartnerItem | null>(null);
  const [partnerForm, setPartnerForm] = useState<BKKPartnerItem>({
    name: "",
    category: "Pendidikan Vokasi & Rekayasa Teknologi",
    logo: "/images/partners/pens.webp",
    description: "",
    website: "https://",
    orderIndex: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [jobsData, partnersData] = await Promise.all([
        getAdminBKKJobs(),
        getBKKPartners(),
      ]);
      setJobs(jobsData);
      setPartners(partnersData);
    } catch {
      showToast("Gagal memuat data BKK", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleOpenJobAdd = () => {
    setEditingJob(null);
    setJobForm({
      title: "",
      company: "",
      location: "Sidoarjo",
      jobType: "Full-time",
      deadline: "31 Desember 2026",
      salary: "Standar Industri",
      requirements: "",
      description: "",
      companyLogo: "/images/partners/logo-telkom-indonesia.jpg",
      applyUrl: "mailto:karir@perusahaan.com",
      status: "active",
      contactPerson: "",
      emailOrWa: "",
      jurusan: "SIJA & TJAT",
      source: "admin",
    });
    setIsJobModalOpen(true);
  };

  const handleOpenJobEdit = (item: BKKJobItem) => {
    setEditingJob(item);
    setJobForm({
      ...item,
      contactPerson: item.contactPerson || "",
      emailOrWa: item.emailOrWa || "",
      jurusan: item.jurusan || "SIJA & TJAT",
      source: item.source || "admin",
    });
    setIsJobModalOpen(true);
  };

  const handleQuickStatusUpdate = async (item: BKKJobItem, newStatus: "active" | "rejected" | "closed") => {
    if (!item.id) return;
    try {
      const res = await updateBKKJobStatus(item.id, newStatus);
      if (res.success) {
        if (newStatus === "active") {
          showToast(`Lowongan "${item.title}" berhasil di-ACC dan aktif dipublikasikan!`);
        } else if (newStatus === "rejected") {
          showToast(`Pengajuan lowongan "${item.title}" ditolak.`);
        } else {
          showToast(`Status lowongan "${item.title}" diubah menjadi ditutup.`);
        }
        if (inspectingJob && inspectingJob.id === item.id) {
          setInspectingJob(null);
        }
        await loadAll();
      } else {
        showToast(res.error || "Gagal memperbarui status", "error");
      }
    } catch {
      showToast("Gagal memperbarui status", "error");
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.company.trim()) {
      showToast("Posisi dan nama perusahaan wajib diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingJob && editingJob.id) {
        const res = await updateBKKJob(editingJob.id, jobForm);
        if (res.success) {
          showToast("Lowongan kerja berhasil diperbarui");
          setIsJobModalOpen(false);
          await loadAll();
        } else {
          showToast(res.error || "Gagal memperbarui", "error");
        }
      } else {
        const res = await createBKKJob(jobForm);
        if (res.success) {
          showToast("Lowongan baru berhasil dibuat");
          setIsJobModalOpen(false);
          await loadAll();
        } else {
          showToast(res.error || "Gagal membuat lowongan", "error");
        }
      }
    } catch {
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJobDelete = async (item: BKKJobItem) => {
    if (!item.id) return;
    if (!window.confirm(`Hapus lowongan "${item.title}"?`)) return;

    try {
      const res = await deleteBKKJob(item.id);
      if (res.success) {
        showToast("Lowongan berhasil dihapus");
        await loadAll();
      }
    } catch {
      showToast("Gagal menghapus lowongan", "error");
    }
  };

  const handleOpenPartnerAdd = () => {
    setEditingPartner(null);
    setPartnerForm({
      name: "",
      category: "Pendidikan Vokasi & Rekayasa Teknologi",
      logo: "/images/partners/pens.webp",
      description: "",
      website: "https://",
      orderIndex: partners.length + 1,
    });
    setIsPartnerModalOpen(true);
  };

  const handleOpenPartnerEdit = (partner: BKKPartnerItem) => {
    setEditingPartner(partner);
    setPartnerForm({
      name: partner.name,
      category: partner.category,
      logo: partner.logo || "/images/partners/pens.webp",
      description: partner.description || "",
      website: partner.website || "https://",
      orderIndex: partner.orderIndex || 0,
    });
    setIsPartnerModalOpen(true);
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name.trim()) {
      showToast("Nama mitra industri wajib diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      if (editingPartner && editingPartner.id) {
        res = await updateBKKPartner(editingPartner.id, partnerForm);
      } else {
        res = await createBKKPartner(partnerForm);
      }
      if (res.success) {
        showToast(
          editingPartner
            ? "Mitra industri berhasil diperbarui"
            : "Mitra industri berhasil ditambahkan"
        );
        setIsPartnerModalOpen(false);
        await loadAll();
      } else {
        showToast(res.error || "Gagal menyimpan data mitra", "error");
      }
    } catch {
      showToast("Terjadi gangguan server", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePartnerDelete = async (item: BKKPartnerItem) => {
    if (!item.id) return;
    if (!window.confirm(`Hapus mitra "${item.name}"?`)) return;

    try {
      const res = await deleteBKKPartner(item.id);
      if (res.success) {
        showToast("Mitra industri berhasil dihapus");
        await loadAll();
      }
    } catch {
      showToast("Gagal menghapus mitra", "error");
    }
  };

  const pendingJobsCount = jobs.filter((j) => (j.status || "active").toLowerCase() === "pending").length;
  const activeJobsCount = jobs.filter((j) => (j.status || "active").toLowerCase() === "active").length;
  const rejectedJobsCount = jobs.filter((j) => (j.status || "").toLowerCase() === "rejected").length;
  const closedJobsCount = jobs.filter((j) => (j.status || "").toLowerCase() === "closed").length;

  const filteredJobs = jobs.filter((item) => {
    const st = (item.status || "active").toLowerCase();
    if (jobStatusFilter === "pending" && st !== "pending") return false;
    if (jobStatusFilter === "active" && st !== "active") return false;
    if (jobStatusFilter === "rejected" && st !== "rejected") return false;
    if (jobStatusFilter === "closed" && st !== "closed") return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      (item.contactPerson && item.contactPerson.toLowerCase().includes(q)) ||
      (item.emailOrWa && item.emailOrWa.toLowerCase().includes(q)) ||
      (item.requirements && item.requirements.toLowerCase().includes(q))
    );
  });

  const filteredPartners = partners.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout
      title="Bursa Kerja & Kemitraan (BKK)"
      subtitle="Kelola lowongan kerja bagi alumni dan daftar mitra industri resmi SKOMDA"
      actions={
        activeTab === "jobs" ? (
          <button
            type="button"
            onClick={handleOpenJobAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="size-4" />
            <span>Tambah Lowongan</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleOpenPartnerAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="size-4" />
            <span>Tambah Mitra</span>
          </button>
        )
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

        {/* Toolbar & Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          {/* Tab Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "jobs"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase className="size-3.5" />
              <span>Lowongan Kerja ({jobs.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("partners")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "partners"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building className="size-3.5" />
              <span>Mitra Industri ({partners.length})</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 min-w-0 lg:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "jobs"
                    ? "Cari posisi, perusahaan, atau lokasi..."
                    : "Cari nama mitra atau industri..."
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
              />
            </div>

            {/* Prominent Add Button */}
            {activeTab === "jobs" ? (
              <button
                type="button"
                onClick={handleOpenJobAdd}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Plus className="size-4" />
                <span>Tambah Lowongan Baru</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenPartnerAdd}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Plus className="size-4" />
                <span>Tambah Mitra Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Jobs Content */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {/* Banner Notifikasi Pengajuan Menunggu ACC */}
            {pendingJobsCount > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-900 shadow-2xs animate-in fade-in-0 duration-150">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shrink-0 shadow-xs">
                    <Clock className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-amber-950">
                      {pendingJobsCount} Pengajuan Lowongan Mitra Menunggu Verifikasi & Persetujuan (ACC)
                    </p>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      Pengajuan dari mitra/perusahaan ini berstatus <strong>Pending</strong> dan tidak akan tampil ke publik sampai Anda menyetujuinya.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setJobStatusFilter("pending")}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  Tinjau Pengajuan ({pendingJobsCount})
                </button>
              </div>
            )}

            {/* Sub-Filter Status Lowongan */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setJobStatusFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  jobStatusFilter === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Semua ({jobs.length})
              </button>
              <button
                type="button"
                onClick={() => setJobStatusFilter("pending")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  jobStatusFilter === "pending"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-50"
                }`}
              >
                <span>Menunggu ACC</span>
                {pendingJobsCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      jobStatusFilter === "pending"
                        ? "bg-white text-amber-700"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {pendingJobsCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setJobStatusFilter("active")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  jobStatusFilter === "active"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Aktif / Disetujui ({activeJobsCount})
              </button>
              <button
                type="button"
                onClick={() => setJobStatusFilter("rejected")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  jobStatusFilter === "rejected"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Ditolak ({rejectedJobsCount})
              </button>
              <button
                type="button"
                onClick={() => setJobStatusFilter("closed")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  jobStatusFilter === "closed"
                    ? "bg-slate-700 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Ditutup ({closedJobsCount})
              </button>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-500">
                  Belum ada lowongan kerja dengan status ini atau sesuai pencarian.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 pl-6 pr-3">Posisi & Perusahaan</th>
                        <th className="px-3 py-3.5">Tipe & Lokasi</th>
                        <th className="px-3 py-3.5">Kontak / Pengaju</th>
                        <th className="px-3 py-3.5">Batas Lamaran</th>
                        <th className="px-3 py-3.5">Status</th>
                        <th className="py-3.5 pl-3 pr-6 text-right">Aksi & Persetujuan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredJobs.map((item) => {
                        const statusLower = (item.status || "active").toLowerCase();
                        const isPending = statusLower === "pending";
                        const isActive = statusLower === "active";
                        const isRejected = statusLower === "rejected";

                        return (
                          <tr key={item.id} className={`transition-colors ${isPending ? "bg-amber-50/30 hover:bg-amber-50/60" : "hover:bg-slate-50/60"}`}>
                            <td className="py-4 pl-6 pr-3 min-w-[240px]">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900">{item.title}</p>
                                {item.source === "mitra" && (
                                  <span className="rounded-md bg-blue-50 border border-blue-200 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                                    Mitra
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#bc0c11] font-semibold mt-0.5">
                                {item.company}
                              </p>
                              {item.jurusan && (
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  Jurusan: {item.jurusan}
                                </p>
                              )}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                {item.jobType}
                              </span>
                              <span className="text-[11px] text-slate-500 ml-2">
                                {item.location}
                              </span>
                            </td>
                            <td className="px-3 py-4 min-w-[160px]">
                              {item.contactPerson || item.emailOrWa ? (
                                <div className="space-y-0.5">
                                  <p className="font-semibold text-slate-800 text-[11px]">{item.contactPerson || "-"}</p>
                                  <p className="text-slate-500 text-[10px]">{item.emailOrWa || "-"}</p>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">-</span>
                              )}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-slate-500 font-medium">
                              {formatDeadlineDisplay(item.deadline)}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              {isPending ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/90 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Menunggu ACC
                                </span>
                              ) : isActive ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                  <CheckCircle2 className="size-3" />
                                  Aktif
                                </span>
                              ) : isRejected ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                                  <X className="size-3" />
                                  Ditolak
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                  Ditutup
                                </span>
                              )}
                            </td>
                            <td className="py-4 pl-3 pr-6 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Quick ACC / Reject Actions for Pending Submissions */}
                                {isPending && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickStatusUpdate(item, "active")}
                                      title="Setujui (ACC) & Publikasikan"
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                                    >
                                      <Check className="size-3.5" />
                                      <span>ACC</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickStatusUpdate(item, "rejected")}
                                      title="Tolak Pengajuan"
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold transition-all cursor-pointer"
                                    >
                                      <X className="size-3.5" />
                                      <span>Tolak</span>
                                    </button>
                                  </>
                                )}

                                {isActive && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusUpdate(item, "closed")}
                                    title="Tutup Lowongan (Selesai)"
                                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-all cursor-pointer"
                                  >
                                    Tutup
                                  </button>
                                )}

                                {isRejected && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusUpdate(item, "active")}
                                    title="Pulihkan & ACC"
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold transition-all cursor-pointer"
                                  >
                                    <Check className="size-3" />
                                    <span>ACC</span>
                                  </button>
                                )}

                                {/* Preview Button */}
                                <button
                                  type="button"
                                  onClick={() => setInspectingJob(item)}
                                  title="Lihat Detail Lengkap"
                                  className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                                >
                                  <Eye className="size-4" />
                                </button>

                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenJobEdit(item)}
                                  title="Sunting"
                                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                  <Pencil className="size-4" />
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleJobDelete(item)}
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
        )}

        {/* Tab 2: Partners Content */}
        {activeTab === "partners" && (
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-white border border-slate-200 animate-pulse" />
                ))}
              </div>
            ) : filteredPartners.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-xs text-slate-500">
                Belum ada mitra industri tersimpan atau sesuai pencarian.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="group relative flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all gap-3.5"
                  >
                    {/* Logo Mitra Kecil & Rapi */}
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5">
                      {partner.logo ? (
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <Building className="size-5 text-slate-400" />
                      )}
                    </div>

                    {/* Informasi Mitra */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                        {partner.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {partner.category || "Mitra Industri"}
                      </p>
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#bc0c11] hover:underline mt-1"
                        >
                          <span>Kunjungi Website</span>
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>

                    {/* Tombol Aksi: Edit & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenPartnerEdit(partner)}
                        title="Sunting Mitra"
                        className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePartnerDelete(partner)}
                        title="Hapus Mitra"
                        className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Job with Custom Scrollbar and Pinned Header/Footer */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6">
          <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Pinned Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5 shrink-0 bg-white">
              <h2 className="text-lg font-bold text-slate-900 font-poppins">
                {editingJob ? "Sunting Lowongan Kerja" : "Buat Lowongan Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsJobModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Form Body with Custom Scrollbar */}
            <form onSubmit={handleJobSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto admin-modal-scrollbar px-6 sm:px-8 py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Posisi Pekerjaan <span className="text-[#bc0c11]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Junior Network Engineer"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nama Perusahaan <span className="text-[#bc0c11]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PT Telkom Akses"
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-[#bc0c11]" />
                        Lokasi Penempatan
                      </span>
                    </label>
                    <input
                      type="text"
                      list="job-locations-preset"
                      placeholder="Pilih atau ketik kota (Contoh: Sidoarjo / Surabaya)"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                    <datalist id="job-locations-preset">
                      {LOCATION_PRESETS.map((loc) => (
                        <option key={loc} value={loc} />
                      ))}
                    </datalist>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">Kota populer:</span>
                      {LOCATION_PRESETS.slice(0, 5).map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setJobForm({ ...jobForm, location: loc })}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                            jobForm.location === loc
                              ? "bg-[#bc0c11] text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <AdminSelect
                      label="Tipe Pekerjaan"
                      value={jobForm.jobType}
                      onChange={(val) => setJobForm({ ...jobForm, jobType: val })}
                      options={JOB_TYPES}
                    />
                  </div>

                  <div>
                    <AdminSelect
                      label="Status Lowongan"
                      value={jobForm.status || "active"}
                      onChange={(val) => setJobForm({ ...jobForm, status: val as "active" | "closed" })}
                      options={JOB_STATUS_OPTIONS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-[#bc0c11]" />
                        Batas Pendaftaran
                      </label>
                      {jobForm.deadline && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {formatDeadlineDisplay(jobForm.deadline)}
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      value={toDateInputValue(jobForm.deadline)}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">Batas:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setMonth(d.getMonth() + 1);
                          setJobForm({ ...jobForm, deadline: d.toISOString().split("T")[0] });
                        }}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                      >
                        +1 Bulan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setMonth(d.getMonth() + 2);
                          setJobForm({ ...jobForm, deadline: d.toISOString().split("T")[0] });
                        }}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                      >
                        +2 Bulan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const year = new Date().getFullYear();
                          setJobForm({ ...jobForm, deadline: `${year}-12-31` });
                        }}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                      >
                        Akhir Tahun
                      </button>
                      <button
                        type="button"
                        onClick={() => setJobForm({ ...jobForm, deadline: "Segera" })}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer transition-colors"
                      >
                        Segera
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="size-3.5 text-[#bc0c11]" />
                      Estimasi Gaji / Benefit
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Rp 3.500.000 - Rp 5.000.000 / UMR"
                      value={jobForm.salary || ""}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">Preset:</span>
                      {SALARY_PRESETS.map((sal) => (
                        <button
                          key={sal}
                          type="button"
                          onClick={() => setJobForm({ ...jobForm, salary: sal })}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                            jobForm.salary === sal
                              ? "bg-[#bc0c11] text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                          }`}
                        >
                          {sal}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ExternalLink className="size-3.5 text-[#bc0c11]" />
                      Email / Tautan Melamar
                    </label>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {jobForm.applyUrl?.startsWith("mailto:")
                        ? "Jalur: Email Pengiriman"
                        : jobForm.applyUrl?.startsWith("http")
                        ? "Jalur: Formulir / Website"
                        : "Format Bebas"}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="mailto:karir@perusahaan.com atau https://perusahaan.com/karir"
                    value={jobForm.applyUrl || ""}
                    onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Format cepat:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const clean = (jobForm.applyUrl || "").replace(/^mailto:/, "").replace(/^https?:\/\//, "");
                        setJobForm({ ...jobForm, applyUrl: `mailto:${clean || "karir@perusahaan.com"}` });
                      }}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer transition-colors"
                    >
                      Email (mailto:)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const clean = (jobForm.applyUrl || "").replace(/^mailto:/, "").replace(/^https?:\/\//, "");
                        setJobForm({ ...jobForm, applyUrl: `https://${clean || "perusahaan.com/karir"}` });
                      }}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer transition-colors"
                    >
                      Website Link (https://)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Kualifikasi & Persyaratan</span>
                    <span className="text-[10px] font-normal text-slate-400">Tekan Enter untuk poin baru</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="• Pendidikan minimal SMK jurusan SIJA / TJAT&#10;• Menguasai konfigurasi Mikrotik / Cisco&#10;• Bersedia ditempatkan di Sidoarjo"
                    value={jobForm.requirements || ""}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    className="w-full custom-scrollbar resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Deskripsi Pekerjaan</span>
                    <span className="text-[10px] font-normal text-slate-400">Tugas & tanggung jawab posisi</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Uraian tugas dan tanggung jawab harian pada posisi ini..."
                    value={jobForm.description || ""}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full custom-scrollbar resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                {/* Informasi Pengaju & Jurusan */}
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3.5">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="size-3.5 text-[#bc0c11]" />
                    Informasi Pengaju / PIC Kemitraan
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Nama PIC / Narahubung
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Bpk. Bambang Sutrisno (HR Manager)"
                        value={jobForm.contactPerson || ""}
                        onChange={(e) => setJobForm({ ...jobForm, contactPerson: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-600">
                          No. WhatsApp / Email Pengaju
                        </label>
                        {jobForm.emailOrWa && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {jobForm.emailOrWa.includes("@") ? "Email" : "WhatsApp"}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="081234567890 atau hrd@perusahaan.com"
                        value={jobForm.emailOrWa || ""}
                        onChange={(e) => setJobForm({ ...jobForm, emailOrWa: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <AdminSelect
                      label="Jurusan / Bidang Keahlian Sasaran"
                      value={jobForm.jurusan || "SIJA & TJAT"}
                      onChange={(val) => setJobForm({ ...jobForm, jurusan: val })}
                      options={JURUSAN_OPTIONS}
                    />
                  </div>
                </div>

                <div>
                  <ImageUploadField
                    label="Logo Perusahaan"
                    value={jobForm.companyLogo || ""}
                    onChange={(url) => setJobForm({ ...jobForm, companyLogo: url })}
                    folder="skomda/bkk-jobs"
                    recommendedSize="Format PNG, JPG, WebP. Rasio 1:1."
                  />
                </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 sm:px-8 py-4 bg-slate-50/70 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#990a0e] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Lowongan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tinjau / Verifikasi Lowongan Mitra (Review & ACC Modal) */}
      {inspectingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in-0 duration-150">
          <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5 shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                  <FileText className="size-4.5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-poppins">
                    Verifikasi Pengajuan Lowongan
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    ID #{inspectingJob.id} &bull; Sumber: {inspectingJob.source === "mitra" ? "Pengajuan Mitra / Publik" : "Dibuat Admin"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingJob(null)}
                className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto admin-modal-scrollbar px-6 sm:px-8 py-6 space-y-5">
              {/* Alert Status */}
              {(inspectingJob.status || "active").toLowerCase() === "pending" ? (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900">
                  <Clock className="size-5 shrink-0 text-amber-600 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-amber-950">Status: Menunggu ACC (Belum Terbit di Website)</p>
                    <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                      Lowongan ini diajukan dari halaman publik BKK. Tinjau kesesuaian posisi, profil perusahaan, dan hubungi kontak penanggung jawab di bawah jika perlu sebelum menekan <strong>Setujui & Publikasikan (ACC)</strong>.
                    </p>
                  </div>
                </div>
              ) : (inspectingJob.status || "active").toLowerCase() === "active" ? (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-950">Status: Aktif & Tayang di Publik</p>
                    <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                      Lowongan ini telah disetujui dan saat ini dapat dilihat serta dilamar oleh alumni dan siswa di portal BKK.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-900">
                  <XCircle className="size-5 shrink-0 text-rose-600 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-rose-950">Status: Pengajuan Ditolak</p>
                    <p className="text-rose-800 text-[11px] mt-0.5 leading-relaxed">
                      Pengajuan ini ditolak oleh Admin dan tidak ditampilkan pada portal website. Anda dapat menyetujuinya kembali sewaktu-waktu jika diperlukan.
                    </p>
                  </div>
                </div>
              )}

              {/* Ringkasan Lowongan & Perusahaan */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4.5 sm:p-5">
                <div className="flex items-start gap-4">
                  <div className="relative size-14 rounded-2xl border border-slate-200 bg-white p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                    {inspectingJob.companyLogo ? (
                      <Image
                        src={inspectingJob.companyLogo}
                        alt={inspectingJob.company}
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    ) : (
                      <Building className="size-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#bc0c11]/10 text-[#bc0c11]">
                        {inspectingJob.jobType}
                      </span>
                      {inspectingJob.jurusan && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {inspectingJob.jurusan}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {inspectingJob.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {inspectingJob.company}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span>Lokasi: {inspectingJob.location || "Sidoarjo"}</span>
                      {inspectingJob.salary && <span>&bull; Estimasi: {inspectingJob.salary}</span>}
                      {inspectingJob.deadline && <span>&bull; Batas: {formatDeadlineDisplay(inspectingJob.deadline)}</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Narahubung & Verifikasi Pengaju */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4.5 sm:p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <User className="size-4 text-[#bc0c11]" />
                  Informasi Narahubung / PIC Pengaju
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Nama PIC
                    </span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                      {inspectingJob.contactPerson || "Tidak dicantumkan"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      WhatsApp / Email Pengaju
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-slate-800 text-xs">
                        {inspectingJob.emailOrWa || "Tidak dicantumkan"}
                      </span>
                      {inspectingJob.emailOrWa && (
                        <div className="flex items-center gap-1">
                          {inspectingJob.emailOrWa.includes("@") ? (
                            <a
                              href={`mailto:${inspectingJob.emailOrWa}`}
                              className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 text-[10px] font-bold inline-flex items-center gap-1"
                            >
                              <Mail className="size-2.5" />
                              <span>Email</span>
                            </a>
                          ) : (
                            <a
                              href={`https://wa.me/${inspectingJob.emailOrWa.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-[10px] font-bold inline-flex items-center gap-1"
                            >
                              <Phone className="size-2.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {inspectingJob.applyUrl && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Tautan / Jalur Melamar Resmi
                    </span>
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-mono text-slate-700 truncate text-[11px]">
                        {inspectingJob.applyUrl}
                      </span>
                      <a
                        href={inspectingJob.applyUrl.startsWith("http") || inspectingJob.applyUrl.startsWith("mailto:") ? inspectingJob.applyUrl : `https://${inspectingJob.applyUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#bc0c11] hover:underline shrink-0"
                      >
                        <span>Cek Link</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Kualifikasi & Deskripsi */}
              <div className="space-y-4">
                {inspectingJob.requirements && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Kualifikasi & Persyaratan
                    </h4>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {inspectingJob.requirements}
                    </div>
                  </div>
                )}

                {inspectingJob.description && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Deskripsi Pekerjaan
                    </h4>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {inspectingJob.description}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Modal Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 sm:px-8 py-4 bg-slate-50/70 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const jobToEdit = inspectingJob;
                  setInspectingJob(null);
                  handleOpenJobEdit(jobToEdit);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                <Pencil className="size-3.5" />
                <span>Sunting Data</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingJob(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Tutup
                </button>

                {(inspectingJob.status || "active").toLowerCase() === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate(inspectingJob, "rejected")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shadow-2xs"
                    >
                      <XCircle className="size-3.5" />
                      <span>Tolak Pengajuan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate(inspectingJob, "active")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="size-4" />
                      <span>Setujui & Publikasikan (ACC)</span>
                    </button>
                  </>
                ) : (inspectingJob.status || "active").toLowerCase() === "active" ? (
                  <button
                    type="button"
                    onClick={() => handleQuickStatusUpdate(inspectingJob, "closed")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span>Tutup Lowongan</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleQuickStatusUpdate(inspectingJob, "active")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Pulihkan & Setujui (ACC)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Partner with Custom Scrollbar and Pinned Header/Footer */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6">
          <div className="relative flex flex-col w-full max-w-md max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Pinned Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5 shrink-0 bg-white">
              <h2 className="text-base font-bold text-slate-900 font-poppins">
                {editingPartner ? "Sunting Mitra Industri" : "Tambah Mitra Industri Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Form Body with Custom Scrollbar */}
            <form onSubmit={handlePartnerSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto admin-modal-scrollbar px-6 sm:px-8 py-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Perusahaan Mitra <span className="text-[#bc0c11]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Telkom Indonesia"
                    value={partnerForm.name}
                    onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <AdminSelect
                    label="Kategori Industri"
                    value={partnerForm.category}
                    onChange={(cat) => setPartnerForm({ ...partnerForm, category: cat })}
                    options={PARTNER_CATEGORIES}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tautan Website Resmi
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={partnerForm.website || ""}
                    onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Keterangan Kerjasama
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Bentuk kemitraan, penyaluran magang PKL, kelas industri..."
                    value={partnerForm.description || ""}
                    onChange={(e) => setPartnerForm({ ...partnerForm, description: e.target.value })}
                    className="w-full custom-scrollbar resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                  />
                </div>

                <div>
                  <ImageUploadField
                    label="Logo Perusahaan Mitra"
                    value={partnerForm.logo || ""}
                    onChange={(url) => setPartnerForm({ ...partnerForm, logo: url })}
                    folder="skomda/bkk-partners"
                    recommendedSize="Format PNG (transparan disarankan) atau JPG, WebP."
                  />
                </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 sm:px-8 py-4 bg-slate-50/70 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#990a0e] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingPartner
                    ? "Simpan Perubahan"
                    : "Tambah Mitra"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
