"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Users,
  Search,
  Filter,
  Plus,
  Pencil,
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
  Eye,
  X,
  Copy,
  Check,
  ChevronDown,
  Mail,
  Phone,
  FileText,
  Calendar,
  Settings2,
  Save,
  Radio,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSelect from "@/components/admin/AdminSelect";
import VirtualClassManager from "@/components/admin/VirtualClassManager";
import {
  TrialClassParticipant,
  TrialClassEvent,
  DEFAULT_TRIAL_CLASS_EVENT,
  getTrialClassParticipants,
  registerTrialClass,
  updateTrialClassParticipant,
  deleteTrialClassParticipant,
  getUpcomingTrialClassEvent,
  updateTrialClassEvent,
} from "@/services/trialClass";

const MAJOR_FILTER_OPTIONS = [
  { value: "Semua", label: "Semua Jurusan" },
  { value: "SIJA", label: "SIJA (4 Tahun)" },
  { value: "TJAT", label: "TJAT (3 Tahun)" },
];

const MAJOR_FORM_OPTIONS = [
  { value: "SIJA (Sistem Informasi Jaringan & Aplikasi)", label: "SIJA (4 Tahun) - Software, Cloud & Network" },
  { value: "TJAT (Teknik Jaringan Akses Telekomunikasi)", label: "TJAT (3 Tahun) - Fiber Optic & Wireless" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "Semua", label: "Semua Status" },
  { value: "registered", label: "Registered (Terdaftar)" },
  { value: "verified", label: "Verified (Terverifikasi)" },
  { value: "attended", label: "Attended (Telah Hadir)" },
];

const STATUS_FORM_OPTIONS = [
  { value: "registered", label: "Registered (Terdaftar)" },
  { value: "verified", label: "Verified (Terverifikasi Masuk)" },
  { value: "attended", label: "Attended (Hadir di Sesi)" },
];

const EVENT_STATUS_OPTIONS = [
  { value: "open", label: "Buka Pendaftaran (Aktif)" },
  { value: "closing_soon", label: "Segera Ditutup (Badge Kuning)" },
  { value: "closed", label: "Pendaftaran Ditutup (Nonaktif)" },
];

// Custom tactile row status dropdown rendered via Portal to prevent any clipping from table overflow
function RowStatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (newStatus: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "registered", label: "Registered", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/70" },
    { value: "verified", label: "Verified", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70" },
    { value: "attended", label: "Attended", color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/70" },
  ];

  const currentOption = options.find((opt) => opt.value === value) || options[0];

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 125;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < menuHeight + 10 && rect.top > menuHeight;
      setCoords({
        top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
        left: Math.max(8, Math.min(window.innerWidth - 160, rect.left)),
      });
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs hover:opacity-90 ${currentOption.color}`}
      >
        <span>{currentOption.label}</span>
        <ChevronDown className={`size-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
            }}
            className="w-36 rounded-xl border border-slate-200/90 bg-white p-1 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-slate-100 text-slate-900 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="size-3.5 text-[#bc0c11]" />}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}

export default function AdminTrialClassPage() {
  const [activeTab, setActiveTab] = useState<"participants" | "event" | "virtual_class">("participants");
  const [participants, setParticipants] = useState<TrialClassParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  // Event Settings State
  const [eventData, setEventData] = useState<TrialClassEvent>(DEFAULT_TRIAL_CLASS_EVENT);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TrialClassParticipant | null>(null);
  const [inspectingItem, setInspectingItem] = useState<TrialClassParticipant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Participant Form State
  const [formData, setFormData] = useState({
    fullName: "",
    schoolOrigin: "",
    whatsapp: "",
    email: "",
    major: "SIJA (Sistem Informasi Jaringan & Aplikasi)",
    status: "registered",
    notes: "",
  });

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
      const [partRes, eventRes] = await Promise.all([
        getTrialClassParticipants({
          q: searchQuery,
          major: selectedMajor,
          status: selectedStatus,
        }),
        getUpcomingTrialClassEvent(),
      ]);
      setParticipants(partRes.data);
      if (eventRes) {
        setEventData(eventRes);
      }
    } catch {
      showToast("Gagal memuat data", "error");
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
      if (inspectingItem && inspectingItem.id === id) {
        setInspectingItem({ ...inspectingItem, status: newStatus });
      }
      showToast("Status pendaftar berhasil diperbarui");
    } else {
      showToast(res.error || "Gagal memperbarui status", "error");
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventData.title.trim() || !eventData.dateFull.trim()) {
      showToast("Judul event dan tanggal lengkap wajib diisi", "error");
      return;
    }

    setIsSavingEvent(true);
    try {
      const res = await updateTrialClassEvent(eventData);
      if (res.success) {
        showToast("Jadwal Event Terdekat berhasil disimpan!");
        if (res.data) setEventData(res.data);
      } else {
        showToast(res.error || "Gagal menyimpan jadwal event", "error");
      }
    } catch {
      showToast("Terjadi gangguan server saat menyimpan event", "error");
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      fullName: "",
      schoolOrigin: "",
      whatsapp: "",
      email: "",
      major: "SIJA (Sistem Informasi Jaringan & Aplikasi)",
      status: "registered",
      notes: "",
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: TrialClassParticipant) => {
    setEditingItem(item);
    setFormData({
      fullName: item.fullName,
      schoolOrigin: item.schoolOrigin,
      whatsapp: item.whatsapp,
      email: item.email || "",
      major: item.major,
      status: item.status,
      notes: item.notes || "",
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (item: TrialClassParticipant) => {
    setInspectingItem(item);
    setIsDetailModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.schoolOrigin.trim() || !formData.whatsapp.trim()) {
      showToast("Nama lengkap, asal sekolah, dan nomor WhatsApp wajib diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem && editingItem.id) {
        const res = await updateTrialClassParticipant(editingItem.id, formData);
        if (res.success) {
          showToast("Data pendaftar berhasil diperbarui!");
          setIsFormModalOpen(false);
          await loadData();
        } else {
          showToast(res.error || "Gagal memperbarui pendaftar", "error");
        }
      } else {
        const res = await registerTrialClass(formData);
        if (res.success) {
          showToast("Pendaftar baru berhasil ditambahkan!");
          setIsFormModalOpen(false);
          await loadData();
        } else {
          showToast(res.error || "Gagal menambahkan pendaftar", "error");
        }
      }
    } catch {
      showToast("Terjadi gangguan saat menyimpan data", "error");
    } finally {
      setIsSubmitting(false);
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
      if (isDetailModalOpen && inspectingItem?.id === id) {
        setIsDetailModalOpen(false);
      }
    } else {
      showToast(res.error || "Gagal menghapus pendaftar", "error");
    }
  };

  const copyTicketCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showToast("Kode tiket berhasil disalin!");
  };

  // Quick stats
  const stats = useMemo(() => {
    const total = participants.length;
    const sija = participants.filter((p) => p.major.toUpperCase().includes("SIJA")).length;
    const tjat = participants.filter((p) => p.major.toUpperCase().includes("TJAT")).length;
    const registered = participants.filter((p) => p.status === "registered").length;
    const verified = participants.filter((p) => p.status === "verified").length;
    const attended = participants.filter((p) => p.status === "attended").length;
    return { total, sija, tjat, registered, verified, attended };
  }, [participants]);

  const exportCSV = () => {
    if (participants.length === 0) {
      showToast("Tidak ada data untuk diekspor", "error");
      return;
    }

    const headers = [
      "ID",
      "Kode Tiket",
      "Nama Lengkap",
      "Asal Sekolah",
      "WhatsApp",
      "Email",
      "Pilihan Jurusan",
      "Status",
      "Catatan",
      "Waktu Daftar",
    ];
    const rows = participants.map((p) => [
      p.id,
      p.ticketCode,
      `"${p.fullName.replace(/"/g, '""')}"`,
      `"${p.schoolOrigin.replace(/"/g, '""')}"`,
      `'${p.whatsapp}`,
      `"${p.email || ""}"`,
      `"${p.major}"`,
      p.status,
      `"${(p.notes || "").replace(/"/g, '""')}"`,
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
      title="Trial Class & Virtual Class"
      subtitle="Kelola pendaftar calon siswa serta atur informasi sesi Event Terdekat yang tampil di halaman publik."
      actions={
        activeTab === "participants" ? (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="size-4 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#990a0e] transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="size-4" />
              <span>Tambah Pendaftar</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSaveEvent}
            disabled={isSavingEvent}
            className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#990a0e] transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {isSavingEvent ? (
              <div className="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>Simpan Perubahan Event</span>
          </button>
        )
      }
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl transition-all ${
            toastMessage.type === "success"
              ? "bg-slate-900 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-white shrink-0" />
          )}
          <span className="text-xs font-bold">{toastMessage.text}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Navigation Tabs (Pendaftar vs Kelola Event Terdekat) */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("participants")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "participants"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users className="size-4" />
            <span>Data Pendaftar Siswa ({stats.total})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("event")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "event"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Calendar className="size-4" />
            <span>Kelola Event Terdekat</span>
            {eventData.status === "closing_soon" && (
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
            )}
            {eventData.status === "open" && (
              <span className="size-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("virtual_class")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "virtual_class"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="size-4 text-amber-500" />
            <span>Materi Video & Kuis Virtual Class</span>
          </button>
        </div>

        {/* ── TAB 1: DATA PENDAFTAR PESERTA ── */}
        {activeTab === "participants" && (
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
                  <span className="text-2xl font-bold text-slate-900">{stats.verified + stats.attended}</span>
                  <span className="text-xs text-slate-500 ml-2">peserta</span>
                </div>
              </div>
            </div>

            {/* Filter and Actions Bar */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
              {/* Status Quick Tabs */}
              <div className="flex items-center gap-1.5 rounded-xl bg-slate-100/90 p-1 shrink-0 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("Semua")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedStatus === "Semua"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Semua ({stats.total})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("registered")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedStatus === "registered"
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Registered ({stats.registered})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("verified")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedStatus === "verified"
                      ? "bg-white text-emerald-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Verified ({stats.verified})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("attended")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedStatus === "attended"
                      ? "bg-white text-indigo-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Attended ({stats.attended})
                </button>
              </div>

              {/* Search and Dropdowns */}
              <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 xl:justify-end">
                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, tiket, SMP, atau WhatsApp..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-8 text-xs text-slate-800 placeholder:text-slate-400 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </form>

                {/* Major Dropdown using AdminSelect */}
                <div className="w-full sm:w-48">
                  <AdminSelect
                    value={selectedMajor}
                    onChange={setSelectedMajor}
                    options={MAJOR_FILTER_OPTIONS}
                    icon={GraduationCap}
                    placeholder="Filter Jurusan"
                    selectClassName="!py-2"
                  />
                </div>

                {/* Status Dropdown using AdminSelect */}
                <div className="w-full sm:w-48">
                  <AdminSelect
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={STATUS_FILTER_OPTIONS}
                    icon={Filter}
                    placeholder="Filter Status"
                    selectClassName="!py-2"
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
              <div className="overflow-x-auto min-h-[220px]">
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
                        <td colSpan={8} className="py-16 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="size-7 rounded-full border-2 border-[#bc0c11] border-t-transparent animate-spin" />
                            <span className="text-xs font-semibold text-slate-600">Memuat data pendaftar...</span>
                          </div>
                        </td>
                      </tr>
                    ) : participants.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center text-slate-400">
                          <Users className="size-10 mx-auto mb-2 text-slate-300" />
                          <p className="text-xs sm:text-sm font-bold text-slate-700">Belum ada pendaftar Trial Class</p>
                          <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                            Data pendaftar akan muncul otomatis ketika pengunjung mengisi formulir di halaman Trial Class, atau Anda dapat menambahkannya secara manual.
                          </p>
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
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => copyTicketCode(item.ticketCode)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-100 text-xs font-mono font-bold text-[#bc0c11] hover:bg-red-100 transition-colors cursor-pointer"
                                title="Klik untuk menyalin kode tiket"
                              >
                                <span>{item.ticketCode}</span>
                                <Copy className="size-3 opacity-60" />
                              </button>
                            </td>

                            {/* Nama */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{item.fullName}</div>
                              {item.notes && (
                                <span className="text-[11px] text-slate-400 line-clamp-1 italic">{item.notes}</span>
                              )}
                            </td>

                            {/* Asal SMP */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
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
                                {item.major.split("(")[0].trim()}
                              </span>
                            </td>

                            {/* Kontak */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline text-xs"
                                  title="Chat WhatsApp langsung"
                                >
                                  <MessageCircle className="size-3.5" />
                                  <span>{item.whatsapp}</span>
                                </a>
                              </div>
                              {item.email && (
                                <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[150px]">{item.email}</div>
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

                            {/* Status (Portal tactile interactive dropdown) */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <RowStatusSelect
                                value={item.status}
                                onChange={(newStatus) => handleStatusChange(item.id, newStatus)}
                              />
                            </td>

                            {/* Aksi */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                type="button"
                                onClick={() => handleOpenDetailModal(item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Lihat Detail & Tiket"
                              >
                                <Eye className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                                title="Edit Data Pendaftar"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id, item.fullName)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Hapus Pendaftar"
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
      )}

      {/* ── TAB 2: KELOLA EVENT TERDEKAT (DYNAMIC SETTINGS & LIVE PREVIEW) ── */}
      {activeTab === "event" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Editor */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="size-10 rounded-2xl bg-red-50 text-[#bc0c11] flex items-center justify-center shrink-0">
                <Settings2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Konfigurasi Event Terdekat
                </h3>
                <p className="text-xs text-slate-500">
                  Data yang Anda perbarui di sini langsung tampil secara live di section &quot;Event Terdekat&quot; halaman Trial Class.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Judul Event */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Event <span className="text-[#bc0c11]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  placeholder="Contoh: Virtual Trial Class 2026"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                />
              </div>

              {/* Tag / Badge Event */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Label Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={eventData.badge}
                    onChange={(e) => setEventData({ ...eventData, badge: e.target.value })}
                    placeholder="Contoh: EVENT TERDEKAT"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <AdminSelect
                    label="Status Ketersediaan"
                    required
                    value={eventData.status}
                    onChange={(val) => setEventData({ ...eventData, status: val })}
                    options={EVENT_STATUS_OPTIONS}
                    icon={Radio}
                  />
                </div>
              </div>

              {/* Tanggal Pelaksanaan — date picker, auto-derives hari + tanggal display */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tanggal Pelaksanaan <span className="text-[#bc0c11]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={(() => {
                    try {
                      const months: Record<string, string> = {
                        Januari: "01", Februari: "02", Maret: "03", April: "04",
                        Mei: "05", Juni: "06", Juli: "07", Agustus: "08",
                        September: "09", Oktober: "10", November: "11", Desember: "12",
                      };
                      const parts = eventData.dateFull.split(" ");
                      if (parts.length === 3) {
                        const d = parts[0].padStart(2, "0");
                        const m = months[parts[1]] ?? "01";
                        const y = parts[2];
                        return `${y}-${m}-${d}`;
                      }
                    } catch { /* ignore */ }
                    return "";
                  })()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    const dateObj = new Date(val + "T00:00:00");
                    const HARI = ["Minggu,", "Senin,", "Selasa,", "Rabu,", "Kamis,", "Jumat,", "Sabtu,"];
                    const BULAN = [
                      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
                    ];
                    const dayName = HARI[dateObj.getDay()];
                    const dateFull = `${dateObj.getDate()} ${BULAN[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
                    setEventData({ ...eventData, dateDay: dayName, dateFull });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                />
                {eventData.dateFull && (
                  <p className="mt-1.5 text-[11px] text-slate-500 font-medium">
                    Akan ditampilkan sebagai:{" "}
                    <span className="text-slate-700 font-bold">
                      {eventData.dateDay} {eventData.dateFull}
                    </span>
                  </p>
                )}
              </div>

              {/* Waktu Pelaksanaan — dua time picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jam Mulai <span className="text-[#bc0c11]">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={(() => {
                      const part = eventData.timeRange?.split(" - ")[0]?.trim().replace(".", ":");
                      return part ?? "";
                    })()}
                    onChange={(e) => {
                      const start = e.target.value;
                      const end = eventData.timeRange?.split(" - ")[1]?.trim().replace(".", ":") ?? "11:00";
                      const fmt = (t: string) => t.replace(":", ".");
                      setEventData({ ...eventData, timeRange: `${fmt(start)} - ${fmt(end)}` });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jam Selesai <span className="text-[#bc0c11]">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={(() => {
                      const part = eventData.timeRange?.split(" - ")[1]?.trim().replace(".", ":");
                      return part ?? "";
                    })()}
                    onChange={(e) => {
                      const end = e.target.value;
                      const start = eventData.timeRange?.split(" - ")[0]?.trim().replace(".", ":") ?? "09:00";
                      const fmt = (t: string) => t.replace(":", ".");
                      setEventData({ ...eventData, timeRange: `${fmt(start)} - ${fmt(end)}` });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Zona Waktu & Kuota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Zona Waktu
                  </label>
                  <select
                    value={eventData.timezone}
                    onChange={(e) => setEventData({ ...eventData, timezone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  >
                    <option value="WIB">WIB (UTC+7)</option>
                    <option value="WITA">WITA (UTC+8)</option>
                    <option value="WIT">WIT (UTC+9)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kuota Peserta
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={9999}
                    value={eventData.quota ?? ""}
                    onChange={(e) => setEventData({ ...eventData, quota: parseInt(e.target.value) || 0 })}
                    placeholder="Contoh: 100"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Mode & Submode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mode Pelaksanaan
                  </label>
                  <select
                    value={eventData.mode}
                    onChange={(e) => setEventData({ ...eventData, mode: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Keterangan Lokasi / Submode
                  </label>
                  <input
                    type="text"
                    value={eventData.submode}
                    onChange={(e) => setEventData({ ...eventData, submode: e.target.value })}
                    placeholder="Contoh: (Virtual Class) atau Gedung A"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Deskripsi Tambahan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Deskripsi / Catatan Sesi
                </label>
                <textarea
                  rows={2}
                  value={eventData.description || ""}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  placeholder="Catatan tambahan seputar persiapan sesi atau materi..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingEvent}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#bc0c11] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSavingEvent ? (
                    <div className="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  <span>Simpan Perubahan Jadwal Event</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Website Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="size-3.5 text-[#bc0c11]" />
                <span>Pratinjau Tampilan Pengunjung (Live)</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Otomatis Sinkron
              </span>
            </div>

            {/* Event Card Mockup */}
            <div className="relative bg-white rounded-3xl border border-[#eceef1] p-6 shadow-xl overflow-hidden space-y-5">
              {/* Badge & Status Preview */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[#bc0c11]">
                  <div className="relative size-4 shrink-0">
                    <Image
                      src="/images/trial-class/icon-date.png"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#bc0c11]">
                    {eventData.badge || "EVENT TERDEKAT"}
                  </span>
                </div>

                {eventData.status === "closing_soon" && (
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    Segera Ditutup
                  </span>
                )}
                {eventData.status === "closed" && (
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                    Ditutup
                  </span>
                )}
                {eventData.status === "open" && (
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Buka Pendaftaran
                  </span>
                )}
              </div>

              {/* Title Preview */}
              <h4 className="text-xl font-bold text-[#101828] leading-tight">
                {eventData.title || "Virtual Trial Class 2026"}
              </h4>

              {/* 3 Detail Icons Preview */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative size-8 shrink-0">
                    <Image
                      src="/images/trial-class/icon-date.png"
                      alt="Date icon"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">{eventData.dateDay || "Sabtu,"}</span>
                    <span className="text-slate-500 text-[11px]">{eventData.dateFull || "Jadwal belum diumumkan"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative size-8 shrink-0">
                    <Image
                      src="/images/trial-class/icon-time.png"
                      alt="Time icon"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">{eventData.timeRange || "09.00 - 11.00"}</span>
                    <span className="text-slate-500 text-[11px]">{eventData.timezone || "WIB"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative size-8 shrink-0">
                    <Image
                      src="/images/trial-class/icon-online.png"
                      alt="Platform icon"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">{eventData.mode || "Online"}</span>
                    <span className="text-slate-500 text-[11px]">{eventData.submode || "(Virtual Class)"}</span>
                  </div>
                </div>
              </div>

              {/* Button Preview */}
              <div className="pt-2">
                <div
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-center ${
                    eventData.status === "closed"
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-[#bc0c11] text-white shadow-xs"
                  }`}
                >
                  {eventData.status === "closed" ? "Pendaftaran Ditutup" : "Daftar Sekarang"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: KELOLA VIRTUAL CLASS & KUIS INTERAKTIF ── */}
      {activeTab === "virtual_class" && (
        <VirtualClassManager onShowToast={showToast} />
      )}
      </div>

      {/* ── Modal Tambah / Edit Pendaftar ── */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-w-xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-red-50 text-[#bc0c11] flex items-center justify-center">
                  <Ticket className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingItem ? "Edit Data Pendaftar" : "Tambah Pendaftar Baru"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingItem
                      ? `Memperbarui pendaftar kode tiket ${editingItem.ticketCode}`
                      : "Daftarkan calon siswa secara manual ke database Trial Class"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="size-8 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 admin-modal-scrollbar">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap Siswa <span className="text-[#bc0c11]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Contoh: Muhammad Rizky Pratama"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                />
              </div>

              {/* Asal Sekolah */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Asal SMP / MTs <span className="text-[#bc0c11]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolOrigin}
                  onChange={(e) => setFormData({ ...formData, schoolOrigin: e.target.value })}
                  placeholder="Contoh: SMP Negeri 1 Sidoarjo"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                />
              </div>

              {/* WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp <span className="text-[#bc0c11]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Alamat Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Jurusan Dropdown using AdminSelect */}
              <div>
                <AdminSelect
                  label="Peminatan Jurusan"
                  required
                  value={formData.major}
                  onChange={(val) => setFormData({ ...formData, major: val })}
                  options={MAJOR_FORM_OPTIONS}
                  icon={GraduationCap}
                />
              </div>

              {/* Status Dropdown using AdminSelect */}
              <div>
                <AdminSelect
                  label="Status Pendaftar"
                  required
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                  options={STATUS_FORM_OPTIONS}
                  icon={CheckCircle2}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catatan / Minat Khusus (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tambahkan catatan khusus calon siswa (misal: tertarik coding web, sudah daftar SPMB, dll)..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#bc0c11] focus:bg-white focus:ring-2 focus:ring-red-100 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting && (
                    <div className="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  )}
                  <span>{editingItem ? "Simpan Perubahan" : "Tambah Pendaftar"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Detail / Inspeksi Tiket Pendaftar ── */}
      {isDetailModalOpen && inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-w-lg w-full">
            {/* Header Ticket Mockup */}
            <div className="bg-[#bc0c11] p-6 text-white relative">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                <Ticket className="size-4" />
                <span>Kartu Pendaftaran Resmi</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {inspectingItem.fullName}
              </h3>
              <p className="text-xs text-white/90 mt-1 flex items-center gap-1.5">
                <School className="size-3.5" />
                <span>{inspectingItem.schoolOrigin}</span>
              </p>

              <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-white/70 uppercase font-bold tracking-wider">
                    Kode Tiket Akses
                  </div>
                  <div className="text-lg font-mono font-black text-amber-300">
                    {inspectingItem.ticketCode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyTicketCode(inspectingItem.ticketCode)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  <span>{copiedCode ? "Tersalin!" : "Salin Tiket"}</span>
                </button>
              </div>
            </div>

            {/* Body Info */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Peminatan Jurusan
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {inspectingItem.major}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Status Pendaftar
                  </div>
                  <div className="mt-0.5">
                    <RowStatusSelect
                      value={inspectingItem.status}
                      onChange={(newStatus) => handleStatusChange(inspectingItem.id, newStatus)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="flex items-center gap-2 font-medium text-slate-500">
                    <Phone className="size-3.5 text-slate-400" />
                    <span>WhatsApp</span>
                  </span>
                  <a
                    href={`https://wa.me/${inspectingItem.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                  >
                    <span>{inspectingItem.whatsapp}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>

                {inspectingItem.email && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="flex items-center gap-2 font-medium text-slate-500">
                      <Mail className="size-3.5 text-slate-400" />
                      <span>Email</span>
                    </span>
                    <span className="font-semibold text-slate-800">{inspectingItem.email}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="flex items-center gap-2 font-medium text-slate-500">
                    <Clock className="size-3.5 text-slate-400" />
                    <span>Waktu Pendaftaran</span>
                  </span>
                  <span className="font-semibold text-slate-800">
                    {new Date(inspectingItem.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                {inspectingItem.notes && (
                  <div className="pt-2">
                    <span className="flex items-center gap-2 font-medium text-slate-500 mb-1">
                      <FileText className="size-3.5 text-slate-400" />
                      <span>Catatan / Minat Siswa:</span>
                    </span>
                    <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                      {inspectingItem.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenEditModal(inspectingItem);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Pencil className="size-3.5 text-slate-500" />
                  <span>Edit Data</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
