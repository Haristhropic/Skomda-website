"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  GraduationCap,
  Megaphone,
  Shield,
  FileText,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminSelect from "@/components/admin/AdminSelect";
import { getSiteSettings, updateSiteSetting } from "@/services/settings";
import {
  DocumentItem,
  getAdminDocumentList,
  getActiveBrochure,
  setActiveBrochure,
} from "@/services/documents";

export default function AdminPengaturanPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    contact_phone: "0811-3021-919",
    contact_email: "info@smktelkom-sda.sch.id",
    ppdb_status: "Buka - Gelombang 1",
    ppdb_active_brochure_id: "",
    announcement_banner_enabled: "false",
    announcement_banner_text: "Pendaftaran PPDB 2026/2027 Gelombang Khusus Telhat Dibuka! Dapatkan beasiswa prestasi.",
  });

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeBrochure, setActiveBrochureState] = useState<DocumentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const [resSettings, docList, brochure] = await Promise.all([
          getSiteSettings(),
          getAdminDocumentList(),
          getActiveBrochure(),
        ]);
        if (resSettings.map && Object.keys(resSettings.map).length > 0) {
          setSettings((prev) => ({ ...prev, ...resSettings.map }));
        }
        setDocuments(docList);
        setActiveBrochureState(brochure);
      } catch {
        showToast("Gagal memuat pengaturan situs", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const keys = Object.keys(settings);
      for (const k of keys) {
        await updateSiteSetting(k, settings[k]);
      }
      if (settings.ppdb_active_brochure_id) {
        await setActiveBrochure(settings.ppdb_active_brochure_id);
      }
      const updatedBrochure = await getActiveBrochure();
      setActiveBrochureState(updatedBrochure);
      showToast("Seluruh pengaturan berhasil disimpan ke database!");
    } catch {
      showToast("Gagal menyimpan beberapa pengaturan", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Pengaturan Website"
      subtitle="Kelola kontak resmi, status PPDB berjalan, dan banner pengumuman darurat"
      actions={
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
        >
          <Save className="size-4" />
          <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </button>
      }
    >
      <div className="space-y-6 max-w-4xl">
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

        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* Card 1: Kontak & Komunikasi Sekolah */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-[#bc0c11]">
                <Phone className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Kontak Resmi & Komunikasi Humas
                </h3>
                <p className="text-xs text-slate-500">
                  Digunakan pada header, footer, dan referensi AI Chatbot
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nomor WhatsApp Humas Resmi
                </label>
                <input
                  type="text"
                  value={settings.contact_phone || ""}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                  placeholder="Contoh: 0811-3021-919"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Alamat Email Resmi Sekolah
                </label>
                <input
                  type="email"
                  value={settings.contact_email || ""}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  placeholder="Contoh: info@smktelkom-sda.sch.id"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: PPDB & Penerimaan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <GraduationCap className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Status Penerimaan Siswa Baru (PPDB) & Brosur Resmi
                </h3>
                <p className="text-xs text-slate-500">
                  Menentukan label status PPDB berjalan serta dokumen brosur yang tampil di tombol &quot;Lihat Brosur&quot;
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Status Pendaftaran Berjalan
                </label>
                <input
                  type="text"
                  value={settings.ppdb_status || ""}
                  onChange={(e) => handleChange("ppdb_status", e.target.value)}
                  placeholder="Contoh: Buka - Gelombang 1"
                  className="w-full sm:max-w-md rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
              </div>

              {/* Brosur PPDB Aktif */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Pilih Dokumen Brosur PPDB Aktif
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8">
                    <AdminSelect
                      value={settings.ppdb_active_brochure_id || (activeBrochure?.id ? String(activeBrochure.id) : "")}
                      onChange={(val) => handleChange("ppdb_active_brochure_id", val)}
                      options={[
                        { label: "-- Otomatis (Brosur Terbaru) --", value: "" },
                        ...documents
                          .filter(
                            (d) =>
                              d.category === "Brosur PPDB" ||
                              d.category === "Unduh Informasi" ||
                              d.title.toLowerCase().includes("brosur")
                          )
                          .map((d) => ({
                            label: `${d.title} (${d.fileType || "PDF"} • ${d.fileSize || "Berkas"})`,
                            value: String(d.id),
                          })),
                      ]}
                      placeholder="Pilih Dokumen Brosur"
                    />
                  </div>
                  <div className="sm:col-span-4 flex items-center gap-2">
                    <Link
                      href="/admin/dokumen"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#bc0c11] bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <FileText className="size-3.5" />
                      <span>Kelola di Dokumen</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>

                {activeBrochure && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Brosur Aktif Terdeteksi</span>
                      <p className="font-semibold text-slate-800 truncate">{activeBrochure.title}</p>
                    </div>
                    {activeBrochure.fileUrl && (
                      <a
                        href={activeBrochure.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline shrink-0"
                      >
                        <span>Pratinjau</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Banner Pengumuman Darurat */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Megaphone className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Banner Pengumuman Darurat (Top Notification)
                </h3>
                <p className="text-xs text-slate-500">
                  Tampilkan pengumuman penting di bilah paling atas situs
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="banner-toggle"
                  checked={settings.announcement_banner_enabled === "true"}
                  onChange={(e) =>
                    handleChange("announcement_banner_enabled", e.target.checked ? "true" : "false")
                  }
                  className="size-4 rounded-md border-slate-300 text-[#bc0c11] focus:ring-red-500 accent-[#bc0c11] cursor-pointer"
                />
                <label htmlFor="banner-toggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Aktifkan Banner Pengumuman Darurat di Website
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Teks Pengumuman
                </label>
                <textarea
                  rows={2}
                  value={settings.announcement_banner_text || ""}
                  onChange={(e) => handleChange("announcement_banner_text", e.target.value)}
                  placeholder="Ketik teks pengumuman penting..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none resize-y custom-scrollbar"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#bc0c11] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#990a0e] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Menyimpan ke Server..." : "Simpan Semua Pengaturan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
